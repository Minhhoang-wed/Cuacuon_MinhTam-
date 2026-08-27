"use client";

import { useState, useEffect, useCallback } from "react";
import { Laptop, PhoneCall, Smartphone, Tablet, Radio, MessageSquare, RotateCw } from "lucide-react";

interface ActivityItem {
  type?: "page_view" | "cta_click";
  path: string;
  device: string;
  target?: string;
  time: string;
}

interface RealtimeData {
  active_visitors: number;
  feed: ActivityItem[];
}

function timeAgo(dateStr: string, _now: number): string {
  const diff = Math.max(0, _now - new Date(dateStr).getTime());
  const secs = Math.floor(diff / 1000);
  if (secs < 6) return "vừa xong";
  if (secs < 60) return `${secs}s trước`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}p trước`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h trước`;
}

function pathLabel(path: string): { category: string; title: string } {
  if (path === "/") return { category: "Trang chủ", title: "Cửa Cuốn Minh Tâm" };
  const segments = path.split("/").filter(Boolean);
  const labels: Record<string, string> = {
    "san-pham": "Sản phẩm",
    "dich-vu": "Dịch vụ",
    "tin-tuc": "Cẩm nang",
    "meo-kien-thuc": "Mẹo vặt",
    "du-an": "Dự án",
    "lien-he": "Liên hệ",
    "ve-chung-toi": "Giới thiệu",
    "sua-cua-cuon": "Cứu hộ 24/7",
    "khu-vuc-phuc-vu": "Điểm trực",
  };
  const category = labels[segments[0]] || "Trang";
  const detail = decodeURIComponent(segments[segments.length - 1]).replace(/-/g, " ");
  return { category, title: detail };
}

export function AnalyticsRealtimeStream() {
  const [data, setData] = useState<RealtimeData>({ active_visitors: 0, feed: [] });
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/realtime", { cache: "no-store" });
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Poll every 3 seconds for lightning-fast real-time updates
  useEffect(() => {
    fetchData();
    const pollTimer = setInterval(fetchData, 3000);
    return () => clearInterval(pollTimer);
  }, [fetchData]);

  // Tick timeAgo every 1 second
  useEffect(() => {
    const clockTimer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  return (
    <div className="analytics-stream-panel">
      <div className="stream-header">
        <div className="stream-title-wrap">
          <span className="stream-live-indicator" />
          <h4>Live Activity Stream</h4>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="stream-counter-badge">
            <Radio size={12} className="animate-pulse" />
            <b>{loading ? "..." : data.active_visitors}</b> đang xem
          </span>
          <button
            onClick={handleManualRefresh}
            className="stream-refresh-btn"
            title="Làm mới ngay"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#94a3b8",
              display: "grid",
              placeItems: "center",
            }}
          >
            <RotateCw size={13} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="stream-list-container">
        {data.feed.length === 0 && !loading && (
          <div className="stream-empty">
            <span>Chưa có truy cập nào trong 5 phút qua</span>
          </div>
        )}
        <ul className="stream-list">
          {data.feed.map((item, i) => {
            const { category, title } = pathLabel(item.path);
            const isCTA = item.type === "cta_click";
            const isMobile = item.device === "mobile";
            const isTablet = item.device === "tablet";

            return (
              <li key={`${item.path}-${item.time}-${i}`} className={`stream-item ${isCTA ? "cta-item" : ""}`}>
                <div className={`stream-device-icon ${isCTA ? "cta-icon-wrap" : ""}`}>
                  {isCTA ? (
                    item.target === "zalo" ? (
                      <MessageSquare size={15} color="#38bdf8" />
                    ) : (
                      <PhoneCall size={15} color="#10b981" />
                    )
                  ) : isMobile ? (
                    <Smartphone size={15} color="#10b981" />
                  ) : isTablet ? (
                    <Tablet size={15} color="#f59e0b" />
                  ) : (
                    <Laptop size={15} color="#3b82f6" />
                  )}
                </div>
                <div className="stream-content">
                  <div className="stream-item-row">
                    <span className={`stream-category ${isCTA ? "cta-cat" : ""}`}>
                      {isCTA ? `📞 ${item.target?.toUpperCase() || "CALL"}` : category}
                    </span>
                    <span className="stream-time">{timeAgo(item.time, now)}</span>
                  </div>
                  <span className="stream-path-title" title={item.path}>
                    {isCTA ? `Bấm liên hệ từ ${title}` : title}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ── Top Live Active Badge Component for Header ──
export function LiveOnlinePill() {
  const [activeCount, setActiveCount] = useState<number | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/realtime", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setActiveCount(json.active_visitors || 0);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const timer = setInterval(fetchCount, 4000); // 4s interval
    return () => clearInterval(timer);
  }, [fetchCount]);

  return (
    <div className="live-online-pill">
      <span className="live-pulsing-dot" />
      <span>{activeCount !== null ? `${activeCount} Khách Đang Online` : "Đang kết nối..."}</span>
    </div>
  );
}
