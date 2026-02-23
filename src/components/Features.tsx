export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Tốc Độ Ánh Sáng",
      desc: "Xử lý & tải video chỉ trong vài giây. Server trung gian tối ưu hóa tốc độ stream.",
    },
    {
      icon: "🔒",
      title: "An Toàn Tuyệt Đối",
      desc: "Zero storage — video không bao giờ lưu trên server. Mọi dữ liệu stream trực tiếp từ nguồn.",
    },
    {
      icon: "🎯",
      title: "Chọn Chất Lượng",
      desc: "Từ 360p tiết kiệm data đến Full HD 1080p. Hỗ trợ cả video và audio riêng biệt.",
    },
    {
      icon: "🌐",
      title: "Đa Nền Tảng",
      desc: "YouTube, TikTok, Instagram — một công cụ cho tất cả. Hoạt động trên mọi trình duyệt.",
    },
    {
      icon: "💎",
      title: "Hoàn Toàn Miễn Phí",
      desc: "Không mất phí, không quảng cáo phiền. Không cần tạo tài khoản để sử dụng.",
    },
    {
      icon: "♾️",
      title: "Không Giới Hạn",
      desc: "Tải bao nhiêu tùy thích, 24/7. Không giới hạn số lượng hay dung lượng hàng ngày.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-label">✨ Tính Năng</span>
          <h2 className="section-title">Tại Sao Chọn VidSnap?</h2>
          <p className="section-subtitle">
            Công cụ tải video mạnh mẽ, an toàn và hoàn toàn miễn phí
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card glass-card">
              <div className="feature-card__icon">{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
