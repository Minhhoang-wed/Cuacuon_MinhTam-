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

    // For historical periods, query analytics_daily_stats
    const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "yesterday" ? 1 : 7;
    const fromDate = new Date();
    if (period === "yesterday") {
      fromDate.setDate(fromDate.getDate() - 1);
    } else {
      fromDate.setDate(fromDate.getDate() - days);
    }
    const fromStr = fromDate.toISOString().split("T")[0];

    let dateFilter = `stat_date=gte.${fromStr}`;
    if (period === "yesterday") {
      dateFilter = `stat_date=eq.${fromStr}`;
    }

    const dailyStats = await supabaseFetch<DailyStat[]>(
      `/rest/v1/analytics_daily_stats?${dateFilter}&order=stat_date.asc`,
      { next: { revalidate: 60 } },
      accessToken
    );

    // Aggregate across days
    const totals = (dailyStats || []).reduce(
      (acc, d) => {
        acc.total_views += d.total_views;
        acc.total_sessions += d.total_sessions;
        acc.avg_duration_ms += d.avg_duration_ms * d.total_views;
        acc.avg_scroll_depth += d.avg_scroll_depth * d.total_views;
        acc.bounce_sessions += Math.round((d.bounce_rate / 100) * d.total_sessions);
        acc.device_desktop += d.device_breakdown?.desktop || 0;
        acc.device_mobile += d.device_breakdown?.mobile || 0;
        acc.device_tablet += d.device_breakdown?.tablet || 0;
        // Merge CTA clicks
        for (const [k, v] of Object.entries(d.cta_clicks || {})) {
          acc.cta_clicks[k] = (acc.cta_clicks[k] || 0) + (v as number);
        }
        return acc;
      },
      {
        total_views: 0,
        total_sessions: 0,
        avg_duration_ms: 0,
        avg_scroll_depth: 0,
        bounce_sessions: 0,
        device_desktop: 0,
        device_mobile: 0,
        device_tablet: 0,
        cta_clicks: {} as Record<string, number>,
      }
    );

    // Unique visitors across multiple days requires summing daily uniques (approximate)
    // A more accurate approach would query raw data, but this is good enough for a landing page
    const uniqueVisitorDays = (dailyStats || []).reduce((s, d) => s + d.unique_visitors, 0);

    const result = {
      period,
      total_views: totals.total_views,
      unique_visitors: uniqueVisitorDays,
      total_sessions: totals.total_sessions,
      avg_duration_ms: totals.total_views > 0 ? Math.round(totals.avg_duration_ms / totals.total_views) : 0,
      avg_scroll_depth: totals.total_views > 0 ? Math.round(totals.avg_scroll_depth / totals.total_views) : 0,
      bounce_rate: totals.total_sessions > 0 ? Math.round((totals.bounce_sessions / totals.total_sessions) * 10000) / 100 : 0,
      device_breakdown: {
        desktop: totals.device_desktop,
        mobile: totals.device_mobile,
        tablet: totals.device_tablet,
      },
      cta_clicks: totals.cta_clicks,
      // Chart data: daily series
      daily_series: (dailyStats || []).map((d) => ({
        date: d.stat_date,
        views: d.total_views,
        visitors: d.unique_visitors,
        sessions: d.total_sessions,
      })),
      // Last day's top pages and referrers
      top_pages: (dailyStats || []).at(-1)?.top_pages || [],
      top_referrers: (dailyStats || []).at(-1)?.top_referrers || [],
    };

    return NextResponse.json(result);
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
