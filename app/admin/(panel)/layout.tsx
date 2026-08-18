import type { Metadata } from "next";
import { AlertCircle, DatabaseZap } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminSession } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase-rest";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CMS — Cửa Cuốn An Tâm",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const session = configured ? await getAdminSession() : null;

  if (configured && !session) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-app">
      <AdminNav email={session?.email || "admin@mitadoor.vn"} />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}


