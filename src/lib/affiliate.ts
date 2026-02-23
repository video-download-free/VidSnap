/**
 * Affiliate Link Configuration
 *
 * Cấu hình link affiliate tại đây. Bạn có thể thay đổi các giá trị
 * để hiển thị banner quảng cáo affiliate trên trang web.
 *
 * Để bật affiliate banner, đặt `enabled: true` và cập nhật các thông tin bên dưới.
 */

interface AffiliateConfig {
  /** Bật/tắt hiển thị affiliate banner */
  enabled: boolean;
  /** Tiêu đề banner */
  title: string;
  /** Mô tả ngắn */
  description: string;
  /** Nội dung nút CTA */
  ctaText: string;
  /** Link affiliate */
  url: string;
  /** Tracking ID (tùy chọn) */
  trackingId?: string;
}

// ===== CẤU HÌNH AFFILIATE TẠI ĐÂY =====
const affiliateConfig: AffiliateConfig = {
  enabled: true,

  // Thay đổi các giá trị dưới đây với link affiliate thật của bạn
  title: "🔥 Nâng Cấp Trải Nghiệm Của Bạn",
  description:
    "Trải nghiệm tải video nhanh hơn 10x với Premium VPN. Bảo mật tuyệt đối, tốc độ siêu nhanh.",
  ctaText: "Nhận Ưu Đãi Đặc Biệt",
  url: "https://example.com/affiliate?ref=savevid", // 👈 Thay link affiliate thật tại đây
  trackingId: "savevid-main-banner",
};

export function getAffiliateConfig(): AffiliateConfig {
  return affiliateConfig;
}

/**
 * Danh sách các vị trí có thể đặt affiliate link:
 *
 * 1. AffiliateBanner component - Banner lớn trên trang chủ
 * 2. Trong trang kết quả tải video (giữa các format)
 * 3. Footer links
 * 4. Popup sau khi tải video thành công
 *
 * Bạn có thể mở rộng file này để thêm nhiều config cho từng vị trí.
 */

interface AffiliateLink {
  id: string;
  label: string;
  url: string;
  position: "banner" | "result" | "footer" | "popup";
}

const affiliateLinks: AffiliateLink[] = [
  {
    id: "main-banner",
    label: "Premium VPN",
    url: "https://example.com/vpn?ref=savevid",
    position: "banner",
  },
  {
    id: "result-ad",
    label: "Video Editor Pro",
    url: "https://example.com/editor?ref=savevid",
    position: "result",
  },
  // Thêm link affiliate mới tại đây
];

export function getAffiliateLinks(
  position?: AffiliateLink["position"],
): AffiliateLink[] {
  if (position) {
    return affiliateLinks.filter((link) => link.position === position);
  }
  return affiliateLinks;
}
