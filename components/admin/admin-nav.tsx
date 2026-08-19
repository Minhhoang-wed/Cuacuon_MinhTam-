"use client";

import { Boxes, Building2, ExternalLink, FolderTree, Home, ImageIcon, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogo } from "@/components/admin/admin-logo";

const links = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Boxes },
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/projects", label: "Dự án đã làm", icon: Building2 },
  { href: "/admin/media", label: "Thư viện ảnh", icon: ImageIcon },
  { href: "/admin/homepage", label: "Trang chủ", icon: Home },
  { href: "/admin/settings", label: "Cấu hình website", icon: Settings },
];


export function AdminNav({ email }: { email: string; demo?: boolean }) {
  const pathname = usePathname();
  const initial = (email || "A").charAt(0).toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-info">
          <AdminLogo />
        </div>
        <span className="admin-brand-badge">CMS</span>
      </div>

      <nav>
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? "active" : ""}
            >
              <Icon strokeWidth={1.9} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-account">
        <div className="admin-account-user">
          <div className="admin-account-avatar">
            {initial}
          </div>
          <div className="admin-account-meta">
            <span>Quản trị viên</span>
            <b title={email}>{email}</b>
          </div>
        </div>

        <div className="admin-account-actions">
          <Link href="/" target="_blank" title="Mở trang chủ website ngoài tab mới">
            <ExternalLink size={15} />
            <span>Xem website</span>
          </Link>
          <form action="/api/admin/logout" method="post" style={{ margin: 0 }}>
            <button type="submit" title="Đăng xuất khỏi hệ thống">
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}


