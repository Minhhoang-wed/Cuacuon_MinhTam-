"use client";

import { ArrowRight, ChevronDown, Clock3, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PublicLogo } from "@/components/public-logo";
import type { ManagedSiteConfig } from "@/lib/catalog";

const productNavigation = [
  { label: "Cửa cuốn khe thoáng", href: "/san-pham?category=cua-cuon-khe-thoang" },
  { label: "Cửa cuốn tấm liền", href: "/san-pham?category=cua-cuon-tam-lien" },
  { label: "Cửa cuốn trong suốt", href: "/san-pham?category=cua-cuon-trong-suot" },
  { label: "Cửa cuốn công nghiệp", href: "/san-pham?category=cua-cuon-cong-nghiep" },
  { label: "Motor cửa cuốn", href: "/san-pham?category=motor-cua-cuon" },
  { label: "Phụ kiện & linh kiện", href: "/san-pham" },
];

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sửa cửa cuốn", href: "/dich-vu" },
  { label: "Khu vực phục vụ", href: "/khu-vuc-phuc-vu" },
  { label: "Mẹo & kiến thức", href: "/meo-kien-thuc" },
  { label: "Giới thiệu", href: "/ve-chung-toi" },
];

export function SiteHeader({ site }: { site: ManagedSiteConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header-navy">
      <div className="top-strip-navy">
        <div className="container top-strip-navy-inner">
          <div className="top-strip-left">
            <span><Clock3 size={14} /> {site.hours}</span>
            <a href={site.hotlineHref}><Phone size={14} /> {site.hotline}</a>
            <a href={`mailto:${site.email}`}><Mail size={14} /> {site.email}</a>
          </div>
          <div className="top-strip-right">
            <span><MapPin size={14} /> {site.serviceArea}</span>
          </div>
        </div>
      </div>
      <div className="container nav-row-navy">
        <PublicLogo name={site.name} shortName={site.shortName} />

        <nav className="desktop-nav-navy" aria-label="Điều hướng chính">
          {navLinks.slice(0, 2).map((item) => (
            <Link
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <div className="product-nav-group">
            <Link
              href="/san-pham"
              className={isActive("/san-pham") || isActive("/danh-muc") ? "active" : ""}
            >
              Sản phẩm <ChevronDown size={13} />
            </Link>
            <div className="product-nav-dropdown">
              {productNavigation.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {navLinks.slice(2).map((item) => (
            <Link
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-contact">
          <a href={site.hotlineHref} className="header-phone-icon" aria-label={`Gọi ${site.hotline}`}>
            <Phone size={17} />
          </a>
          <a href={site.hotlineHref} className="header-phone-copy">
            <small>Hotline 24/7</small>
            <b>{site.hotline}</b>
          </a>
          <a
            href={site.zaloHref}
            target="_blank"
            rel="noreferrer"
            className="header-zalo-btn"
          >
            <span>Zalo tư vấn</span>
            <ArrowRight size={15} />
          </a>
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
          {[
            ...navLinks.slice(0, 2),
            { label: "Sản phẩm", href: "/san-pham" },
            ...navLinks.slice(2),
            { label: "Liên hệ", href: "/lien-he" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.hotlineHref}
            onClick={() => setOpen(false)}
            style={{
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 700,
              color: "var(--color-terracotta)",
            }}
          >
            <Phone size={16} /> Hotline: {site.hotline}
          </a>
        </nav>
      )}
    </header>
  );
}

