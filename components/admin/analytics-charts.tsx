"use client";

import { useState } from "react";

// ── Fritsch-Carlson Monotone Cubic Spline (Guarantees smooth curves without overshoot/looping) ──
function getMonotoneSplinePath(points: Array<{ x: number; y: number }>): string {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M ${points[0].x},${points[0].y}`;
  if (n === 2) return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;

  const dx: number[] = [];
  const dy: number[] = [];
  const delta: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dX = points[i + 1].x - points[i].x;
    const dY = points[i + 1].y - points[i].y;
    dx.push(dX);
    dy.push(dY);
    delta.push(dX === 0 ? 0 : dY / dX);
  }

  const m: number[] = [delta[0]];
  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      m.push(0);
    } else {
      m.push((delta[i - 1] + delta[i]) / 2);
    }
  }
  m.push(delta[n - 2]);

  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const alpha = m[i] / delta[i];
      const beta = m[i + 1] / delta[i];
      const dist = alpha * alpha + beta * beta;
      if (dist > 9) {
        const tau = 3 / Math.sqrt(dist);
        m[i] = tau * alpha * delta[i];
        m[i + 1] = tau * beta * delta[i];
      }
    }
  }

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const cp1x = points[i].x + dx[i] / 3;
    const cp1y = points[i].y + (m[i] * dx[i]) / 3;
    const cp2x = points[i + 1].x - dx[i] / 3;
    const cp2y = points[i + 1].y - (m[i + 1] * dx[i]) / 3;
    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${points[i + 1].x.toFixed(1)},${points[i + 1].y.toFixed(1)}`;
  }

  return path;
}

