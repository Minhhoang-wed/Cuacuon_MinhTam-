import type { Metadata } from "next";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Database, KeyRound, Lock, Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị CMS — Cửa Cuốn An Tâm",
  robots: { index: false, follow: false },
};

const messages: Record<string, string> = {
  config: "Supabase chưa được cấu hình biến môi trường.",
  invalid: "Vui lòng nhập đầy đủ email và mật khẩu hợp lệ.",
  credentials: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  permission: "Tài khoản này chưa được phân quyền Quản trị viên (ADMIN_USERS).",
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
        <span className="admin-login-mark">
          <ShieldCheck size={26} />
        </span>
        <span>
          <b>CỬA CUỐN AN TÂM</b>
          <small>CONTENT MANAGEMENT SYSTEM</small>
        </span>
      </div>

      <div className="admin-login-grid">
        <section>
          <span className="kicker">Hệ thống Quản trị</span>
          <h1>
            Nội dung website,<br />
            chủ động trong tay bạn.
          </h1>
          <p>
            Quản lý toàn bộ danh mục cửa cuốn, hình ảnh thực tế, bảng giá niêm yết và thông tin doanh nghiệp trong khu vực bảo mật độc lập.
          </p>

          <ul>
            <li>
              <Lock size={18} />
              <span>Phân quyền xác thực bảo mật đa tầng qua Supabase Auth</span>
            </li>
            <li>
              <Shield size={18} />
              <span>Dữ liệu được bảo vệ an toàn bằng Row Level Security (RLS)</span>
            </li>
            <li>
              <Database size={18} />
              <span>Lưu trữ hình ảnh chuẩn CDN đám mây với hiệu năng cao</span>
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


