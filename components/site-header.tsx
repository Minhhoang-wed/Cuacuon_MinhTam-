"use client";

import { Clock3, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { mainNavigation } from "@/data/site";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function SiteHeader({ site }: { site: ManagedSiteConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header-navy">
      {/* Top Strip */}
      <div className="top-strip-navy">
        <div className="container top-strip-navy-inner">
          <div className="top-strip-left">
            <a href={site.hotlineHref}>
              <Phone size={13} />
              Hotline 24/7: <b>{site.hotline}</b>
            </a>
            <span><Clock3 size={13} /> Hỗ trợ nhanh - Có mặt sau 15 phút</span>
          </div>
          <div className="top-strip-right">
            <Link href="/ve-chung-toi">Giới thiệu</Link>
            <span className="separator">|</span>
            <Link href="/tin-tuc">Tin tức</Link>
            <span className="separator">|</span>
            <Link href="/lien-he">Liên hệ</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container nav-row-navy">
        <Logo name={site.name} shortName={site.shortName} />

        <nav className="desktop-nav-navy" aria-label="Điều hướng chính">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={site.hotlineHref} className="btn-hotline-outline desktop-cta-navy">
          <Phone size={15} /> {site.hotline}
        </a>

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

      {/* Mobile Nav */}
      {open && (
        <nav id="mobile-menu" className="mobile-nav-navy" aria-label="Điều hướng di động">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={pathname === item.href ? "active" : ""}
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