// ── 1. DUAL-WAVE SITE TRAFFIC CHART (Matching User's Mockup: Total Visits vs Unique Visits) ──
interface TrafficWaveChartProps {
  viewsData: number[];
  visitorsData: number[];
  labels: string[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export function TrafficWaveChart({
  viewsData,
  visitorsData,
  labels,
  title = "SITE TRAFFIC",
  subtitle = "NUMBERS OF VISITS",
  height = 250,
}: TrafficWaveChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxRaw = Math.max(...viewsData, ...visitorsData, 0);
  const maxVal = maxRaw <= 4 ? 5 : Math.ceil(maxRaw * 1.25);

  const padding = { top: 35, right: 25, bottom: 42, left: 45 };
  const chartWidth = 720;
  const chartH = height - padding.top - padding.bottom;
  const chartW = chartWidth - padding.left - padding.right;

  // Views line points (Teal / Green)
  const viewsPoints = viewsData.map((val, i) => ({
    x: padding.left + (i / Math.max(viewsData.length - 1, 1)) * chartW,
    y: padding.top + chartH - (val / maxVal) * chartH,
    val,
    label: labels[i] || `${i}h`,
    idx: i,
  }));

  // Visitors line points (Orange / Amber)
  const visitorsPoints = visitorsData.map((val, i) => ({
    x: padding.left + (i / Math.max(visitorsData.length - 1, 1)) * chartW,
    y: padding.top + chartH - (val / maxVal) * chartH,
    val,
    label: labels[i] || `${i}h`,
    idx: i,
  }));

  const viewsCurve = getMonotoneSplinePath(viewsPoints);
  const visitorsCurve = getMonotoneSplinePath(visitorsPoints);

  // Area under views curve
  const lastV = viewsPoints[viewsPoints.length - 1];
  const firstV = viewsPoints[0];
  const viewsArea = `${viewsCurve} L ${lastV.x.toFixed(1)},${padding.top + chartH} L ${firstV.x.toFixed(1)},${padding.top + chartH} Z`;

  // Grid steps (4 horizontal guides)
  const gridLines = 4;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => {
    const frac = i / gridLines;
    return {
      y: padding.top + frac * chartH,
      val: Math.round(maxVal - frac * maxVal),
    };
  });

  const activeViewsPoint = hoveredIdx !== null ? viewsPoints[hoveredIdx] : null;
  const activeVisitorsPoint = hoveredIdx !== null ? visitorsPoints[hoveredIdx] : null;

  return (
    <div className="site-traffic-wave-card">
      {/* ── Header Title & Subtitle ── */}
      <div className="traffic-wave-header">
        <h3 className="traffic-main-title">{title}</h3>
        <span className="traffic-sub-title">{subtitle}</span>
      </div>

      {/* ── SVG Dual-Wave Canvas ── */}
      <div className="traffic-wave-canvas" style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="analytics-line-chart"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {/* Teal Area Gradient */}
            <linearGradient id="trafficTealAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#0d9488" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="trafficGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {gridSteps.map((g, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={g.y}
                x2={chartWidth - padding.right}
                y2={g.y}
                stroke="rgba(226, 232, 240, 0.7)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={g.y + 4}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="10.5"
                fontWeight="500"
              >
                {g.val}
              </text>
            </g>
          ))}

          {/* Teal Shaded Area */}
          <path d={viewsArea} fill="url(#trafficTealAreaGrad)" />

          {/* 1. Teal Line: Total Visits */}
          <path
            d={viewsCurve}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#trafficGlow)"
          />

          {/* 2. Orange Line: Unique Visits */}
          <path
            d={visitorsCurve}
            fill="none"
            stroke="#fb923c"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#trafficGlow)"
          />

          {/* Hover Crosshair Guide */}
          {activeViewsPoint && (
            <line
              x1={activeViewsPoint.x}
              y1={padding.top}
              x2={activeViewsPoint.x}
              y2={padding.top + chartH}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.8"
            />
          )}

          {/* Teal Points & Numbers (Total Visits) */}
          {viewsPoints.map((p, i) => {
            const hasData = p.val > 0;
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={`v-${i}`}
                onMouseEnter={() => setHoveredIdx(i)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />

                {/* Point Number floating above dot (as shown in user mockup) */}
                {hasData && (
                  <text
                    x={p.x}
                    y={p.y - 9}
                    textAnchor="middle"
                    fill="#0f766e"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {p.val}
                  </text>
                )}

                {/* Node dot */}
                {(hasData || isHovered) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5.5 : 4}
                    fill="#ffffff"
                    stroke="#2dd4bf"
                    strokeWidth={isHovered ? 3 : 2.5}
                  />
                )}
              </g>
            );
          })}

          {/* Orange Points & Numbers (Unique Visits) */}
          {visitorsPoints.map((p, i) => {
            const hasData = p.val > 0;
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={`u-${i}`}
                onMouseEnter={() => setHoveredIdx(i)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />

                {/* Point Number floating above dot */}
                {hasData && (
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    fill="#c2410c"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {p.val}
                  </text>
                )}

                {/* Node dot */}
                {(hasData || isHovered) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5.5 : 4}
                    fill="#ffffff"
                    stroke="#fb923c"
                    strokeWidth={isHovered ? 3 : 2.5}
                  />
                )}
              </g>
            );
          })}

          {/* X-axis Timeline Labels */}
          {labels.map((label, i) => {
            const showEvery = labels.length > 18 ? 3 : labels.length > 10 ? 2 : 1;
            if (i % showEvery !== 0 && i !== labels.length - 1) return null;
            const x = padding.left + (i / Math.max(labels.length - 1, 1)) * chartW;

            return (
              <text
                key={i}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#64748b"
                fontSize="11.5"
                fontWeight="600"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {activeViewsPoint && activeVisitorsPoint && (
          <div
            className="traffic-wave-tooltip"
            style={{
              left: `${(activeViewsPoint.x / chartWidth) * 100}%`,
              top: `${(Math.min(activeViewsPoint.y, activeVisitorsPoint.y) / height) * 100}%`,
            }}
          >
            <span className="tw-time">{activeViewsPoint.label}</span>
            <div className="tw-row">
              <span className="tw-dot teal" />
              <span>Tổng xem: <b>{activeViewsPoint.val}</b></span>
            </div>
            <div className="tw-row">
              <span className="tw-dot orange" />
              <span>Khách thực: <b>{activeVisitorsPoint.val}</b></span>
            </div>
          </div>
        )}
      </div>

      {/* ── Legend below the chart (Matching User Mockup) ── */}
      <div className="traffic-wave-legend">
        <div className="legend-item">
          <span className="legend-line teal" />
          <span className="legend-label">Total Visits (Tổng lượt xem)</span>
        </div>
        <div className="legend-item">
          <span className="legend-line orange" />
          <span className="legend-label">Unique Visits (Khách độc quyền)</span>
        </div>
      </div>
    </div>
  );
}

// ── 2. DONUT CHART (Device Breakdown) ──
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

// ── 3. LUXURY STAT CARD ──
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
