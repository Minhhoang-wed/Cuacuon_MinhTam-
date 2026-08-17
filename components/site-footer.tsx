import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { mainNavigation } from "@/data/site";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function SiteFooter({ site }: { site: ManagedSiteConfig }) {
  return (
    <footer className="footer-navy">
      <div className="container footer-navy-grid">
        {/* Brand */}
        <div className="footer-navy-brand">
          <Logo name={site.name} shortName={site.shortName} />
          <p>Chuyên cung cấp, lắp đặt, sửa chữa cửa cuốn chuyên nghiệp, uy tín hàng đầu tại Việt Nam.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3>LIÊN KẾT NHANH</h3>
          <div className="footer-navy-links">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h3>SẢN PHẨM</h3>
          <div className="footer-navy-links">
            <Link href="/san-pham">Cửa cuốn khe thoáng</Link>
            <Link href="/san-pham">Cửa cuốn tấm liền</Link>
            <Link href="/san-pham">Cửa cuốn Đức</Link>
            <Link href="/san-pham">Cửa cuốn siêu trường</Link>
            <Link href="/san-pham">Cửa cuốn nhanh</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <div className="footer-navy-contact">
            <a href={site.hotlineHref}><Phone size={14} /> Hotline: {site.hotline}</a>
            <a href={`mailto:${site.email}`}><Mail size={14} /> {site.email}</a>
            <span><MapPin size={14} /> {site.address}</span>
            <span><Clock3 size={14} /> Thời gian: 24/7 (tất cả các ngày)</span>
          </div>
        </div>
      </div>

      <div className="container footer-navy-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <Link href="/admin/login">Quản trị nội dung</Link>
      </div>
    </footer>
  );
}
