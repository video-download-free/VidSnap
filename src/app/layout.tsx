import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VidSnap — Công cụ tải video đa nền tảng số 1",
  description:
    "Tải video chất lượng cao từ YouTube, TikTok (Douyin), Instagram, Bilibili chỉ với 1 click. Miễn phí, không quảng cáo, bảo mật tuyệt đối.",
  icons: {
    icon: "/favicon.png?v=2",
    shortcut: "/favicon.png?v=2",
    apple: "/favicon.png?v=2",
  },
  keywords: [
    "download video",
    "tải video youtube",
    "tải video tiktok",
    "tải video douyin",
    "tải video bilibili",
    "instagram video downloader",
    "vidsnap",
    "tải video 4k",
  ],
  openGraph: {
    title: "VidSnap — Tải Video Đa Nền Tảng",
    description:
      "Công cụ tải video tốt nhất cho YouTube, TikTok, Facebook, Instagram và Bilibili.",
    type: "website",
    siteName: "VidSnap",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VidSnap — Tải Video Miễn Phí",
    description: "Tải video HD từ YouTube, TikTok, Bilibili trong 1 giây.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {/* Animated Background Effects */}
        <div className="bg-grid" />
        <div className="bg-glow bg-glow--purple" />
        <div className="bg-glow bg-glow--blue" />
        <div className="bg-glow bg-glow--pink" />

        {children}
      </body>
    </html>
  );
}
