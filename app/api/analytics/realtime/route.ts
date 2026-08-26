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

    const recent = await supabaseFetch<Array<{
      visitor_id: string;
      page_path: string;
      device_type: string;
      created_at: string;
    }>>(
      `/rest/v1/analytics_page_views?created_at=gte.${fiveMinAgo}&select=visitor_id,page_path,device_type,created_at&order=created_at.desc`,
      {},
      accessToken
    );

    const rows = recent || [];
    const activeVisitors = new Set(rows.map((r) => r.visitor_id)).size;

    // Most recent 10 unique page views
    const seen = new Set<string>();
    const feed: Array<{ path: string; device: string; time: string }> = [];
    for (const r of rows) {
      const key = `${r.visitor_id}:${r.page_path}`;
      if (!seen.has(key) && feed.length < 10) {
        seen.add(key);
        feed.push({ path: r.page_path, device: r.device_type, time: r.created_at });
      }
    }

    return NextResponse.json({
      active_visitors: activeVisitors,
      feed,
    });
  } catch (err) {
    console.error("[analytics/realtime]", err);
    return NextResponse.json({ active_visitors: 0, feed: [] });
  }
}
