"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header" id="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          <div className="header__logo-icon">
            <Image
              src="/logo.png"
              alt="VidSnap Logo"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="header__logo-group">
            <span className="header__logo-text">VidSnap</span>
            <span className="header__logo-slogan">Save anything, anywhere</span>
          </div>
        </Link>

        <nav className="header__nav">
          <a href="#downloader" className="header__link">
            Tải Video
          </a>
          <a href="#features" className="header__link">
            Tính Năng
          </a>
          <a href="#platforms" className="header__link">
            Nền Tảng
          </a>
          <a href="#faq" className="header__link">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
