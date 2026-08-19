import type { Metadata } from "next";
import { AlertCircle, ArrowLeft, ArrowRight, Boxes, Building2, KeyRound, Settings } from "lucide-react";
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

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="admin-login-page">
      <div className="admin-login-brand">
        <Link href="/" className="admin-login-logo" aria-label="Cua Cuon Minh Tam - Trang chu">
          <img src="/logo/logo.png" alt="Cua Cuon Minh Tam" />
        </Link>
        <span className="admin-login-badge">CMS</span>
      </div>

      <div className="admin-login-grid">
        <section>
          <span className="kicker">Hệ thống Quản trị</span>
          <h1>
            Quản trị nội dung<br />
            Cửa Cuốn Minh Tâm.
          </h1>
          <p>
            Khu vực dành riêng cho ban quản trị cập nhật sản phẩm, hình ảnh công trình và thông tin hiển thị website.
          </p>

          <ul>
            <li>
              <Boxes size={18} />
              <span>Quản lý danh mục & bảng giá sản phẩm cửa cuốn</span>
            </li>
            <li>
              <Building2 size={18} />
              <span>Cập nhật dự án & hình ảnh công trình thực tế</span>
            </li>
            <li>
              <Settings size={18} />
              <span>Tùy chỉnh thông tin liên hệ, hotline & cấu hình trang chủ</span>
            </li>
          </ul>
        </section>

        <section className="admin-login-card">
          <KeyRound size={32} />
          <h2>Đăng nhập quản trị</h2>
          <p>Sử dụng tài khoản quản trị đã được cấp quyền trên hệ thống.</p>

          {error && (
            <div className="admin-error">
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

            <button className="button button-primary">
              <span>Đăng nhập hệ thống</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <Link className="back-site" href="/">
            <ArrowLeft size={16} />
            <span>Quay lại trang chủ website</span>
          </Link>
        </section>
      </div>
    </main>
  );
}


