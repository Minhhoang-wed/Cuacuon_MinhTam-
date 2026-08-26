"use client";

import { useState } from "react";
import { BarChart3, LineChart as LineChartIcon, Flame, Clock } from "lucide-react";

// ── 1. HOURLY ACTIVITY CHART (Vertical Column Bars + Smooth Curve Toggle) ──
interface HourlyActivityChartProps {
  data: number[];
  labels: string[];
  title?: string;
  height?: number;
}

export function HourlyActivityChart({
  data,
  labels,
  title = "Lưu lượng truy cập theo giờ",
  height = 240,
}: HourlyActivityChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data, 1);
  const totalViews = data.reduce((s, v) => s + v, 0);

  // Find peak hour
  let peakIdx = 0;
  let peakVal = 0;
  data.forEach((v, i) => {
    if (v > peakVal) {
      peakVal = v;
      peakIdx = i;
    }
  });

  // Current hour in Vietnam (UTC+7)
  const vnNowHour = new Date(Date.now() + 7 * 60 * 60 * 1000).getUTCHours();

  return (
    <div className="hourly-activity-widget">
      {/* ── Widget Header with Meta & View Switcher ── */}
      <div className="hourly-widget-header">
        <div className="hourly-title-group">
          <h4 className="hourly-title">{title}</h4>
          <div className="hourly-meta-pills">
            <span className="hourly-meta-pill now">
              <Clock size={12} />
              <span>Hiện tại: <b>{vnNowHour}h</b></span>
            </span>
            {peakVal > 0 && (
              <span className="hourly-meta-pill peak">
                <Flame size={12} />
                <span>Cao điểm: <b>{peakIdx}h ({peakVal} lượt)</b></span>
              </span>
            )}
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="hourly-view-switcher">
          <button
            className={`switcher-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
            title="Xem dạng biểu đồ cột (dễ nhìn)"
          >
            <BarChart3 size={14} />
            <span>Cột</span>
          </button>
          <button
            className={`switcher-btn ${chartType === "line" ? "active" : ""}`}
            onClick={() => setChartType("line")}
            title="Xem dạng biểu đồ sóng"
          >
            <LineChartIcon size={14} />
            <span>Sóng</span>
          </button>
        </div>
      </div>

      {/* ── View 1: Super Clear Vertical Column Bar Chart (Default) ── */}
      {chartType === "bar" ? (
        <div className="hourly-bars-container" style={{ height }}>
          {data.map((val, idx) => {
            const pct = Math.max((val / maxVal) * 85, val > 0 ? 12 : 3);
            const isCurrent = idx === vnNowHour;
            const hasData = val > 0;

            return (
              <div
                key={idx}
                className={`hourly-col-item ${isCurrent ? "is-current" : ""} ${hasData ? "has-data" : ""}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {hoveredIdx === idx && (
                  <div className="hourly-tooltip">
                    <span className="tt-time">{idx.toString().padStart(2, "0")}:00 - {idx.toString().padStart(2, "0")}:59</span>
                    <b className="tt-val">{val} lượt xem</b>
                  </div>
                )}

                {/* Number on top if has data */}
                <span className="col-top-count">{val > 0 ? val : ""}</span>

                {/* Vertical Bar track and fill */}
                <div className="col-track">
                  <div
                    className="col-fill"
                    style={{
                      height: `${pct}%`,
                      background: isCurrent
                        ? "linear-gradient(180deg, #10b981 0%, #059669 100%)"
                        : hasData
                        ? "linear-gradient(180deg, #34d399 0%, #10b981 100%)"
                        : "#f1f5f9",
                    }}
                  />
                </div>

                {/* Bottom Hour Label */}
                <span className={`col-label ${isCurrent ? "now-label" : ""}`}>
                  {idx % 2 === 0 ? `${idx}h` : ""}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── View 2: Smooth Curved Line Chart ── */
        <LineChart
          data={data}
          labels={labels}
          height={height}
          color="#10b981"
          gradientId="emeraldHourlyGrad"
        />
      )}
    </div>
  );
}

// ── 2. PURE SVG LINE CHART (For 7-day and 30-day trends) ──
interface LineChartProps {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
  gradientId?: string;
  title?: string;
}

