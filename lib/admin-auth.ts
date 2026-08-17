import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";

export const ACCESS_COOKIE = "antam_admin_access";
export const REFRESH_COOKIE = "antam_admin_refresh";

export type AdminSession = { id: string; email: string };

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!getSupabaseConfig()) return null;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    const user = await supabaseFetch<{ id: string; email?: string }>("/auth/v1/user", { cache: "no-store" }, token);
    const rows = await supabaseFetch<Array<{ user_id: string; email: string | null }>>(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id,email&limit=1`, { cache: "no-store" }, token);
    if (!rows[0]) return null;
    return { id: user.id, email: rows[0].email || user.email || "admin" };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function getAdminAccessToken() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  return token;
}
