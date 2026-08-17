import type { Metadata } from "next";
import { DatabaseZap } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminSession } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase-rest";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured(); const session = configured ? await getAdminSession() : null;
  if (configured && !session) redirect("/admin/login");
  return <div className="admin-app"><AdminNav email={session?.email || "demo@antam.local"} demo={!configured} /><main className="admin-main">{!configured && <div className="admin-demo-banner"><DatabaseZap /><span><b>Đang xem dữ liệu demo.</b> Kết nối Supabase để đăng nhập, lưu nội dung và upload ảnh.</span><a href="#setup">Hướng dẫn cấu hình</a></div>}{children}</main></div>;
}
