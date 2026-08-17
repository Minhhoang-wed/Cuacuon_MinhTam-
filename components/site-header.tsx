"use client";

import { Clock3, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { mainNavigation } from "@/data/site";
import type { ManagedSiteConfig } from "@/lib/catalog";

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
            <span><Clock3 size={13} /> {site.hours} · Sửa chữa khẩn cấp 24/7</span>
          </div>
        </div>
      </div>

      <div className="container nav-row-navy">
        <Logo name={site.name} shortName={site.shortName} />

        <nav className="desktop-nav-navy" aria-label="Điều hướng chính">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-contact">
          <a href={site.hotlineHref} className="header-phone-icon" aria-label={`Gọi ${site.hotline}`}><Phone size={18} /></a>
          <a href={site.hotlineHref} className="header-phone-copy"><small>HOTLINE 24/7</small><b>{site.hotline}</b></a>
          <a href={site.zaloHref} target="_blank" rel="noreferrer" className="header-zalo" aria-label="Chat Zalo"><MessageCircle size={19} /></a>
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
