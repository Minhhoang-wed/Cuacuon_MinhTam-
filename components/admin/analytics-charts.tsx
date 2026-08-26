"use client";

import { useState } from "react";
import { BarChart3, Waves, TrendingUp, Flame, Clock } from "lucide-react";

// ── Fritsch-Carlson Monotone Cubic Spline Algorithm (D3.js / Vercel standard) ──
// Mathematically guarantees monotonicity: NO undershoot below 0, NO runaway loops, silky smooth curves.
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
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i + 1].x},${points[i + 1].y}`;
  }

  return path;
}

// ── 1. HOURLY ACTIVITY CHART (Multi-style Switcher: Bars / Cyber Neon Wave / Smooth Area) ──
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
  // Styles: "bars" | "neon-wave" | "smooth-area"
  const [styleMode, setStyleMode] = useState<"bars" | "neon-wave" | "smooth-area">("neon-wave");
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
      {/* ── Widget Header ── */}
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

        {/* 3-Style Mode Switcher */}
        <div className="hourly-view-switcher">
          <button
            className={`switcher-btn ${styleMode === "neon-wave" ? "active" : ""}`}
            onClick={() => setStyleMode("neon-wave")}
            title="Sóng Neon Phát Sáng (Cyber Wave)"
          >
            <Waves size={13} />
            <span>Sóng Neon</span>
          </button>
          <button
            className={`switcher-btn ${styleMode === "smooth-area" ? "active" : ""}`}
            onClick={() => setStyleMode("smooth-area")}
            title="Sóng Gradient Êm Dịu"
          >
            <TrendingUp size={13} />
            <span>Sóng Êm</span>
          </button>
          <button
            className={`switcher-btn ${styleMode === "bars" ? "active" : ""}`}
            onClick={() => setStyleMode("bars")}
            title="Biểu Đồ Cột Trực Quan"
          >
            <BarChart3 size={13} />
            <span>Cột</span>
          </button>
        </div>
      </div>

      {/* ── Mode 1: Cyber Neon Wave (Modern Spline with glowing aura & gradient) ── */}
      {styleMode === "neon-wave" && (
        <NeonWaveChart
          data={data}
          labels={labels}
          height={height}
          peakIdx={peakIdx}
          vnNowHour={vnNowHour}
          hoveredIdx={hoveredIdx}
          setHoveredIdx={setHoveredIdx}
        />
      )}

      {/* ── Mode 2: Smooth Area Wave (Soft Glassmorphism) ── */}
      {styleMode === "smooth-area" && (
        <LineChart
          data={data}
          labels={labels}
          height={height}
          color="#06b6d4"
          gradientId="softCyanWaveGrad"
        />
      )}

      {/* ── Mode 3: Vertical Column Bars ── */}
      {styleMode === "bars" && (
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
                {hoveredIdx === idx && (
                  <div className="hourly-tooltip">
                    <span className="tt-time">{idx.toString().padStart(2, "0")}:00 - {idx.toString().padStart(2, "0")}:59</span>
                    <b className="tt-val">{val} lượt xem</b>
                  </div>
                )}
                <span className="col-top-count">{val > 0 ? val : ""}</span>
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
                <span className={`col-label ${isCurrent ? "now-label" : ""}`}>
                  {idx % 2 === 0 ? `${idx}h` : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── CYBER NEON WAVE COMPONENT (Custom high-end wave with interactive crosshair) ──
interface NeonWaveProps {
  data: number[];
  labels: string[];
  height: number;
  peakIdx: number;
  vnNowHour: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
}

function NeonWaveChart({
  data,
  labels,
  height,
  peakIdx,
  vnNowHour,
  hoveredIdx,
  setHoveredIdx,
}: NeonWaveProps) {
  const maxVal = Math.max(...data, 4);
  const padding = { top: 30, right: 25, bottom: 35, left: 42 };
  const chartWidth = 720;
  const chartH = height - padding.top - padding.bottom;
  const chartW = chartWidth - padding.left - padding.right;

  const points = data.map((val, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (val / maxVal) * chartH,
    val,
    idx: i,
  }));

  const curvePath = getMonotoneSplinePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${curvePath} L ${lastPoint.x},${padding.top + chartH} L ${firstPoint.x},${padding.top + chartH} Z`;

  // Grid steps (4 horizontal guides)
  const gridLines = 3;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => ({
    y: padding.top + (i / gridLines) * chartH,
    val: Math.round(maxVal - (i / gridLines) * maxVal),
  }));

  const activeHoverPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="neon-wave-wrapper" style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="analytics-line-chart"
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          {/* Multi-stop Neon Area Gradient: Emerald to Cyan to Transparent */}
          <linearGradient id="neonCyberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.18" />
            <stop offset="85%" stopColor="#0284c7" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>

          {/* Stroke Gradient */}
          <linearGradient id="neonStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Glowing Aura Filter */}
          <filter id="neonAuraGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur1" />
            <feGaussianBlur stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal Background Guides */}
        {gridSteps.map((g, idx) => (
          <g key={idx}>
            <line
              x1={padding.left}
              y1={g.y}
              x2={chartWidth - padding.right}
              y2={g.y}
              stroke="rgba(226, 232, 240, 0.7)"
              strokeDasharray="4 4"
            />
            <text x={padding.left - 10} y={g.y + 4} textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="500">
              {g.val}
            </text>
          </g>
        ))}

        {/* Gradient Wave Area Fill */}
        <path d={areaPath} fill="url(#neonCyberGrad)" />

        {/* Ambient Blurred Glow Line Behind */}
        <path
          d={curvePath}
          fill="none"
          stroke="url(#neonStrokeGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
          filter="url(#neonAuraGlow)"
        />

        {/* Sharp High-Precision Crisp Line in Front */}
        <path
          d={curvePath}
          fill="none"
          stroke="url(#neonStrokeGrad)"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* Interactive Vertical Crosshair Line on hover */}
        {activeHoverPoint && (
          <line
            x1={activeHoverPoint.x}
            y1={padding.top}
            x2={activeHoverPoint.x}
            y2={padding.top + chartH}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.8"
          />
        )}

        {/* Data Point Nodes */}
        {points.map((p, i) => {
          const isHovered = hoveredIdx === i;
          const isPeak = p.val > 0 && i === peakIdx;
          const isCurrent = i === vnNowHour;
          const hasVisits = p.val > 0;

          if (!hasVisits && !isHovered && !isCurrent) {
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="12"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredIdx(i)}
              />
            );
          }

          return (
            <g
              key={i}
              className="neon-dot-group"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(i)}
            >
              {/* Invisible touch target */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

              {/* Pulsing ring on peak or current */}
              {(isPeak || (isCurrent && hasVisits)) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  opacity="0.4"
                  className="animate-ping"
                />
              )}

              {/* Outer halo */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 7 : isPeak ? 6 : 4.5}
                fill="#ffffff"
                stroke={isPeak ? "#059669" : "#10b981"}
                strokeWidth={isHovered ? 3 : 2.5}
                filter="drop-shadow(0 2px 4px rgba(16,185,129,0.4))"
              />

              {/* Inner core dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 3.5 : 2.5}
                fill={isPeak ? "#059669" : "#10b981"}
              />
            </g>
          );
        })}

        {/* X-axis Hour Labels */}
        {labels.map((label, i) => {
          if (i % 3 !== 0 && i !== labels.length - 1) return null;
          const x = padding.left + (i / Math.max(labels.length - 1, 1)) * chartW;
          const isNow = i === vnNowHour || (i < 23 && vnNowHour >= i && vnNowHour < i + 3);

          return (
            <text
              key={i}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fill={isNow ? "#059669" : "#94a3b8"}
              fontSize="11.5"
              fontWeight={isNow ? "700" : "500"}
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Floating Glassmorphism Tooltip for Wave */}
      {activeHoverPoint && (
        <div
          className="wave-floating-tooltip"
          style={{
            left: `${(activeHoverPoint.x / chartWidth) * 100}%`,
            top: `${(activeHoverPoint.y / height) * 100}%`,
          }}
        >
          <span className="wf-time">{activeHoverPoint.idx.toString().padStart(2, "0")}:00 - {activeHoverPoint.idx.toString().padStart(2, "0")}:59</span>
          <b className="wf-val">{activeHoverPoint.val} lượt xem</b>
        </div>
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="analytics-chart-empty" style={{ height }}>
        <span>Chưa có dữ liệu phân tích</span>
      </div>
    );
  }

  const maxVal = Math.max(...data, 4);
  const padding = { top: 25, right: 25, bottom: 35, left: 45 };
  const chartWidth = 720;
  const chartH = height - padding.top - padding.bottom;
  const chartW = chartWidth - padding.left - padding.right;

  const points = data.map((val, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (val / maxVal) * chartH,
    val,
    idx: i,
  }));

  const curvePath = getMonotoneSplinePath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${curvePath} L ${lastPoint.x},${padding.top + chartH} L ${firstPoint.x},${padding.top + chartH} Z`;

  const gridLines = 3;
  const gridSteps = Array.from({ length: gridLines + 1 }, (_, i) => ({
    y: padding.top + (i / gridLines) * chartH,
    val: Math.round(maxVal - (i / gridLines) * maxVal),
  }));

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="analytics-chart-container" style={{ position: "relative" }}>
      {title && <h4 className="analytics-chart-title">{title}</h4>}
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="analytics-line-chart"
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.38" />
            <stop offset="80%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridSteps.map((g, idx) => (
          <g key={idx}>
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
        <path d={curvePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" filter={`url(#glow-${gradientId})`} />

        {points.map((p, i) => (
          <g key={i} className="chart-dot-group" onMouseEnter={() => setHoveredIdx(i)} style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 5.5 : 4}
              fill="#ffffff"
              stroke={color}
              strokeWidth="2.5"
            />
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

      {activePoint && (
        <div
          className="wave-floating-tooltip"
          style={{
            left: `${(activePoint.x / chartWidth) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
          }}
        >
          <span className="wf-time">{labels[activePoint.idx]}</span>
          <b className="wf-val">{activePoint.val} lượt xem</b>
        </div>
      )}
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
