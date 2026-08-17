import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function SiteFooter({ site }: { site: ManagedSiteConfig }) {
  return (
    <footer className="footer-navy">
      <div className="container footer-navy-grid">
        <div className="footer-navy-brand">
          <Logo name={site.name} shortName={site.shortName} />
          <p>{site.description}</p>
          <span className="footer-license">Phục vụ: {site.serviceArea}</span>
        </div>

        <div>
          <h3>Sản phẩm</h3>
          <div className="footer-navy-links">
            <Link href="/san-pham">Cửa cuốn khe thoáng</Link>
            <Link href="/san-pham">Cửa cuốn tấm liền</Link>
            <Link href="/san-pham">Cửa cuốn trong suốt</Link>
            <Link href="/san-pham">Cửa cuốn công nghiệp</Link>
            <Link href="/san-pham">Motor cửa cuốn</Link>
            <Link href="/san-pham">Phụ kiện & linh kiện</Link>
          </div>
        </div>

        <div>
          <h3>Dịch vụ</h3>
          <div className="footer-navy-links">
            <Link href="/dich-vu">Lắp đặt cửa cuốn trọn gói</Link>
            <Link href="/dich-vu">Sửa chữa cửa cuốn 24/7</Link>
            <Link href="/dich-vu">Thay motor & remote</Link>
            <Link href="/dich-vu">Bảo trì định kỳ</Link>
            <Link href="/dich-vu">Thay nan, thay ray dẫn hướng</Link>
          </div>
        </div>

        <div>
          <h3>Liên hệ</h3>
          <div className="footer-navy-contact">
            <a href={site.hotlineHref}><Phone size={14} /> {site.hotline}</a>
            <a href={`mailto:${site.email}`}><Mail size={14} /> {site.email}</a>
            <span><MapPin size={14} /> {site.address}</span>
            <span><Clock3 size={14} /> {site.hours}</span>
          </div>
        </div>
      </div>

      <div className="container footer-navy-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Bảo lưu mọi quyền.</span>
        <div><Link href="/lien-he">Chính sách bảo hành</Link><Link href="/lien-he">Chính sách bảo mật</Link><Link href="/lien-he">Điều khoản sử dụng</Link></div>
      </div>
    </footer>
  );
}
