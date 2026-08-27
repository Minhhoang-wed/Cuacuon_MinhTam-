import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getAdminAccessToken } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

interface DailyStat {
  stat_date: string;
  total_views: number;
  unique_visitors: number;
  total_sessions: number;
  avg_duration_ms: number;
  avg_scroll_depth: number;
  bounce_rate: number;
  top_pages: Array<{ path: string; views: number; uniq: number }>;
  top_referrers: Array<{ source: string; cnt: number }>;
  device_breakdown: { desktop: number; mobile: number; tablet: number };
  hourly_views: number[];
  cta_clicks: Record<string, number>;
}

export async function GET(req: NextRequest) {
  // Auth check
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "today";
  const accessToken = await getAdminAccessToken();

  try {
    if (period === "today") {
      return NextResponse.json(await getTodayStats(accessToken));
    }

    const days = period === "30d" ? 30 : 7;
    return NextResponse.json(await getHistoricalStats(days, period, accessToken));
  } catch (err) {
    console.error("[analytics/stats]", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

// ── Vietnam Timezone (UTC+7) Helpers ──
function getVietnamTodayStartISO(): string {
  const now = new Date();
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const vnNow = new Date(now.getTime() + vnOffsetMs);
  const vnYear = vnNow.getUTCFullYear();
  const vnMonth = vnNow.getUTCMonth();
  const vnDate = vnNow.getUTCDate();
  const vnMidnightUTC = new Date(Date.UTC(vnYear, vnMonth, vnDate, 0, 0, 0) - vnOffsetMs);
  return vnMidnightUTC.toISOString();
}

function getVietnamDateStr(date: Date): string {
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const vnDate = new Date(date.getTime() + vnOffsetMs);
  return vnDate.toISOString().split("T")[0];
}

function getVietnamDateRange(days: number): { fromISO: string; dateList: string[] } {
  const now = new Date();
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const vnNow = new Date(now.getTime() + vnOffsetMs);

  const dateList: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(vnNow.getTime() - i * 24 * 60 * 60 * 1000);
    dateList.push(d.toISOString().split("T")[0]);
  }

  const firstDate = dateList[0];
  const [y, m, day] = firstDate.split("-").map(Number);
  const startUTC = new Date(Date.UTC(y, m - 1, day, 0, 0, 0) - vnOffsetMs);

  return { fromISO: startUTC.toISOString(), dateList };
}

async function getHistoricalStats(days: number, period: string, accessToken: string) {
  const { fromISO, dateList } = getVietnamDateRange(days);

  const [pageViews, events] = await Promise.all([
    supabaseFetch<Array<{
      visitor_id: string;
      session_id: string;
      page_path: string;
      device_type: string;
      duration_ms: number;
      scroll_depth: number;
      is_bounce: boolean;
      referrer: string | null;
      created_at: string;
    }>>(
      `/rest/v1/analytics_page_views?created_at=gte.${fromISO}&select=visitor_id,session_id,page_path,device_type,duration_ms,scroll_depth,is_bounce,referrer,created_at&order=created_at.desc&limit=20000`,
      {},
      accessToken
    ),
    supabaseFetch<Array<{
      event_type: string;
      event_target: string | null;
      created_at: string;
    }>>(
      `/rest/v1/analytics_events?created_at=gte.${fromISO}&select=event_type,event_target,created_at&order=created_at.desc&limit=20000`,
      {},
      accessToken
    ),
  ]);

  const pv = pageViews || [];
  const ev = events || [];

  const uniqueVisitors = new Set(pv.map((r) => r.visitor_id)).size;
  const uniqueSessions = new Set(pv.map((r) => r.session_id)).size;
  const bounceSessions = new Set(pv.filter((r) => r.is_bounce).map((r) => r.session_id)).size;

  // Group by VN date
  const dayMap = new Map<string, { views: number; visitors: Set<string>; sessions: Set<string> }>();
  for (const date of dateList) {
    dayMap.set(date, { views: 0, visitors: new Set(), sessions: new Set() });
  }

  for (const r of pv) {
    const dStr = getVietnamDateStr(new Date(r.created_at));
    const bucket = dayMap.get(dStr);
    if (bucket) {
      bucket.views++;
      bucket.visitors.add(r.visitor_id);
      bucket.sessions.add(r.session_id);
    }
  }

  const dailySeries = dateList.map((date) => {
    const bucket = dayMap.get(date);
    return {
      date,
      views: bucket ? bucket.views : 0,
      visitors: bucket ? bucket.visitors.size : 0,
      sessions: bucket ? bucket.sessions.size : 0,
    };
  });

  // Device breakdown
  const devices = { desktop: 0, mobile: 0, tablet: 0 };
  for (const r of pv) {
    if (r.device_type in devices) {
      devices[r.device_type as keyof typeof devices]++;
    }
  }

  // Top pages
  const pageCounts = new Map<string, { views: number; uniq: Set<string> }>();
  for (const r of pv) {
    const entry = pageCounts.get(r.page_path) || { views: 0, uniq: new Set() };
    entry.views++;
    entry.uniq.add(r.visitor_id);
    pageCounts.set(r.page_path, entry);
  }
  const topPages = [...pageCounts.entries()]
    .map(([path, { views, uniq }]) => ({ path, views, uniq: uniq.size }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top referrers
  const refCounts = new Map<string, number>();
  for (const r of pv) {
    const src = r.referrer || "Direct";
    refCounts.set(src, (refCounts.get(src) || 0) + 1);
  }
  const topReferrers = [...refCounts.entries()]
    .map(([source, cnt]) => ({ source, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 10);

  // CTA clicks
  const ctaClicks: Record<string, number> = {};
  for (const e of ev.filter((e) => e.event_type === "cta_click")) {
    const key = e.event_target || "other";
    ctaClicks[key] = (ctaClicks[key] || 0) + 1;
  }

  return {
    period,
    total_views: pv.length,
    unique_visitors: uniqueVisitors,
    total_sessions: uniqueSessions,
    avg_duration_ms: pv.length > 0 ? Math.round(pv.reduce((s, r) => s + r.duration_ms, 0) / pv.length) : 0,
    avg_scroll_depth: pv.length > 0 ? Math.round(pv.reduce((s, r) => s + r.scroll_depth, 0) / pv.length) : 0,
    bounce_rate: uniqueSessions > 0 ? Math.round((bounceSessions / uniqueSessions) * 10000) / 100 : 0,
    device_breakdown: devices,
    cta_clicks: ctaClicks,
    daily_series: dailySeries,
    top_pages: topPages,
    top_referrers: topReferrers,
  };
}

function getVietnamHour(dateStr: string): number {
  const d = new Date(dateStr);
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const vnDate = new Date(d.getTime() + vnOffsetMs);
  return vnDate.getUTCHours();
}

// ── Today's stats: query raw tables directly in Vietnam time ──
async function getTodayStats(accessToken: string) {
  const todayISO = getVietnamTodayStartISO();

  const [pageViews, events] = await Promise.all([
    supabaseFetch<Array<{
      visitor_id: string;
      session_id: string;
      page_path: string;
      device_type: string;
      duration_ms: number;
      scroll_depth: number;
      is_bounce: boolean;
      referrer: string | null;
      created_at: string;
    }>>(
      `/rest/v1/analytics_page_views?created_at=gte.${todayISO}&select=visitor_id,session_id,page_path,device_type,duration_ms,scroll_depth,is_bounce,referrer,created_at&order=created_at.desc`,
      {},
      accessToken
    ),
    supabaseFetch<Array<{
      event_type: string;
      event_target: string | null;
      created_at: string;
    }>>(
      `/rest/v1/analytics_events?created_at=gte.${todayISO}&select=event_type,event_target,created_at&order=created_at.desc`,
      {},
      accessToken
    ),
  ]);

  const pv = pageViews || [];
  const ev = events || [];

  const uniqueVisitors = new Set(pv.map((r) => r.visitor_id)).size;
  const uniqueSessions = new Set(pv.map((r) => r.session_id)).size;
  const bounceSessions = new Set(pv.filter((r) => r.is_bounce).map((r) => r.session_id)).size;

  // Hourly distribution in Vietnam timezone (0h - 23h)
  const hourlyViews = Array(24).fill(0);
  const hourlyVisitorSets = Array.from({ length: 24 }, () => new Set<string>());
  for (const r of pv) {
    const h = getVietnamHour(r.created_at);
    if (h >= 0 && h < 24) {
      hourlyViews[h]++;
      hourlyVisitorSets[h].add(r.visitor_id);
    }
  }
  const hourlyVisitors = hourlyVisitorSets.map((s) => s.size);

  // Device breakdown
  const devices = { desktop: 0, mobile: 0, tablet: 0 };
  for (const r of pv) {
    devices[r.device_type as keyof typeof devices]++;
  }

  // Top pages
  const pageCounts = new Map<string, { views: number; uniq: Set<string> }>();
  for (const r of pv) {
    const entry = pageCounts.get(r.page_path) || { views: 0, uniq: new Set() };
    entry.views++;
    entry.uniq.add(r.visitor_id);
    pageCounts.set(r.page_path, entry);
  }
  const topPages = [...pageCounts.entries()]
    .map(([path, { views, uniq }]) => ({ path, views, uniq: uniq.size }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top referrers
  const refCounts = new Map<string, number>();
  for (const r of pv) {
    const src = r.referrer || "Direct";
    refCounts.set(src, (refCounts.get(src) || 0) + 1);
  }
  const topReferrers = [...refCounts.entries()]
    .map(([source, cnt]) => ({ source, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 10);

  // CTA clicks
  const ctaClicks: Record<string, number> = {};
  for (const e of ev.filter((e) => e.event_type === "cta_click")) {
    const key = e.event_target || "other";
    ctaClicks[key] = (ctaClicks[key] || 0) + 1;
  }

  return {
    period: "today",
    total_views: pv.length,
    unique_visitors: uniqueVisitors,
    total_sessions: uniqueSessions,
    avg_duration_ms: pv.length > 0 ? Math.round(pv.reduce((s, r) => s + r.duration_ms, 0) / pv.length) : 0,
    avg_scroll_depth: pv.length > 0 ? Math.round(pv.reduce((s, r) => s + r.scroll_depth, 0) / pv.length) : 0,
    bounce_rate: uniqueSessions > 0 ? Math.round((bounceSessions / uniqueSessions) * 10000) / 100 : 0,
    device_breakdown: devices,
    cta_clicks: ctaClicks,
    hourly_views: hourlyViews,
    hourly_visitors: hourlyVisitors,
    top_pages: topPages,
    top_referrers: topReferrers,
    recent: pv.slice(0, 15).map((r) => ({
      path: r.page_path,
      device: r.device_type,
      time: r.created_at,
    })),
  };
}
