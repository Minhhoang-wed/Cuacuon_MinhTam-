"use client";

import { Boxes, FolderTree, Gauge, Home, ImageIcon, LogOut, Settings, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/admin/products", label: "Sản phẩm", icon: Boxes },
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/media", label: "Thư viện ảnh", icon: ImageIcon },
  { href: "/admin/homepage", label: "Trang chủ", icon: Home },
  { href: "/admin/settings", label: "Thông tin website", icon: Settings },
];

export function AdminNav({ email, demo }: { email: string; demo: boolean }) {
  const pathname = usePathname();
  return <aside className="admin-sidebar"><div className="admin-brand"><Logo /><span>ADMIN CMS</span></div><nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname.startsWith(href) ? "active" : ""}><Icon /> {label}</Link>)}</nav><div className="admin-account"><div><span>{demo ? "Chế độ xem trước" : "Đã đăng nhập"}</span><b>{email}</b></div><Link href="/" target="_blank"><Store /> Xem website</Link>{!demo && <form action="/api/admin/logout" method="post"><button><LogOut /> Đăng xuất</button></form>}</div></aside>;
}
