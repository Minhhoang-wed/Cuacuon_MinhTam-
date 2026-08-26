"use client";

import { useState, useEffect, useCallback } from "react";
import { Laptop, PhoneCall, Smartphone, Tablet, Radio } from "lucide-react";

interface RealtimeData {
  active_visitors: number;
  feed: Array<{ path: string; device: string; time: string }>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 10) return "vừa xong";
  if (secs < 60) return `${secs}s trước`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}p trước`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h trước`;
}

function pathLabel(path: string): { category: string; title: string } {
  if (path === "/") return { category: "Trang chủ", title: "Cửa Cuốn An Tâm" };
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
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="analytics-stream-panel">
      <div className="stream-header">
        <div className="stream-title-wrap">
          <span className="stream-live-indicator" />
          <h4>Live Activity Stream</h4>
        </div>
        <span className="stream-counter-badge">
          <Radio size={12} className="animate-pulse" />
          <b>{loading ? "..." : data.active_visitors}</b> đang xem
        </span>
      </div>

      <div className="stream-list-container">
        {data.feed.length === 0 && !loading && (
          <div className="stream-empty">
            <span>Chưa có truy cập nào gần đây</span>
          </div>
        )}
        <ul className="stream-list">
          {data.feed.map((item, i) => {
            const { category, title } = pathLabel(item.path);
            const isMobile = item.device === "mobile";
            const isTablet = item.device === "tablet";

            return (
              <li key={`${item.path}-${item.time}-${i}`} className="stream-item">
                <div className="stream-device-icon">
                  {isMobile ? (
                    <Smartphone size={16} color="#10b981" />
                  ) : isTablet ? (
                    <Tablet size={16} color="#f59e0b" />
                  ) : (
                    <Laptop size={16} color="#3b82f6" />
                  )}
                </div>
                <div className="stream-content">
                  <div className="stream-item-row">
                    <span className="stream-category">{category}</span>
                    <span className="stream-time">{timeAgo(item.time)}</span>
                  </div>
                  <span className="stream-path-title" title={item.path}>
                    {title}
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

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/analytics/realtime", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setActiveCount(json.active_visitors || 0);
        }
      } catch {
        // silent
      }
    };
    fetchCount();
    const timer = setInterval(fetchCount, 25000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="live-online-pill">
      <span className="live-pulsing-dot" />
      <span>{activeCount !== null ? `${activeCount} Khách Đang Online` : "Đang kết nối..."}</span>
    </div>
  );
}
