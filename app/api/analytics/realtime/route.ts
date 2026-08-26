import { NextResponse } from "next/server";
import { getAdminSession, getAdminAccessToken } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Count visitors with activity in the last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const accessToken = await getAdminAccessToken();

    const [pageViews, events] = await Promise.all([
      supabaseFetch<Array<{
        visitor_id: string;
        page_path: string;
        device_type: string;
        created_at: string;
      }>>(
        `/rest/v1/analytics_page_views?created_at=gte.${fiveMinAgo}&select=visitor_id,page_path,device_type,created_at&order=created_at.desc&limit=30`,
        {},
        accessToken
      ),
      supabaseFetch<Array<{
        visitor_id: string;
        event_type: string;
        event_target: string | null;
        page_path: string | null;
        created_at: string;
      }>>(
        `/rest/v1/analytics_events?created_at=gte.${fiveMinAgo}&select=visitor_id,event_type,event_target,page_path,created_at&order=created_at.desc&limit=20`,
        {},
        accessToken
      ),
    ]);

    const pvRows = pageViews || [];
    const evRows = events || [];

    // Distinct visitors in the last 5 minutes
    const allVisitors = new Set([
      ...pvRows.map((r) => r.visitor_id),
      ...evRows.map((r) => r.visitor_id),
    ]);
    const activeVisitors = Math.max(allVisitors.size, pvRows.length > 0 ? 1 : 0);

    // Combine page views & events into unified chronological activity stream
    const feed: Array<{
      type: "page_view" | "cta_click";
      path: string;
      device: string;
      target?: string;
      time: string;
    }> = [];

    for (const r of pvRows) {
      feed.push({
        type: "page_view",
        path: r.page_path,
        device: r.device_type || "desktop",
        time: r.created_at,
      });
    }

    for (const e of evRows) {
      if (e.event_type === "cta_click") {
        feed.push({
          type: "cta_click",
          path: e.page_path || "/",
          device: "mobile",
          target: e.event_target || "hotline",
          time: e.created_at,
        });
      }
    }

    // Sort by latest timestamp descending
    feed.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      active_visitors: activeVisitors,
      feed: feed.slice(0, 15),
    });
  } catch (err) {
    console.error("[analytics/realtime]", err);
    return NextResponse.json({ active_visitors: 0, feed: [] });
  }
}
