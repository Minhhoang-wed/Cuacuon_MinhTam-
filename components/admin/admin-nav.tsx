"use client";

import {
  Boxes,
  Building2,
  ExternalLink,
  FolderTree,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLogo } from "@/components/admin/admin-logo";

type NavGroup = {
  title: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    badge?: string;
  }>;
};

const navGroups: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { href: "/admin/dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    ],
  },
  {
    title: "Dịch vụ & Khu vực",
    items: [
      { href: "/admin/services", label: "Dịch vụ & Báo giá", icon: Wrench },
      { href: "/admin/service-areas", label: "Khu vực phục vụ", icon: MapPin },
    ],
  },
  {
    title: "Sản phẩm & Nội dung",
    items: [
      { href: "/admin/products", label: "Sản phẩm cửa cuốn", icon: Boxes },
      { href: "/admin/categories", label: "Danh mục sản phẩm", icon: FolderTree },
      { href: "/admin/articles", label: "Mẹo & Cẩm nang", icon: Newspaper },
      { href: "/admin/projects", label: "Dự án thi công", icon: Building2 },
    ],
  },
  {
    title: "Hệ thống & Cấu hình",
    items: [
      { href: "/admin/homepage", label: "Nội dung Trang chủ", icon: Home },
      { href: "/admin/media", label: "Thư viện hình ảnh", icon: ImageIcon },
      { href: "/admin/settings", label: "Cấu hình website", icon: Settings },
    ],
  },
  {
    title: "SEO & Hiệu suất",
    items: [
      { href: "/admin/seo", label: "Quản trị SEO", icon: Search, badge: "NEW" },
    ],
  },
];

export function AdminNav({ email }: { email: string; demo?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initial = (email || "A").charAt(0).toUpperCase();

  // Automatically close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Mobile Topbar ── */}
      <header className="admin-mobile-topbar">
        <button
          type="button"
          className="admin-mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Mở menu quản trị"
        >
          <Menu size={22} />
        </button>
        <div className="admin-mobile-logo">
          <AdminLogo />
        </div>
        <Link href="/" target="_blank" className="admin-mobile-view-site" title="Xem website">
          <ExternalLink size={16} />
        </Link>
      </header>

      {/* ── Backdrop Overlay ── */}
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand & Close button */}
        <div className="admin-brand">
          <div className="admin-brand-info">
            <AdminLogo />
          </div>
          <button
            type="button"
            className="admin-mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu quản trị"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav>
          {navGroups.map((group) => (
            <div className="admin-nav-group" key={group.title}>
              <span className="admin-nav-group-title">
                <span className="admin-nav-group-dot" />
                {group.title}
              </span>
              {group.items.map(({ href, label, icon: Icon, badge }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/admin/dashboard" && pathname.startsWith(href));

                return (
                  <Link
                    key={href}
                    href={href}
                    className={isActive ? "active" : ""}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon strokeWidth={isActive ? 2.2 : 2.0} size={20} />
                    <span>{label}</span>
                    {badge && <span className="admin-nav-pill-badge">{badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User info & quick actions */}
        <div className="admin-account">
          <div className="admin-account-user">
            <div className="admin-account-avatar">{initial}</div>
            <div className="admin-account-meta">
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={11} color="#60a5fa" /> Quản trị viên
              </span>
              <b title={email}>{email}</b>
            </div>
          </div>

          <div className="admin-account-actions">
            <Link href="/" target="_blank" title="Mở website trong tab mới">
              <ExternalLink size={14} />
              <span>Xem website</span>
            </Link>
            <form action="/api/admin/logout" method="post" style={{ margin: 0 }}>
              <button type="submit" title="Đăng xuất khỏi hệ thống">
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
