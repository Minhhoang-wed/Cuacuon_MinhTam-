import type { Metadata } from "next";
import { ArrowRight, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };
const messages: Record<string,string> = { config: "Supabase chưa được cấu hình.", invalid: "Vui lòng nhập email và mật khẩu hợp lệ.", credentials: "Email hoặc mật khẩu không đúng.", permission: "Tài khoản này chưa được cấp quyền ADMIN." };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams; const configured = isSupabaseConfigured();
  return <main className="admin-login-page"><div className="admin-login-brand"><span className="admin-login-mark"><ShieldCheck /></span><span><b>AN TÂM 24H</b><small>CONTENT MANAGEMENT SYSTEM</small></span></div><div className="admin-login-grid"><section><span className="kicker">Admin CMS</span><h1>Nội dung website,<br />chủ động trong tay bạn.</h1><p>Quản lý sản phẩm, danh mục, hình ảnh và thông tin doanh nghiệp trong một khu vực riêng được bảo vệ.</p><ul><li><LockKeyhole /> Chỉ tài khoản được cấp quyền</li><li><ShieldCheck /> Dữ liệu bảo vệ bằng Row Level Security</li></ul></section><section className="admin-login-card"><KeyRound /><h2>Đăng nhập quản trị</h2><p>Sử dụng tài khoản đã được tạo trong Supabase Authentication.</p>{error && <div className="admin-error">{messages[error] || "Không thể đăng nhập."}</div>}{configured ? <form action="/api/admin/login" method="post"><label><span>Email</span><input type="email" name="email" required autoComplete="email" /></label><label><span>Mật khẩu</span><input type="password" name="password" required minLength={8} autoComplete="current-password" /></label><button className="button button-primary">Đăng nhập <ArrowRight /></button></form> : <div className="admin-config-note"><b>Chế độ xem trước</b><p>Chưa có thông tin Supabase. Bạn vẫn có thể xem giao diện CMS bằng dữ liệu demo; chức năng lưu sẽ bị khóa.</p><Link href="/admin/dashboard" className="button button-dark">Xem Admin demo <ArrowRight /></Link></div>}<Link className="back-site" href="/">← Quay lại website</Link></section></div></main>;
}