export function LineChart({
  data,
  labels,
  height = 240,
  color = "#10b981",
  gradientId = "emeraldGrad",
  title,
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="analytics-chart-empty" style={{ height }}>
        <span>Chưa có dữ liệu phân tích</span>
      </div>
    );
  }

  const maxVal = Math.max(...data, 5);
  const padding = { top: 25, right: 25, bottom: 35, left: 45 };
  const chartWidth = 720;
  const chartH = height - padding.top - padding.bottom;
  const chartW = chartWidth - padding.left - padding.right;

  const points = data.map((val, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (val / maxVal) * chartH,
  }));

  const curvePath = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
  }, "");

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${curvePath} L ${lastPoint.x},${padding.top + chartH} L ${firstPoint.x},${padding.top + chartH} Z`;

  const gridLines = 3;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => ({
    y: padding.top + (i / gridLines) * chartH,
    val: Math.round(maxVal - (i / gridLines) * maxVal),
  }));

  return (
    <div className="analytics-chart-container">
      {title && <h4 className="analytics-chart-title">{title}</h4>}
      <svg viewBox={`0 0 ${chartWidth} ${height}`} className="analytics-line-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.38" />
            <stop offset="80%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridSteps.map((g) => (
          <g key={g.val}>
            <line
              x1={padding.left}
              y1={g.y}
              x2={chartWidth - padding.right}
              y2={g.y}
              stroke="rgba(226, 232, 240, 0.6)"
              strokeDasharray="4 4"
            />
            <text x={padding.left - 10} y={g.y + 4} textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="500">
              {g.val}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={curvePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />

        {points.map((p, i) => (
          <g key={i} className="chart-dot-group">
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2.5" />
            <title>{`${labels[i]}: ${data[i]} lượt xem`}</title>
          </g>
        ))}

        {labels.map((label, i) => {
          const showEvery = labels.length > 18 ? 3 : labels.length > 10 ? 2 : 1;
          if (i % showEvery !== 0 && i !== labels.length - 1) return null;
          const x = padding.left + (i / Math.max(labels.length - 1, 1)) * chartW;
          return (
            <text key={i} x={x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="11.5" fontWeight="500">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── 3. DONUT CHART (Device Breakdown) ──
interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  title?: string;
}

export function DonutChart({ data, size = 160, title }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="analytics-chart-empty" style={{ height: size }}>
        <span>Chưa có dữ liệu thiết bị</span>
      </div>
    );
  }

  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const pct = total > 0 ? d.value / total : 0;
    const dashArray = `${circumference * pct} ${circumference * (1 - pct)}`;
    const dashOffset = -circumference * offset;
    offset += pct;
    return { ...d, dashArray, dashOffset, pct };
  });

  return (
    <div className="analytics-donut-wrap">
      {title && <h4 className="analytics-chart-title">{title}</h4>}
      <div className="analytics-donut-content">
        <div className="donut-svg-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.dashArray}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
              >
                <title>{`${seg.label}: ${seg.value} (${Math.round(seg.pct * 100)}%)`}</title>
              </circle>
            ))}
            <text x={center} y={center - 4} textAnchor="middle" fill="#0f172a" fontSize="19" fontWeight="700">
              {total.toLocaleString("vi-VN")}
            </text>
            <text x={center} y={center + 14} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">
              lượt xem
            </text>
          </svg>
        </div>
        <ul className="analytics-donut-legend">
          {segments.map((seg, i) => (
            <li key={i}>
              <span className="analytics-legend-dot" style={{ background: seg.color }} />
              <div className="legend-text">
                <span className="analytics-legend-label">{seg.label}</span>
                <span className="analytics-legend-value">
                  {Math.round(seg.pct * 100)}% ({seg.value.toLocaleString("vi-VN")})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── 4. LUXURY STAT CARD ──
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  colorClass?: "emerald" | "blue" | "teal" | "purple" | "rose";
}

export function StatCard({
  icon,
  label,
  value,
  change,
  changePositive = true,
  colorClass = "emerald",
}: StatCardProps) {
  const displayValue = typeof value === "number" ? value.toLocaleString("vi-VN") : value;

  return (
    <div className={`analytics-luxury-card ${colorClass}`}>
      <div className="card-top-row">
        <div className="card-icon-bubble">{icon}</div>
        {change && (
          <span className={`card-trend-pill ${changePositive ? "up" : "down"}`}>
            {change}
          </span>
        )}
      </div>
      <div className="card-bottom-row">
        <span className="card-label">{label}</span>
        <b className="card-number">{displayValue}</b>
      </div>
    </div>
  );
}
