"use client";

import { useState } from "react";
import { Search, Wrench, Package, Newspaper, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ContentRow {
  content_type: string;
  content_id: string;
  content_title: string | null;
  stat_date: string;
  views: number;
  unique_views: number;
  clicks: number;
  avg_duration: number;
  avg_scroll: number;
}

interface Props {
  initialData: ContentRow[];
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  product: { label: "Sản phẩm", icon: <Package size={13} />, color: "badge-blue" },
  service: { label: "Dịch vụ", icon: <Wrench size={13} />, color: "badge-emerald" },
  article: { label: "Cẩm nang", icon: <Newspaper size={13} />, color: "badge-purple" },
};

export function AnalyticsContentTable({ initialData }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Aggregate by content_id (sum across dates)
  const aggregated = new Map<string, ContentRow & { total_views: number; total_unique: number; total_clicks: number }>();
  for (const row of initialData) {
    const key = `${row.content_type}:${row.content_id}`;
    const existing = aggregated.get(key);
    if (existing) {
      existing.total_views += row.views;
      existing.total_unique += row.unique_views;
      existing.total_clicks += row.clicks;
    } else {
      aggregated.set(key, {
        ...row,
        total_views: row.views,
        total_unique: row.unique_views,
        total_clicks: row.clicks,
      });
    }
  }

  const rowsData = [...aggregated.values()];

  let filtered = rowsData;
  if (filter !== "all") {
    filtered = filtered.filter((r) => r.content_type === filter);
  }
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter((r) => (r.content_title || r.content_id).toLowerCase().includes(q));
  }

  filtered.sort((a, b) => b.total_views - a.total_views);
  const maxViews = Math.max(...filtered.map((r) => r.total_views), 1);

  return (
    <div className="analytics-content-panel">
      <div className="content-panel-header">
        <div className="content-header-title">
          <h4>Top Dịch Vụ & Sản Phẩm Được Xem Nhiều Nhất</h4>
          <p>Xếp hạng mức độ quan tâm của khách hàng theo từng danh mục</p>
        </div>

        <div className="content-panel-controls">
          <div className="content-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="content-filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`filter-tab ${filter === "service" ? "active" : ""}`}
              onClick={() => setFilter("service")}
            >
              Dịch vụ
            </button>
            <button
              className={`filter-tab ${filter === "product" ? "active" : ""}`}
              onClick={() => setFilter("product")}
            >
              Sản phẩm
            </button>
            <button
              className={`filter-tab ${filter === "article" ? "active" : ""}`}
              onClick={() => setFilter("article")}
            >
              Cẩm nang
            </button>
          </div>
        </div>
      </div>

      <div className="content-table-wrapper">
        <table className="analytics-luxury-table">
          <thead>
            <tr>
              <th style={{ width: "48px" }}>#</th>
              <th>Tên dịch vụ / Sản phẩm</th>
              <th style={{ width: "130px" }}>Phân loại</th>
              <th style={{ width: "130px", textAlign: "right" }}>Lượt xem</th>
              <th style={{ width: "140px", textAlign: "right" }}>Click Liên Hệ</th>
              <th style={{ width: "120px" }}>Độ phổ biến</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: "13px" }}>
                  Chưa có dữ liệu truy cập nào được ghi nhận. Hệ thống sẽ tự động cập nhật khi có khách truy cập website.
                </td>
              </tr>
            ) : (
              filtered.slice(0, 10).map((row, idx) => {
                const cfg = TYPE_CONFIG[row.content_type] || { label: "Nội dung", icon: null, color: "badge-gray" };
                const targetUrl = row.content_type === "service"
                  ? `/dich-vu/${row.content_id}`
                  : row.content_type === "product"
                  ? `/san-pham/${row.content_id}`
                  : `/meo-kien-thuc/${row.content_id}`;
                const pct = Math.round((row.total_views / maxViews) * 100);

                return (
                  <tr key={`${row.content_type}:${row.content_id}`}>
                    <td>
                      <span className={`rank-pill ${idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "bronze" : ""}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td>
                      <div className="content-name-cell">
                        <Link href={targetUrl} target="_blank" className="content-link">
                          <span>{row.content_title || row.content_id}</span>
                          <ArrowUpRight size={13} className="ext-icon" />
                        </Link>
                      </div>
                    </td>
                    <td>
                      <span className={`type-tag ${cfg.color}`}>
                        {cfg.icon}
                        <span>{cfg.label}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="num-box">
                        <b>{row.total_views.toLocaleString("vi-VN")}</b>
                        <small>{row.total_unique} khách</small>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="cta-count-pill">
                        {row.total_clicks > 0 ? `${row.total_clicks} cuộc gọi` : "0"}
                      </span>
                    </td>
                    <td>
                      <div className="popularity-bar-wrap">
                        <div className="popularity-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
