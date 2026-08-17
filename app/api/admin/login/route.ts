import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/admin-auth";
import { getSupabaseConfig } from "@/lib/supabase-rest";

function options(maxAge: number) { return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge }; }

export async function POST(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.redirect(new URL("/admin/login?error=config", request.url), 303);
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!email || password.length < 8) return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);

  const auth = await fetch(`${config.url}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: config.key, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }), cache: "no-store" });
  if (!auth.ok) return NextResponse.redirect(new URL("/admin/login?error=credentials", request.url), 303);
  const data = await auth.json() as { access_token: string; refresh_token: string; expires_in?: number; user: { id: string } };

  const adminCheck = await fetch(`${config.url}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(data.user.id)}&select=user_id&limit=1`, { headers: { apikey: config.key, Authorization: `Bearer ${data.access_token}` }, cache: "no-store" });
  const admins = adminCheck.ok ? await adminCheck.json() as Array<{ user_id: string }> : [];
  if (!admins[0]) return NextResponse.redirect(new URL("/admin/login?error=permission", request.url), 303);

  const response = NextResponse.redirect(new URL("/admin/dashboard", request.url), 303);
  response.cookies.set(ACCESS_COOKIE, data.access_token, options(data.expires_in || 3600));
  response.cookies.set(REFRESH_COOKIE, data.refresh_token, options(60 * 60 * 24 * 30));
  return response;
}
