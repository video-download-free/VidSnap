import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

interface VideoFormat {
  quality: string;
  format: string;
  size: string;
  url: string;
  type: "video" | "audio";
  format_id: string;
}

function detectPlatform(url: string): string | null {
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube.com/shorts")
  )
    return "youtube";
  if (
    url.includes("tiktok.com") ||
    url.includes("iesdouyin.com") ||
    url.includes("douyin.com")
  )
    return "tiktok";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("bilibili.com") || url.includes("b23.tv")) return "bilibili";
  return null;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0)
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "N/A";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function normalizeUrl(url: string): string {
  const normalized = url.trim();
  // Douyin normalization
  if (normalized.includes("douyin.com/jingxuan")) {
    try {
      const urlObj = new URL(normalized);
      const modalId = urlObj.searchParams.get("modal_id");
      if (modalId) {
        return `https://www.douyin.com/video/${modalId}`;
      }
    } catch {}
  }
  return normalized;
}

export async function POST(request: NextRequest) {
  try {
    let { url } = await request.json();
    if (!url)
      return NextResponse.json(
        { error: "Vui lòng cung cấp link video" },
        { status: 400 },
      );

    url = normalizeUrl(url);
    const platform = detectPlatform(url);
    if (!platform)
      return NextResponse.json(
        { error: "Link không được hỗ trợ" },
        { status: 400 },
      );

    const ytdlpPath =
      "/Library/Frameworks/Python.framework/Versions/3.13/bin/yt-dlp";
    let stdout;

    // Phân loại nền tảng
    const isDouyin =
      url.includes("douyin.com") || url.includes("iesdouyin.com");
    const isBilibili = url.includes("bilibili.com") || url.includes("b23.tv");

    try {
      const commonArgs = [
        "--no-playlist",
        "--no-warning",
        "--no-check-certificate",
        '--user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"',
        `--add-header "Referer:${url}"`,
      ];

      if (isBilibili) {
        commonArgs.push('--extractor-args "bilibili:videomode=html5"');
      }

      if (isDouyin || isBilibili) {
        commonArgs.push(
          '--add-header "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8"',
        );
      }

      const argsStr = commonArgs.join(" ");

      let result;
      if (isDouyin || isBilibili) {
        // Ưu tiên cookies cho Douyin/Bilibili
        result = await execPromise(
          `${ytdlpPath} -j "${url}" ${argsStr} --cookies-from-browser chrome`,
        )
          .catch(() =>
            execPromise(
              `${ytdlpPath} -j "${url}" ${argsStr} --cookies-from-browser safari`,
            ),
          )
          .catch(() => execPromise(`${ytdlpPath} -j "${url}" ${argsStr}`));
      } else {
        // Các nền tảng khác (YT, IG): Ưu tiên KHÔNG dùng cookies trình duyệt để tránh lỗi Locked DB
        result = await execPromise(`${ytdlpPath} -j "${url}" ${argsStr}`).catch(
          () =>
            execPromise(
              `${ytdlpPath} -j "${url}" ${argsStr} --cookies-from-browser chrome`,
            ),
        );
      }

      stdout = result.stdout;
    } catch (err: unknown) {
      console.error("yt-dlp execution error:", err);
      const errorMsg =
        (err as { stderr: string; message: string }).stderr ||
        (err as { stderr: string; message: string }).message ||
        "";
      let userFriendlyError = "Không thể lấy thông tin video. ";

      if (errorMsg.includes("Fresh cookies")) {
        userFriendlyError +=
          "Nền tảng này yêu cầu Cookies hoặc phiên đăng nhập mới.";
      } else if (errorMsg.includes("Unsupported URL")) {
        userFriendlyError +=
          "Link video không được hỗ trợ hoặc định dạng link không đúng.";
      } else {
        userFriendlyError += "Vui lòng kiểm tra lại link hoặc thử lại sau.";
      }

      return NextResponse.json(
        { error: userFriendlyError, detail: errorMsg },
        { status: 500 },
      );
    }

    if (!stdout) {
      return NextResponse.json(
        { error: "Không nhận được dữ liệu từ hệ thống tải." },
        { status: 500 },
      );
    }

    const info = JSON.parse(stdout);

    const formats: VideoFormat[] = [];

    if (platform === "youtube") {
      // Ưu tiên các định dạng có cả video và audio (kết hợp sẵn) để tránh lỗi không tiếng
      const muxedFormats = (
        info.formats as Array<{
          vcodec: string;
          acodec: string;
          ext: string;
          height: number;
          filesize?: number;
          filesize_approx?: number;
          format_id: string;
        }>
      )
        .filter(
          (f) =>
            f.vcodec !== "none" &&
            f.acodec !== "none" &&
            (f.ext === "mp4" || f.ext === "webm"),
        )
        .sort((a, b) => (b.height || 0) - (a.height || 0));

      const addedQualities = new Set<string>();

      for (const f of muxedFormats) {
        const qualityLabel = `${f.height}p`;
        if (addedQualities.has(qualityLabel)) continue;
        addedQualities.add(qualityLabel);

        formats.push({
          quality: qualityLabel,
          format: f.ext,
          size: formatFileSize(f.filesize || f.filesize_approx || 0),
          url: `/api/download?url=${encodeURIComponent(url)}&format_id=${f.format_id}&platform=youtube`,
          type: "video",
          format_id: f.format_id,
        });
      }

      // Thêm Audio Only
      const bestAudio = (
        info.formats as Array<{
          vcodec: string;
          acodec: string;
          ext: string;
          abr?: number;
          filesize?: number;
          filesize_approx?: number;
          format_id: string;
        }>
      )
        .filter((f) => f.vcodec === "none" && f.acodec !== "none")
        .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];

      if (bestAudio) {
        formats.push({
          quality: `${bestAudio.abr || 128}kbps`,
          format: bestAudio.ext,
          size: formatFileSize(
            bestAudio.filesize || bestAudio.filesize_approx || 0,
          ),
          url: `/api/download?url=${encodeURIComponent(url)}&format_id=${bestAudio.format_id}&platform=youtube`,
          type: "audio",
          format_id: bestAudio.format_id,
        });
      }
    } else {
      // TikTok/Instagram thường chỉ có 1 định dạng tốt nhất
      formats.push({
        quality: "HD",
        format: "mp4",
        size: formatFileSize(info.filesize || info.filesize_approx || 0),
        url: `/api/download?url=${encodeURIComponent(url)}&platform=${platform}`,
        type: "video",
        format_id: "best",
      });
    }

    return NextResponse.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: formatDuration(info.duration),
      author: info.uploader || info.channel || info.author || "Unknown",
      platform: platform as unknown,
      formats,
    });
  } catch (error: unknown) {
    console.error("yt-dlp error:", error);
    return NextResponse.json(
      { error: "Không thể lấy thông tin video. Hãy đảm bảo link chính xác." },
      { status: 500 },
    );
  }
}
