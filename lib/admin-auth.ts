import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";

export const ACCESS_COOKIE = "antam_admin_access";
export const REFRESH_COOKIE = "antam_admin_refresh";

export type AdminSession = { id: string; email: string };

const sessionCache = new Map<string, { session: AdminSession; expiresAt: number }>();

function parseJwt(token: string): { sub?: string; email?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

export const getAdminSession = cache(async function getAdminSession(): Promise<AdminSession | null> {
  if (!getSupabaseConfig()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const now = Date.now();
  const cached = sessionCache.get(token);
  if (cached && cached.expiresAt > now) {
    return cached.session;
  }

  const jwt = parseJwt(token);
  if (!jwt || (jwt.exp && jwt.exp * 1000 < now)) {
    sessionCache.delete(token);
    return null;
  }

  try {
    const user = await supabaseFetch<{ id: string; email?: string }>("/auth/v1/user", { cache: "no-store" }, token);
    const rows = await supabaseFetch<Array<{ user_id: string; email: string | null }>>(
      `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id,email&limit=1`,
      { cache: "no-store" },
      token
    );
    if (!rows[0]) return null;

    const session: AdminSession = { id: user.id, email: rows[0].email || user.email || jwt.email || "admin" };
    // Cache kết quả xác thực 2 phút để không phải gọi Supabase liên tục mỗi lần bấm menu
    sessionCache.set(token, {
      session,
      expiresAt: Math.min(now + 120000, (jwt.exp ? jwt.exp * 1000 : now + 120000)),
    });
    return session;
  } catch {
    return null;
  }
});

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function getAdminAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  return token;
}

