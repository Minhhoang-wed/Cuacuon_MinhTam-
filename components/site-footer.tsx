import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { mainNavigation } from "@/data/site";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function SiteFooter({ site }: { site: ManagedSiteConfig }) {
  return (
    <footer className="footer-navy">
      <div className="container footer-navy-grid">
        <div className="footer-navy-brand">
          <Logo name={site.name} shortName={site.shortName} />
          <p>{site.description}</p>
          <a className="footer-zalo" href={site.zaloHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Tư vấn qua Zalo</a>
        </div>

        <div>
          <h3>Điều hướng</h3>
          <div className="footer-navy-links">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3>Sản phẩm</h3>
          <div className="footer-navy-links">
            <Link href="/san-pham">Cửa cuốn khe thoáng</Link>
            <Link href="/san-pham">Cửa cuốn tấm liền</Link>
            <Link href="/san-pham">Motor cửa cuốn</Link>
            <Link href="/san-pham">Bộ lưu điện</Link>
            <Link href="/san-pham">Phụ kiện & linh kiện</Link>
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
        <div><Link href="/lien-he">Chính sách bảo hành</Link><Link href="/lien-he">Chính sách bảo mật</Link><Link href="/admin/login">Quản trị</Link></div>
      </div>
    </footer>
  );
}
