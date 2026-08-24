import type { Metadata } from "next";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Building2,
  MapPin,
  Settings,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị CMS — Minh Tâm",
  robots: { index: false, follow: false },
};

const messages: Record<string, string> = {
  config: "Hệ thống chưa kết nối cơ sở dữ liệu.",
  invalid: "Vui lòng nhập đầy đủ email và mật khẩu hợp lệ.",
  credentials: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  permission: "Tài khoản này chưa được cấp quyền Quản trị viên.",
};

const features = [
  { icon: Wrench, label: "Quản lý dịch vụ sửa chữa & bảng giá chi tiết" },
  { icon: Boxes, label: "Catalog sản phẩm cửa cuốn & danh mục" },
  { icon: Building2, label: "Dự án thi công & hình ảnh công trình thực tế" },
  { icon: MapPin, label: "Khu vực phục vụ & mạng lưới cửa hàng" },
  { icon: Settings, label: "Cấu hình website, hotline & thông tin liên hệ" },
];

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="admin-login-page">
      {/* ── LEFT PANEL: Brand & Hero ── */}
      <div className="admin-login-left">
        {/* Logo */}
        <div className="admin-login-brand">
          <Link href="/" className="admin-login-logo" aria-label="Cua Cuon Minh Tam - Trang chu">
            <img src="/logo/logo.png" alt="Cua Cuon Minh Tam" />
          </Link>
        </div>

        {/* Hero headline */}
        <div className="admin-login-headline">
          <h1>
            Quản trị nội dung<br />
            Cửa Cuốn <em>Minh Tâm.</em>
          </h1>

          <p>
            Khu vực dành riêng cho ban quản trị cập nhật sản phẩm,
            bảng giá, hình ảnh công trình và toàn bộ nội dung website.
          </p>

          {/* Feature list */}
          <ul className="admin-login-features">
            {features.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span className="admin-login-feature-icon">
                  <Icon />
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer strip */}
        <div className="admin-login-footer">
          <span>© 2025 Cửa Cuốn Minh Tâm · Sửa chữa 24/7</span>
          <span>TP. Hồ Chí Minh</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
      <div className="admin-login-right">
        <div className="admin-login-card">
          <h2>Đăng nhập quản trị</h2>
          <p>Sử dụng tài khoản đã được cấp quyền quản trị viên trên hệ thống.</p>

          {error && (
            <div className="admin-error" style={{ marginBottom: 20 }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{messages[error] || "Không thể đăng nhập vào hệ thống."}</span>
            </div>
          )}

          <form action="/api/admin/login" method="post">
            <label>
              <span>Địa chỉ Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@mitadoor.vn"
              />
            </label>

            <label>
              <span>Mật khẩu</span>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="button button-primary">
              <span>Đăng nhập hệ thống</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <Link className="back-site" href="/">
            <ArrowLeft size={16} />
            <span>Quay lại trang chủ website</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
