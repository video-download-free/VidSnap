export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          <span>
            100% miễn phí &bull; Không giới hạn &bull; An toàn tuyệt đối
          </span>
        </div>

        <h1 className="hero__title">
          1 Click Tải Video
          <span className="hero__title-line2">
            Từ <span className="hero__title-gradient">Mọi Nền Tảng</span>
          </span>
        </h1>

        <p className="hero__subtitle">
          Chỉ cần dán link — tải ngay video chất lượng cao từ YouTube, TikTok,
          Instagram. Không cài đặt, không đăng ký, không phiền phức.
        </p>

        <div className="hero__platforms">
          <div className="hero__platform hero__platform--youtube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <span>YouTube</span>
          </div>
          <div className="hero__platform hero__platform--tiktok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.28 1.03-1.58 1.74-.45.95-.53 2.09-.17 3.07.36 1 1.09 1.86 2.02 2.36 1.08.61 2.4.68 3.51.17 1.03-.44 1.87-1.32 2.21-2.36.19-.6.25-1.23.23-1.85.03-4.27.02-8.54.02-12.81z" />
            </svg>
            <span>TikTok / Douyin</span>
          </div>
          <div className="hero__platform hero__platform--instagram">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Instagram</span>
          </div>
          <div className="hero__platform hero__platform--bilibili">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.813 4.653h.854c1.51.054 2.713 1.29 2.713 2.812v10.122c0 1.51-1.202 2.75-2.713 2.812h-13.334c-1.51-.062-2.713-1.302-2.713-2.812V7.465c0-1.522 1.202-2.758 2.713-2.812h.854L5.136 2.59a.301.301 0 0 1 .15-.38.307.307 0 0 1 .4.15l1.621 2.293h9.387l1.621-2.293a.301.301 0 0 1 .4-.15.307.307 0 0 1 .15.38l-1.052 2.063zM5.333 17.551h13.334c.54-.031 1.04-.378 1.04-.812V7.465c0-.434-.5-.781-1.04-.812H5.333c-.54.031-1.04.378-1.04.812v9.274c0 .434.5.781 1.04.812zM8.333 9.49c1.104 0 2 .895 2 2s-.896 2-2 2-2-.895-2-2 .896-2 2-2zm7.334 0c1.104 0 2 .895 2 2s-.896 2-2 2-2-.895-2-2 .896-2 2-2z" />
            </svg>
            <span>Bilibili</span>
          </div>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <div className="hero__stat-value">10M+</div>
            <div className="hero__stat-label">Video đã tải</div>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <div className="hero__stat-value">500K+</div>
            <div className="hero__stat-label">Người dùng</div>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <div className="hero__stat-value">99.9%</div>
            <div className="hero__stat-label">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
