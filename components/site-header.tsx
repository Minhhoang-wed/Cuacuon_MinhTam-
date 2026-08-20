"use client";

import { ArrowRight, ChevronDown, Clock3, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Lock body scroll and toggle menu class when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [open]);

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
          <a href={site.hotlineHref} className="header-phone-icon" aria-label={`Gọi ngay ${site.hotline}`}>
            <Phone size={17} />
          </a>
          <div className="header-phone-copy">
            <small>HOTLINE 24/7</small>
            <b>{site.hotline}</b>
          </div>
          <a
            href={site.zaloHref}
            target="_blank"
            rel="noreferrer"
            className="header-zalo-btn"
          >
            <span>ZALO TƯ VẤN</span>
            <ArrowRight size={15} />
          </a>
        </div>

        <button
          type="button"
          className="menu-button-navy"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Mở menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          {/* Sticky Drawer Topbar with Close Button */}
          <div className="mobile-drawer-topbar">
            <PublicLogo name={site.name} shortName={site.shortName} />
            <button
              type="button"
              className="mobile-drawer-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Đóng menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Scrollable Drawer Body */}
          <div className="mobile-drawer-body">
            <div className="mobile-nav-links">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={isActive("/") ? "active" : ""}
              >
                Trang chủ
              </Link>
              <Link
                href="/dich-vu"
                onClick={() => setOpen(false)}
                className={isActive("/dich-vu") ? "active" : ""}
              >
                Sửa cửa cuốn 24/7
              </Link>

              <div className="mobile-nav-subgroup">
                <Link
                  href="/san-pham"
                  onClick={() => setOpen(false)}
                  className={`mobile-nav-parent ${isActive("/san-pham") ? "active" : ""}`}
                >
                  Sản phẩm cửa cuốn
                </Link>
                <div className="mobile-sub-items">
                  {productNavigation.map((prod) => (
                    <Link
                      key={prod.href}
                      href={prod.href}
                      onClick={() => setOpen(false)}
                    >
                      • {prod.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/khu-vuc-phuc-vu"
                onClick={() => setOpen(false)}
                className={isActive("/khu-vuc-phuc-vu") ? "active" : ""}
              >
                Khu vực phục vụ
              </Link>
              <Link
                href="/meo-kien-thuc"
                onClick={() => setOpen(false)}
                className={isActive("/meo-kien-thuc") ? "active" : ""}
              >
                Mẹo & kiến thức
              </Link>
              <Link
                href="/ve-chung-toi"
                onClick={() => setOpen(false)}
                className={isActive("/ve-chung-toi") ? "active" : ""}
              >
                Giới thiệu
              </Link>
              <Link
                href="/lien-he"
                onClick={() => setOpen(false)}
                className={isActive("/lien-he") ? "active" : ""}
              >
                Liên hệ
              </Link>
            </div>

            <div className="mobile-nav-actions">
              <a
                href={site.hotlineHref}
                className="mobile-nav-call-btn"
                onClick={() => setOpen(false)}
              >
                <Phone size={18} /> Gọi cứu hộ: {site.hotline}
              </a>
              <a
                href={site.zaloHref}
                target="_blank"
                rel="noreferrer"
                className="mobile-nav-zalo-btn"
                onClick={() => setOpen(false)}
              >
                <MessageCircle size={18} /> Zalo tư vấn miễn phí
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

