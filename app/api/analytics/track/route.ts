import { NextRequest, NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase-rest";

// ── Lightweight bot detection ──
const BOT_UA_RE = /bot|crawl|spider|slurp|facebook|twitter|whatsapp|telegram|curl|wget|python|java|php|go-http/i;

// ── Rate limit: simple in-memory (resets on cold start – fine for landing page traffic) ──
const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 120; // per window
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ── Parse user-agent into device / browser / os ──
function parseUA(ua: string) {
  const mobile = /mobile|android|iphone|ipod/i.test(ua);
  const tablet = /tablet|ipad/i.test(ua);
  const device_type = tablet ? "tablet" : mobile ? "mobile" : "desktop";

  let browser = "other";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr|opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";

  let os = "other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device_type, browser, os };
}

// ── Types ──
interface TrackPayload {
  type: "page_view" | "event" | "update";
  visitor_id: string;
  session_id: string;
  page_path: string;
  page_title?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  // For events
  event_type?: string;
  event_target?: string;
  event_data?: Record<string, unknown>;
  // For page_view updates
  duration_ms?: number;
  scroll_depth?: number;
  is_bounce?: boolean;
  // Honeypot
  _hp?: string;
}

export async function POST(req: NextRequest) {
  try {
    // ── IP & rate limit ──
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";
    if (isRateLimited(ip)) {
      return new NextResponse(null, { status: 429 });
    }

    // ── Parse body ──
    const body: TrackPayload = await req.json();

    // ── Honeypot check ──
    if (body._hp) {
      return new NextResponse(null, { status: 204 });
    }

    // ── Bot check ──
    const ua = req.headers.get("user-agent") || "";
    if (BOT_UA_RE.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    // ── Ignore tracking for logged-in Admin ──
    const cookies = req.headers.get("cookie") || "";
    if (cookies.includes("antam_admin_access")) {
      return new NextResponse(null, { status: 204 });
    }

    // ── Validate required fields ──
    if (!body.visitor_id || !body.session_id || !body.page_path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Sanitize ──
    const pagePath = body.page_path.slice(0, 500);
    const pageTitle = body.page_title?.slice(0, 300) || null;
    const referrer = body.referrer?.slice(0, 500) || null;

    const { device_type, browser, os } = parseUA(ua);

    if (body.type === "page_view") {
      // Insert page view
      await supabaseFetch("/rest/v1/analytics_page_views", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          visitor_id: body.visitor_id,
          session_id: body.session_id,
          page_path: pagePath,
          page_title: pageTitle,
          referrer,
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          device_type,
          browser,
          os,
          country: "VN",
          duration_ms: 0,
          scroll_depth: 0,
          is_bounce: true,
        }),
      });
    } else if (body.type === "event") {
      // Insert event
      if (!body.event_type) {
        return NextResponse.json({ error: "Missing event_type" }, { status: 400 });
      }
      await supabaseFetch("/rest/v1/analytics_events", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          visitor_id: body.visitor_id,
          session_id: body.session_id,
          event_type: body.event_type.slice(0, 100),
          event_target: body.event_target?.slice(0, 300) || null,
          event_data: body.event_data || {},
          page_path: pagePath,
        }),
      });
    } else if (body.type === "update") {
      // Update existing page view with duration & scroll depth
      // Use PATCH with filters to update the latest page view for this session+path
      const filters = [
        `session_id=eq.${encodeURIComponent(body.session_id)}`,
        `page_path=eq.${encodeURIComponent(pagePath)}`,
        `order=created_at.desc`,
        `limit=1`,
      ].join("&");

      const updatePayload: Record<string, unknown> = {};
      if (typeof body.duration_ms === "number") updatePayload.duration_ms = Math.min(body.duration_ms, 3600000); // max 1h
      if (typeof body.scroll_depth === "number") updatePayload.scroll_depth = Math.min(Math.max(body.scroll_depth, 0), 100);
      if (typeof body.is_bounce === "boolean") updatePayload.is_bounce = body.is_bounce;

      if (Object.keys(updatePayload).length > 0) {
        await supabaseFetch(`/rest/v1/analytics_page_views?${filters}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(updatePayload),
        });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    // Silently fail — analytics should never break the site
    console.error("[analytics/track]", err);
    return new NextResponse(null, { status: 204 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ ok: true });
}
