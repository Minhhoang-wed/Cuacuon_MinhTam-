import { supabaseFetch } from "@/lib/supabase-rest";
import { getAdminSession, getAdminAccessToken } from "@/lib/admin-auth";

// ── Types ──
export interface AnalyticsSummary {
  period: string;
  total_views: number;
  unique_visitors: number;
  total_sessions: number;
  avg_duration_ms: number;
  avg_scroll_depth: number;
  bounce_rate: number;
  device_breakdown: { desktop: number; mobile: number; tablet: number };
  cta_clicks: Record<string, number>;
  hourly_views?: number[];
  top_pages: Array<{ path: string; views: number; uniq: number }>;
  top_referrers: Array<{ source: string; cnt: number }>;
  daily_series?: Array<{ date: string; views: number; visitors: number; sessions: number }>;
  recent?: Array<{ path: string; device: string; time: string }>;
}

export interface ContentStat {
  content_type: string;
  content_id: string;
  content_title: string | null;
  stat_date: string;
  views: number;
  unique_views: number;
  clicks: number;
  avg_duration: number;
  avg_scroll: number;
}

export interface RealtimeData {
  active_visitors: number;
  feed: Array<{ path: string; device: string; time: string }>;
}

// ── Server-side data fetching functions ──

/**
 * Get analytics summary for a period.
 * Calls the /api/analytics/stats endpoint internally via supabase REST.
 */
export async function getAnalyticsSummary(period: string = "today"): Promise<AnalyticsSummary> {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authenticated");
  const accessToken = await getAdminAccessToken();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  if (period === "today") {
    // Query raw page views for today
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
        `/rest/v1/analytics_page_views?created_at=gte.${todayISO}&select=visitor_id,session_id,page_path,device_type,duration_ms,scroll_depth,is_bounce,referrer,created_at&order=created_at.desc&limit=5000`,
        {},
        accessToken
      ),
      supabaseFetch<Array<{
        event_type: string;
        event_target: string | null;
        created_at: string;
      }>>(
        `/rest/v1/analytics_events?created_at=gte.${todayISO}&select=event_type,event_target,created_at&order=created_at.desc&limit=5000`,
        {},
        accessToken
      ),
    ]);

    const pv = pageViews || [];
    const ev = events || [];

    const uniqueVisitors = new Set(pv.map((r) => r.visitor_id)).size;
    const uniqueSessions = new Set(pv.map((r) => r.session_id)).size;
    const bounceSessions = new Set(pv.filter((r) => r.is_bounce).map((r) => r.session_id)).size;

    const hourly = Array(24).fill(0);
    for (const r of pv) {
      const h = new Date(r.created_at).getHours();
      hourly[h]++;
    }

    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    for (const r of pv) {
      devices[r.device_type as keyof typeof devices]++;
    }

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

    const refCounts = new Map<string, number>();
    for (const r of pv) {
      const src = r.referrer || "Direct";
      refCounts.set(src, (refCounts.get(src) || 0) + 1);
    }
    const topReferrers = [...refCounts.entries()]
      .map(([source, cnt]) => ({ source, cnt }))
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, 10);

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
      hourly_views: hourly,
      top_pages: topPages,
      top_referrers: topReferrers,
      recent: pv.slice(0, 15).map((r) => ({
        path: r.page_path,
        device: r.device_type,
        time: r.created_at,
      })),
    };
  }

  // For historical periods, query aggregated stats
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 7;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const fromStr = fromDate.toISOString().split("T")[0];

  const dailyStats = await supabaseFetch<Array<{
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
  }>>(
    `/rest/v1/analytics_daily_stats?stat_date=gte.${fromStr}&order=stat_date.asc`,
    {},
    accessToken
  );

  const stats = dailyStats || [];

  const totals = stats.reduce(
    (acc, d) => {
      acc.total_views += d.total_views;
      acc.total_sessions += d.total_sessions;
      acc.duration_sum += d.avg_duration_ms * d.total_views;
      acc.scroll_sum += d.avg_scroll_depth * d.total_views;
      acc.bounce_sessions += Math.round((d.bounce_rate / 100) * d.total_sessions);
      acc.desktop += d.device_breakdown?.desktop || 0;
      acc.mobile += d.device_breakdown?.mobile || 0;
      acc.tablet += d.device_breakdown?.tablet || 0;
      for (const [k, v] of Object.entries(d.cta_clicks || {})) {
        acc.cta[k] = (acc.cta[k] || 0) + (v as number);
      }
      return acc;
    },
    { total_views: 0, total_sessions: 0, duration_sum: 0, scroll_sum: 0, bounce_sessions: 0, desktop: 0, mobile: 0, tablet: 0, cta: {} as Record<string, number> }
  );

  return {
    period,
    total_views: totals.total_views,
    unique_visitors: stats.reduce((s, d) => s + d.unique_visitors, 0),
    total_sessions: totals.total_sessions,
    avg_duration_ms: totals.total_views > 0 ? Math.round(totals.duration_sum / totals.total_views) : 0,
    avg_scroll_depth: totals.total_views > 0 ? Math.round(totals.scroll_sum / totals.total_views) : 0,
    bounce_rate: totals.total_sessions > 0 ? Math.round((totals.bounce_sessions / totals.total_sessions) * 10000) / 100 : 0,
    device_breakdown: { desktop: totals.desktop, mobile: totals.mobile, tablet: totals.tablet },
    cta_clicks: totals.cta,
    top_pages: stats.at(-1)?.top_pages || [],
    top_referrers: stats.at(-1)?.top_referrers || [],
    daily_series: stats.map((d) => ({
      date: d.stat_date,
      views: d.total_views,
      visitors: d.unique_visitors,
      sessions: d.total_sessions,
    })),
  };
}

/**
 * Get content-level analytics stats (products, articles, services).
 */
export async function getContentStats(
  contentType?: string,
  period: string = "7d"
): Promise<ContentStat[]> {
  const session = await getAdminSession();
  if (!session) return [];
  const accessToken = await getAdminAccessToken();

  const days = period === "30d" ? 30 : 7;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const fromStr = fromDate.toISOString().split("T")[0];

  let filter = `stat_date=gte.${fromStr}`;
  if (contentType) filter += `&content_type=eq.${contentType}`;

  const rows = await supabaseFetch<ContentStat[]>(
    `/rest/v1/analytics_content_stats?${filter}&order=views.desc&limit=50`,
    {},
    accessToken
  );

  return rows || [];
}

/**
 * Get realtime data (active visitors + recent feed).
 */
export async function getRealtimeData(): Promise<RealtimeData> {
  const session = await getAdminSession();
  if (!session) return { active_visitors: 0, feed: [] };
  const accessToken = await getAdminAccessToken();

  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const recent = await supabaseFetch<Array<{
    visitor_id: string;
    page_path: string;
    device_type: string;
    created_at: string;
  }>>(
    `/rest/v1/analytics_page_views?created_at=gte.${fiveMinAgo}&select=visitor_id,page_path,device_type,created_at&order=created_at.desc&limit=100`,
    {},
    accessToken
  );

  const rows = recent || [];
  const activeVisitors = new Set(rows.map((r) => r.visitor_id)).size;

  const seen = new Set<string>();
  const feed: Array<{ path: string; device: string; time: string }> = [];
  for (const r of rows) {
    const key = `${r.visitor_id}:${r.page_path}`;
    if (!seen.has(key) && feed.length < 10) {
      seen.add(key);
      feed.push({ path: r.page_path, device: r.device_type, time: r.created_at });
    }
  }

  return { active_visitors: activeVisitors, feed };
}
