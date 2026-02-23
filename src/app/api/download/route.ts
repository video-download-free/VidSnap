import { NextRequest } from "next/server";
import { spawn } from "child_process";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoUrl = searchParams.get("url");
  const formatId = searchParams.get("format_id") || "best";

  if (!videoUrl) {
    return new Response("Missing URL", { status: 400 });
  }

  let url = videoUrl.trim();
  if (url.includes("douyin.com/jingxuan")) {
    try {
      const urlObj = new URL(url);
      const modalId = urlObj.searchParams.get("modal_id");
      if (modalId) url = `https://www.douyin.com/video/${modalId}`;
    } catch {}
  }

  try {
    // Cấu hình tham số cho yt-dlp
    // -o - : Xuất kết quả ra stdout để chúng ta pipe về cho client
    // -f : Chọn đúng format_id người dùng đã click
    const ytdlpPath =
      "/Library/Frameworks/Python.framework/Versions/3.13/bin/yt-dlp";
    const ffmpegPath = "/opt/homebrew/bin/ffmpeg";

    // Phân loại cấu hình theo nền tảng
    const isDouyin =
      url.includes("douyin.com") || url.includes("iesdouyin.com");
    const isBilibili = url.includes("bilibili.com") || url.includes("b23.tv");

    const ytdlpArgs = [
      "-f",
      formatId === "best"
        ? "bestvideo[vcodec^=avc1][ext=mp4]+bestaudio[ext=m4a]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
        : formatId,
      url,
      "-o",
      "-",
      "--no-playlist",
      "--no-part",
      "--no-cache-dir",
      "--no-check-certificate",
      "--user-agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "--add-header",
      `Referer:${url}`,
    ];

    // Chỉ áp dụng Cookies cho Douyin/Bilibili vì chúng yêu cầu nghiêm ngặt
    if (isDouyin || isBilibili) {
      ytdlpArgs.push("--cookies-from-browser", "chrome");
      ytdlpArgs.push(
        "--add-header",
        "Accept-Language: zh-CN,zh;q=0.9,en;q=0.8",
      );
    }

    if (isBilibili) {
      ytdlpArgs.push("--extractor-args", "bilibili:videomode=html5");
    }

    const ytdlp = spawn(ytdlpPath, ytdlpArgs);

    // Quy trình remux qua ffmpeg để đảm bảo MP4 chuẩn và mở được trên Mac
    const ffmpegArgs = [
      "-i",
      "pipe:0",
      "-c",
      "copy",
      "-bsf:a",
      "aac_adtstoasc", // Sửa lỗi AAC bitstream khi mux sang mp4
      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov+default_base_moof",
      "pipe:1",
    ];
    const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

    // Pipe ytdlp sang ffmpeg
    ytdlp.stdout.pipe(ffmpeg.stdin);

    // Tạo một ReadableStream từ stdout của ffmpeg
    const stream = new ReadableStream({
      start(controller) {
        ffmpeg.stdout.on("data", (chunk) => {
          controller.enqueue(new Uint8Array(chunk));
        });

        ffmpeg.stdout.on("end", () => {
          controller.close();
        });

        ffmpeg.stderr.on("data", (data) => {
          const msg = data.toString();
          // Chỉ log lỗi nghiêm trọng
          if (
            msg.includes("error") ||
            msg.includes("Operation not permitted")
          ) {
            console.error(`ffmpeg stderr: ${msg}`);
          }
        });

        ytdlp.stderr.on("data", (data) => {
          const msg = data.toString();
          if (msg.includes("ERROR")) {
            console.error(`yt-dlp ERROR: ${msg}`);
          }
        });

        const cleanup = () => {
          ytdlp.kill();
          ffmpeg.kill();
        };

        // Đảm bảo kill processes nếu client ngắt kết nối
        request.signal.addEventListener("abort", cleanup);
      },
      cancel() {
        ytdlp.kill();
        ffmpeg.kill();
      },
    });

    let filename = searchParams.get("filename") || "vidsnap_download";
    // Loại bỏ ký tự không hợp lệ trong tên file
    filename = filename.replace(/[/\\?%*:|"<>]/g, "-");
    if (!filename.endsWith(".mp4")) {
      filename += ".mp4";
    }

    // Trả về stream trực tiếp
    return new Response(stream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download stream error:", error);
    return new Response("Lỗi trong quá trình tải video", { status: 500 });
  }
}
