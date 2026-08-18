import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function SiteFooter({ site }: { site: ManagedSiteConfig }) {
  return (
    <footer className="footer-maison">
      <div className="container footer-maison-grid">
        <div className="footer-maison-brand">
          <Logo name={site.name} shortName={site.shortName} />
          <p>{site.description}</p>
          <div className="footer-maison-trust">
            <ShieldCheck size={16} />
            <span>Cam kết vật tư chính hãng 100% · Bảo hành đến 5 năm</span>
          </div>
          <div className="footer-maison-actions">
            <a href={site.zaloHref} target="_blank" rel="noreferrer" className="footer-zalo-btn">
              <MessageCircle size={16} /> Chat Zalo Nhận Báo Giá
            </a>
          </div>
        </div>

        <div>
          <h3>Sản Phẩm</h3>
          <div className="footer-maison-links">
            <Link href="/san-pham?category=cua-cuon-khe-thoang">Cửa cuốn khe thoáng</Link>
            <Link href="/san-pham?category=cua-cuon-tam-lien">Cửa cuốn tấm liền</Link>
            <Link href="/san-pham?category=cua-cuon-trong-suot">Cửa cuốn trong suốt</Link>
            <Link href="/san-pham?category=cua-cuon-cong-nghiep">Cửa cuốn công nghiệp</Link>
            <Link href="/san-pham?category=motor-cua-cuon">Motor cửa cuốn & Remote</Link>
            <Link href="/san-pham">Phụ kiện & Bình lưu điện</Link>
          </div>
        </div>

        <div>
          <h3>Dịch Vụ & Dự Án</h3>
          <div className="footer-maison-links">
            <Link href="/dich-vu">Lắp đặt cửa cuốn trọn gói</Link>
            <Link href="/dich-vu">Sửa chữa & Cứu hộ 24/7</Link>
            <Link href="/dich-vu">Bảo dưỡng định kỳ</Link>
            <Link href="/du-an">Công trình biệt thự tiêu biểu</Link>
            <Link href="/du-an">Dự án nhà phố & Shophouse</Link>
            <Link href="/ve-chung-toi">Về Minh Tâm Mitadoor</Link>
          </div>
        </div>

        <div>
          <h3>Thông Tin Liên Hệ</h3>
          <div className="footer-maison-contact">
            <a href={site.hotlineHref} className="footer-hotline-highlight">
              <Phone size={16} />
              <div className="footer-hotline-text">
                <small>TỔNG ĐÀI 24/7</small>
                <b>{site.hotline}</b>
              </div>
            </a>
            <a href={site.mapsHref} target="_blank" rel="noreferrer">
              <MapPin size={16} />
              <span>{site.address}</span>
            </a>
            <a href={`mailto:${site.email}`}>
              <Mail size={16} />
              <span>{site.email}</span>
            </a>
            <div>
              <Clock3 size={16} />
              <span>{site.hours} — Phục vụ toàn TP.HCM & lân cận</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-maison-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Giữ toàn quyền tác quyền & nội dung.</span>
        <div>
          <Link href="/ve-chung-toi">Về chúng tôi</Link>
          <Link href="/san-pham">Catalog sản phẩm</Link>
          <Link href="/du-an">Hồ sơ công trình</Link>
          <Link href="/lien-he">Liên hệ & Báo giá</Link>
        </div>
      </div>
    </footer>
  );
}

