"use client";

import { ChevronDown, Mail, MapPin, Menu, Phone, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { mainNavigation } from "@/data/site";
import type { ManagedSiteConfig } from "@/lib/catalog";

const productNavigation = [
  { label: "Cửa cuốn khe thoáng", href: "/san-pham?category=cua-cuon-khe-thoang" },
  { label: "Cửa cuốn tấm liền", href: "/san-pham?category=cua-cuon-tam-lien" },
  { label: "Cửa cuốn trong suốt", href: "/san-pham?category=cua-cuon-trong-suot" },
  { label: "Cửa cuốn công nghiệp", href: "/san-pham?category=cua-cuon-cong-nghiep" },
  { label: "Motor cửa cuốn", href: "/san-pham?category=motor-cua-cuon" },
  { label: "Phụ kiện & linh kiện", href: "/san-pham" },
];

export function SiteHeader({ site }: { site: ManagedSiteConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header-navy">
      <div className="top-strip-navy">
        <div className="container top-strip-navy-inner">
          <div className="top-strip-left">
            <a href={site.mapsHref} target="_blank" rel="noreferrer"><MapPin size={13} /> {site.address}</a>
            <a href={`mailto:${site.email}`}><Mail size={13} /> {site.email}</a>
          </div>
          <div className="top-strip-right">
            <span>{site.hours} · Sửa chữa khẩn cấp 24/7</span>
          </div>
        </div>
      </div>

      <div className="container nav-row-navy">
        <Logo name={site.name} shortName={site.shortName} />

        <nav className="desktop-nav-navy" aria-label="Điều hướng chính">
          <Link href="/" className={isActive("/") ? "active" : ""}>Trang chủ</Link>
          <div className="product-nav-group">
            <Link href="/san-pham" className={isActive("/san-pham") || isActive("/danh-muc") ? "active" : ""}>Sản phẩm <ChevronDown size={14} /></Link>
            <div className="product-nav-dropdown">
              {productNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </div>
          </div>
          <Link href="/ve-chung-toi" className={isActive("/ve-chung-toi") ? "active" : ""}>Giới thiệu</Link>
        </nav>

        <div className="header-contact">
          <a href={site.hotlineHref} className="header-phone-icon" aria-label={`Gọi ${site.hotline}`}><Phone size={18} /></a>
          <a href={site.hotlineHref} className="header-phone-copy"><small>HOTLINE 24/7</small><b>{site.hotline}</b></a>
          <Link href="/san-pham" className="header-zalo" aria-label="Xem sản phẩm"><ShoppingBag size={20} /></Link>
        </div>

        <button
          className="menu-button-navy"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Mở menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-nav-navy" aria-label="Điều hướng di động">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
          <a href={site.hotlineHref} onClick={() => setOpen(false)} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#e69c1a" }}>
            <Phone size={15} /> {site.hotline}
          </a>
        </nav>
      )}
    </header>
  );
}
