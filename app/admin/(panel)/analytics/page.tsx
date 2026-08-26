import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { AnalyticsContentTable } from "@/components/admin/analytics-content-table";
import { getAnalyticsSummary, getContentStats } from "@/lib/analytics-data";
import type { AnalyticsSummary, ContentStat } from "@/lib/analytics-data";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let summary: AnalyticsSummary;
  let contentStats: ContentStat[];

  try {
    [summary, contentStats] = await Promise.all([
      getAnalyticsSummary("today"),
      getContentStats(undefined, "7d"),
    ]);
  } catch {
    // If analytics tables don't exist yet, show empty state
    summary = {
      period: "today",
      total_views: 0,
      unique_visitors: 0,
      total_sessions: 0,
      avg_duration_ms: 0,
      avg_scroll_depth: 0,
      bounce_rate: 0,
      device_breakdown: { desktop: 0, mobile: 0, tablet: 0 },
      cta_clicks: {},
      hourly_views: Array(24).fill(0),
      top_pages: [],
      top_referrers: [],
    };
    contentStats = [];
  }

  return (
    <>
      <header className="admin-page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Phân Tích & Báo Cáo Real-Time</h1>
          <p>Theo dõi lượt khách truy cập, cuộc gọi hotline và xếp hạng sản phẩm theo thời gian thực.</p>
        </div>
      </header>

      <AnalyticsDashboard initialData={summary}>
        <AnalyticsContentTable initialData={contentStats} />
      </AnalyticsDashboard>
    </>
  );
}
