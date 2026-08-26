"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, Users, PhoneCall, MessageSquareText, Calendar } from "lucide-react";
import { LineChart, DonutChart, StatCard } from "./analytics-charts";
import { AnalyticsRealtimeStream, LiveOnlinePill } from "./analytics-realtime";
import type { AnalyticsSummary } from "@/lib/analytics-data";

interface Props {
  initialData: AnalyticsSummary;
  children?: React.ReactNode;
}

const PERIODS = [
  { key: "today", label: "Hôm Nay" },
  { key: "7d", label: "7 Ngày" },
  { key: "30d", label: "30 Ngày" },
];

export function AnalyticsDashboard({ initialData, children }: Props) {
  const [period, setPeriod] = useState("today");
  const [data, setData] = useState<AnalyticsSummary>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchPeriod = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?period=${p}`, { cache: "no-store" });
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriod(period);
    const interval = setInterval(() => fetchPeriod(period), 10000);
    return () => clearInterval(interval);
  }, [period, fetchPeriod]);

  // Chart data
  const hourlyLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);
  const hourlyData = data.hourly_views || Array(24).fill(0);

  const dailySeries = data.daily_series || [];
  const dailyLabels = dailySeries.map((d) => {
    const date = new Date(d.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
  const dailyViews = dailySeries.map((d) => d.views);

  const deviceData = [
    { label: "Mobile", value: data.device_breakdown.mobile || 0, color: "#10b981" },
    { label: "Desktop", value: data.device_breakdown.desktop || 0, color: "#38bdf8" },
    { label: "Tablet", value: data.device_breakdown.tablet || 0, color: "#f59e0b" },
  ];

  // CTA counts
  const hotlineClicks = data.cta_clicks?.hotline || 0;
  const zaloClicks = data.cta_clicks?.zalo || 0;
  const formClicks = data.cta_clicks?.form_submit || 0;

  return (
    <div className={`analytics-dashboard-lux ${loading ? "is-loading" : ""}`}>
      {/* ── Top Header Control Bar ── */}
      <div className="analytics-top-bar">
        <div className="analytics-period-pills">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              className={`period-pill ${period === p.key ? "active" : ""}`}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
          <button className="period-pill disabled" title="Tùy chỉnh khoảng ngày">
            <Calendar size={13} style={{ marginRight: 4 }} />
            Tùy Chỉnh
          </button>
        </div>

        <LiveOnlinePill />
      </div>

      {/* ── 1. 4 Luxury Stat Cards (Real DB Data) ── */}
      <section className="analytics-cards-grid">
        <StatCard
          icon={<Eye size={20} />}
          label="Tổng Lượt Xem"
          value={data.total_views || 0}
          change={data.total_views > 0 ? "Lượt xem" : undefined}
          changePositive={true}
          colorClass="emerald"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Khách Độc Quyền"
          value={data.unique_visitors || 0}
          change={data.unique_visitors > 0 ? "Khách thực" : undefined}
          changePositive={true}
          colorClass="teal"
        />
        <StatCard
          icon={<PhoneCall size={20} />}
          label="Cuộc Gọi Hotline"
          value={`${hotlineClicks} Clicks`}
          change={hotlineClicks > 0 ? "Khách gọi" : undefined}
          changePositive={true}
          colorClass="blue"
        />
        <StatCard
          icon={<MessageSquareText size={20} />}
          label="Tin Nhắn Zalo / Form"
          value={`${zaloClicks + formClicks} Clicks`}
          change={(zaloClicks + formClicks) > 0 ? "Tin nhắn" : undefined}
          changePositive={true}
          colorClass="purple"
        />
      </section>

      {/* ── 2. Middle Row: Hourly/Daily Traffic Chart (Left) + Live Activity Stream (Right) ── */}
      <section className="analytics-middle-grid">
        <div className="analytics-chart-panel">
          {period === "today" ? (
            <LineChart
              data={hourlyData}
              labels={hourlyLabels}
              height={240}
              title="Lưu Lượng Khách Truy Cập Theo Giờ (Hôm Nay)"
              color="#10b981"
              gradientId="hourlyEmeraldGrad"
            />
          ) : (
            <LineChart
              data={dailyViews}
              labels={dailyLabels}
              height={240}
              title={`Lượng Truy Cập Theo Ngày (${period === "7d" ? "7 Ngày" : "30 Ngày"} Qua)`}
              color="#38bdf8"
              gradientId="dailyBlueGrad"
            />
          )}
        </div>

        <div className="analytics-stream-column">
          <AnalyticsRealtimeStream />
        </div>
      </section>

      {/* ── 3. Bottom Row: Device Breakdown & Ranked Content Table ── */}
      <section className="analytics-bottom-grid">
        <div className="analytics-donut-panel">
          <DonutChart data={deviceData} title="Device vs Desktop (%)" size={170} />
        </div>

        <div className="analytics-content-table-wrap">
          {children}
        </div>
      </section>
    </div>
  );
}
