"use client";

import { useState } from "react";

// ── 1. CLEAN STANDARD LINE CHART (Standard Line with crisp points and hover tooltip) ──
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="analytics-chart-empty" style={{ height }}>
        <span>Chưa có dữ liệu phân tích</span>
      </div>
    );
  }

  // Calculate scales
  const maxRaw = Math.max(...data, 0);
  // Round maxVal up to nice integer for clean grid lines
  const maxVal = maxRaw <= 4 ? 5 : Math.ceil(maxRaw * 1.15);

  const padding = { top: 25, right: 25, bottom: 35, left: 45 };
  const chartWidth = 720;
  const chartH = height - padding.top - padding.bottom;
  const chartW = chartWidth - padding.left - padding.right;

  const points = data.map((val, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (val / maxVal) * chartH,
    val,
    label: labels[i] || `${i}h`,
    idx: i,
  }));

  // Standard direct line path (crisp & accurate, no curvature overshoot)
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)},${padding.top + chartH} L ${firstPoint.x.toFixed(1)},${padding.top + chartH} Z`;

  // Grid steps (4 horizontal guides)
  const gridLines = 4;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => {
    const frac = i / gridLines;
    return {
      y: padding.top + frac * chartH,
      val: Math.round(maxVal - frac * maxVal),
    };
  });

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="analytics-chart-container" style={{ position: "relative" }}>
      {title && (
        <div className="chart-header-row">
          <h4 className="analytics-chart-title">{title}</h4>
          {maxRaw > 0 && (
            <span className="chart-total-pill">
              Cao nhất: <b>{maxRaw} lượt</b>
            </span>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="analytics-line-chart"
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="60%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {gridSteps.map((g, idx) => (
          <g key={idx}>
            <line
              x1={padding.left}
              y1={g.y}
              x2={chartWidth - padding.right}
              y2={g.y}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={g.y + 4}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="500"
            >
              {g.val}
            </text>
          </g>
        ))}

        {/* Shaded Area underneath the line */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Crisp Line Stroke */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover Crosshair Guide Line */}
        {activePoint && (
          <line
            x1={activePoint.x}
            y1={padding.top}
            x2={activePoint.x}
            y2={padding.top + chartH}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.75"
          />
        )}

        {/* Interactive Point Nodes */}
        {points.map((p, i) => {
          const isHovered = hoveredIdx === i;
          const hasValue = p.val > 0;

          return (
            <g
              key={i}
              className="chart-dot-node"
              onMouseEnter={() => setHoveredIdx(i)}
              style={{ cursor: "pointer" }}
            >
              {/* Invisible large touch target for easy hover */}
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />

              {/* Visible dot (always visible on peaks, or on hover) */}
              {(hasValue || isHovered) && (
                <>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill="#ffffff"
                    stroke={color}
                    strokeWidth={isHovered ? 3 : 2}
                  />
                  {hasValue && (
                    <circle cx={p.x} cy={p.y} r={isHovered ? 2.5 : 1.5} fill={color} />
                  )}
                </>
              )}
            </g>
          );
        })}

        {/* X-axis Labels */}
        {labels.map((label, i) => {
          const showEvery = labels.length > 18 ? 3 : labels.length > 10 ? 2 : 1;
          if (i % showEvery !== 0 && i !== labels.length - 1) return null;
          const x = padding.left + (i / Math.max(labels.length - 1, 1)) * chartW;

          return (
            <text
              key={i}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              fontWeight="500"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && (
        <div
          className="clean-line-tooltip"
          style={{
            left: `${(activePoint.x / chartWidth) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
          }}
        >
          <span className="cl-time">{activePoint.label}</span>
          <b className="cl-val">{activePoint.val} lượt xem</b>
        </div>
      )}
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
