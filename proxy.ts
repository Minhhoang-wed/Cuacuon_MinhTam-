import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "antam_admin_access";
const REFRESH_COOKIE = "antam_admin_refresh";

function cookieOptions(maxAge: number) {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge };
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";
  let access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  async function valid(token: string) {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key!, Authorization: `Bearer ${token}` }, cache: "no-store" });
    return response.ok;
  }

  if (access && await valid(access)) {
    if (isLogin) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.next();
  }

  if (refresh) {
    const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: refresh }), cache: "no-store" });
    if (response.ok) {
      const data = await response.json() as { access_token: string; refresh_token: string; expires_in?: number };
      access = data.access_token;
      const next = isLogin ? NextResponse.redirect(new URL("/admin/dashboard", request.url)) : NextResponse.next();
      next.cookies.set(ACCESS_COOKIE, data.access_token, cookieOptions(data.expires_in || 3600));
      next.cookies.set(REFRESH_COOKIE, data.refresh_token, cookieOptions(60 * 60 * 24 * 30));
      return next;
    }
  }

  if (isLogin) return NextResponse.next();
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", path);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
