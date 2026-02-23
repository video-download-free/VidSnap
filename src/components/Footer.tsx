import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__brand-icon">
            <Image
              src="/logo.png"
              alt="VidSnap Logo"
              width={20}
              height={20}
              style={{ objectFit: "contain" }}
            />
          </div>
          <span>VidSnap</span>
        </div>

        <p className="footer__copy">
          © {currentYear} VidSnap. Save anything, anywhere.
        </p>

        <div className="footer__links">
          <a href="#" className="footer__link">
            Điều khoản
          </a>
          <a href="#" className="footer__link">
            Bảo mật
          </a>
          <a href="#" className="footer__link">
            Liên hệ
          </a>
        </div>
      </div>
    </footer>
  );
}
