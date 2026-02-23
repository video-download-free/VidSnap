"use client";

import { useState, FormEvent } from "react";

interface VideoFormat {
  quality: string;
  format: string;
  size: string;
  url: string;
  type: "video" | "audio";
}

interface VideoResult {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  platform: string;
  formats: VideoFormat[];
}

function detectPlatform(url: string): string | null {
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube.com/shorts")
  ) {
    return "youtube";
  }
  if (
    url.includes("tiktok.com") ||
    url.includes("iesdouyin.com") ||
    url.includes("douyin.com")
  ) {
    return "tiktok";
  }
  if (url.includes("instagram.com")) {
    return "instagram";
  }
  if (url.includes("bilibili.com") || url.includes("b23.tv")) {
    return "bilibili";
  }
  return null;
}

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Vui lòng nhập link video");
      return;
    }

    const platform = detectPlatform(trimmedUrl);
    if (!platform) {
      setError(
        "Link không hợp lệ. Vui lòng nhập link từ YouTube, TikTok hoặc Instagram.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/video-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        let msg = data.error || "Không thể lấy thông tin video";
        if (data.detail && data.detail.includes("Fresh cookies")) {
          msg =
            "Nền tảng này (Douyin/Bilibili) yêu cầu Cookies sạch. Thử truy cập trang web đó trên trình duyệt của bạn trước rồi thử lại.";
        }
        throw new Error(msg);
      }

      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (downloadUrl: string, title: string) => {
    // Kích hoạt việc tải trực tiếp bằng hidden anchor
    const link = document.createElement("a");
    // Mã hóa tiêu đề để truyền qua URL safely
    const url = new URL(downloadUrl, window.location.origin);
    url.searchParams.set("filename", title);

    link.href = url.toString();
    // Chúng ta không set target=_blank ở đây để trình duyệt tự động handler file stream
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <section className="downloader" id="downloader">
        <div className="container">
          <div className="downloader__card glass-card">
            <form onSubmit={handleSubmit}>
              <div className="downloader__input-group">
                <div className="downloader__input-wrapper">
                  <span className="downloader__input-icon">🔗</span>
                  <input
                    id="video-url-input"
                    type="url"
                    className="downloader__input"
                    placeholder="Dán link video YouTube, TikTok hoặc Instagram..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    autoComplete="off"
                  />
                </div>
                <button
                  id="download-btn"
                  type="submit"
                  className={`downloader__btn ${loading ? "downloader__btn--loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="downloader__btn-spinner" />
                  ) : null}
                  {loading ? "Đang xử lý..." : "Tải Video"}
                </button>
              </div>
            </form>

            <div className="downloader__hint">
              <span className="downloader__hint-icon">💡</span>
              <span>
                Dán link từ YouTube, TikTok hoặc Instagram để tải video chất
                lượng cao
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="container">
          <div className="error-msg">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="container">
          <div className="result">
            <div className="result__card glass-card">
              <div className="result__header">
                <div className="result__thumbnail">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.thumbnail} alt={result.title} />
                  {result.duration && (
                    <span className="result__thumbnail-duration">
                      {result.duration}
                    </span>
                  )}
                </div>
                <div className="result__info">
                  <span
                    className={`result__platform-badge result__platform-badge--${result.platform}`}
                  >
                    {result.platform === "youtube" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ marginRight: "6px" }}
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    )}
                    {result.platform === "tiktok" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ marginRight: "6px" }}
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.28 1.03-1.58 1.74-.45.95-.53 2.09-.17 3.07.36 1 1.09 1.86 2.02 2.36 1.08.61 2.4.68 3.51.17 1.03-.44 1.87-1.32 2.21-2.36.19-.6.25-1.23.23-1.85.03-4.27.02-8.54.02-12.81z" />
                      </svg>
                    )}
                    {(result.platform === "tiktok" ||
                      result.platform === "douyin") &&
                    result.platform === "tiktok"
                      ? "TikTok / Douyin"
                      : ""}
                    {result.platform === "youtube" && "YouTube"}
                    {result.platform === "instagram" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "6px" }}
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        ></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    )}
                    {result.platform === "instagram" && "Instagram"}
                    {result.platform === "douyin" && "TikTok / Douyin"}
                    {result.platform === "bilibili" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ marginRight: "6px" }}
                      >
                        <path d="M17.813 4.653h.854c1.51.054 2.713 1.29 2.713 2.812v10.122c0 1.51-1.202 2.75-2.713 2.812h-13.334c-1.51-.062-2.713-1.302-2.713-2.812V7.465c0-1.522 1.202-2.758 2.713-2.812h.854L5.136 2.59a.301.301 0 0 1 .15-.38.307.307 0 0 1 .4.15l1.621 2.293h9.387l1.621-2.293a.301.301 0 0 1 .4-.15.307.307 0 0 1 .15.38l-1.052 2.063zM5.333 17.551h13.334c.54-.031 1.04-.378 1.04-.812V7.465c0-.434-.5-.781-1.04-.812H5.333c-.54.031-1.04.378-1.04.812v9.274c0 .434.5.781 1.04.812zM8.333 9.49c1.104 0 2 .895 2 2s-.896 2-2 2-2-.895-2-2 .896-2 2-2zm7.334 0c1.104 0 2 .895 2 2s-.896 2-2 2-2-.895-2-2 .896-2 2-2z" />
                      </svg>
                    )}
                    {result.platform === "bilibili" && "Bilibili"}
                  </span>
                  <h3 className="result__title">{result.title}</h3>
                  <p className="result__meta">{result.author}</p>
                </div>
              </div>

              <div className="result__downloads">
                <p className="result__downloads-title">📥 Chọn chất lượng:</p>
                {result.formats.map((format, index) => (
                  <div key={index} className="result__download-row">
                    <div className="result__download-info">
                      <span className="result__download-quality">
                        {format.quality}
                      </span>
                      <span className="result__download-type">
                        {format.format.toUpperCase()}
                      </span>
                      {format.size && (
                        <span className="result__download-size">
                          {format.size}
                        </span>
                      )}
                    </div>
                    <button
                      className="result__download-btn"
                      onClick={() => handleDownload(format.url, result.title)}
                    >
                      ⬇ Tải về
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
