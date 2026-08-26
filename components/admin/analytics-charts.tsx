"use client";

// ── Pure SVG/CSS Charts for Luxury Analytics Dashboard ──
// High-end aesthetic with curved lines, gradients, and glowing accents

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

  // Create smooth curved path (bezier interpolation)
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

  // Grid lines (3 horizontal guides)
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

        {/* Horizontal grid lines */}
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

        {/* Area with vertical gradient */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Smooth glowing line */}
        <path
          d={curvePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Data point dots */}
        {points.map((p, i) => (
          <g key={i} className="chart-dot-group">
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2.5" />
            <title>{`${labels[i]}: ${data[i]} lượt xem`}</title>
          </g>
        ))}

        {/* X-axis time labels */}
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

// ── Bar Chart ──
interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  title?: string;
}

export function BarChart({ data, height = 180, title }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="analytics-chart-empty" style={{ height }}>
        <span>Chưa có dữ liệu</span>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="analytics-bar-chart">
      {title && <h4 className="analytics-chart-title">{title}</h4>}
      <div className="analytics-bars" style={{ height }}>
        {data.map((item, i) => {
          const pct = (item.value / maxVal) * 100;
          return (
            <div key={i} className="analytics-bar-item">
              <div className="analytics-bar-meta">
                <span className="analytics-bar-label" title={item.label}>
                  {item.label}
                </span>
                <span className="analytics-bar-value">{item.value.toLocaleString("vi-VN")}</span>
              </div>
              <div className="analytics-bar-track">
                <div
                  className="analytics-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: item.color || "var(--chart-primary, #10b981)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Donut Chart (Device Breakdown) ──
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
        <span>Chưa có dữ liệu</span>
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

// ── Luxury Stat Card ──
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
  change = "+12.5%",
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
            {changePositive ? "↗" : "↘"} {change}
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
