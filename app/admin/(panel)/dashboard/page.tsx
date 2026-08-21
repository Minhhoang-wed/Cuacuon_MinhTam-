import {
  ArrowUpRight,
  Boxes,
  Building2,
  Clock3,
  ExternalLink,
  FolderTree,
  ImageIcon,
  MapPin,
  Newspaper,
  Plus,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { getAdminOverview, getAdminProducts, getAdminServices } from "@/lib/admin-data";
import { publicAssetUrl } from "@/lib/supabase-rest";

export default async function AdminDashboardPage() {
  const [overview, products, services] = await Promise.all([
    getAdminOverview(),
    getAdminProducts(),
    getAdminServices(),
  ]);

  const statCards = [
    {
      label: "Dịch vụ kỹ thuật",
      value: overview.services || 6,
      sub: "Bảng giá & Cứu hộ 24/7",
      icon: Wrench,
      color: "emerald",
      href: "/admin/services",
    },
    {
      label: "Sản phẩm cửa cuốn",
      value: overview.products || 0,
      sub: `${overview.published || 0} đang hiển thị`,
      icon: Boxes,
      color: "blue",
      href: "/admin/products",
    },
    {
      label: "Danh mục sản phẩm",
      value: overview.categories || 0,
      sub: "Phân loại cửa cuốn",
      icon: FolderTree,
      color: "rose",
      href: "/admin/categories",
    },
    {
      label: "Mạng lưới phục vụ",
      value: `${overview.branches || 2} CH / ${overview.districts || 23} Quận`,
      sub: "Phủ sóng toàn TP.HCM",
      icon: MapPin,
      color: "purple",
      href: "/admin/service-areas",
    },
    {
      label: "Mẹo & Cẩm nang",
      value: overview.articles || 0,
      sub: "Bài viết kỹ thuật",
      icon: Newspaper,
      color: "teal",
      href: "/admin/articles",
    },
    {
      label: "Dự án thi công",
      value: overview.projects || 0,
      sub: "Công trình thực tế",
      icon: Building2,
      color: "amber",
      href: "/admin/projects",
    },
  ];

  // Dynamic greeting based on Vietnam time (UTC+7)
  const nowVN = new Date(Date.now() + 7 * 3600 * 1000);
  const hour = nowVN.getUTCHours();
  const greeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  const greetingEmoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";

  const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const weekday = weekdays[nowVN.getUTCDay()];
  const dateStr = `${weekday}, ${nowVN.getUTCDate().toString().padStart(2, "0")}/${(nowVN.getUTCMonth() + 1).toString().padStart(2, "0")}/${nowVN.getUTCFullYear()}`;

  return (
    <>
      {/* ── Greeting Banner ── */}
      <div className="admin-greeting-banner">
        <div className="admin-greeting-text">
          <h2>{greeting}, Minh Hoàng!</h2>
          <p>Hệ thống CMS Minh Tâm Door đang hoạt động tốt · Hôm nay {dateStr}</p>
        </div>
        <div className="admin-greeting-meta">
          <span className="admin-greeting-pill gold">
            <ShieldCheck size={14} /> Quản trị viên
          </span>
        </div>
      </div>

      {/* ── Top Action Bar ── */}
      <header className="admin-page-header" style={{ marginBottom: 22 }}>
        <div>
          <h1>Tổng quan hệ thống</h1>
          <p>Quản lý dịch vụ, bảng giá, sản phẩm và nội dung website của bạn.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/admin/services/new" className="button button-primary button-small">
            <Plus size={15} />
            <span>Thêm dịch vụ</span>
          </Link>
          <Link href="/" target="_blank" className="button button-ghost button-small">
            <ExternalLink size={15} />
            <span>Xem website</span>
          </Link>
        </div>
      </header>

      {/* 1. Quick Actions Strip */}
      <section className="admin-quick-actions">
        <div className="admin-quick-actions-buttons">
          <Link href="/admin/services/new" className="button button-ghost button-small">
            <Plus size={14} /> Thêm Dịch vụ
          </Link>
          <Link href="/admin/products/new" className="button button-ghost button-small">
            <Plus size={14} /> Thêm Sản phẩm
          </Link>
          <Link href="/admin/articles/new" className="button button-ghost button-small">
            <Plus size={14} /> Viết Cẩm nang
          </Link>
          <Link href="/admin/service-areas" className="button button-ghost button-small">
            <MapPin size={14} /> Quản lý Điểm trực
          </Link>
          <Link href="/admin/media" className="button button-ghost button-small">
            <ImageIcon size={14} /> Tải ảnh lên
          </Link>
        </div>
      </section>

      {/* 2. Stat Cards Grid */}
      <section className="admin-stat-grid">
        {statCards.map(({ label, value, sub, icon: Icon, color, href }) => (
          <Link href={href} key={label} className="admin-stat-card">
            <div className="admin-stat-card-header">
              <div className={`admin-stat-icon-wrap ${color}`}>
                <Icon strokeWidth={2} />
              </div>
              <ArrowUpRight size={16} color="#94a3b8" />
            </div>
            <span>{label}</span>
            <b>{value}</b>
            <small style={{ color: "#64748b", marginTop: "4px", fontSize: "12px" }}>{sub}</small>
          </Link>
        ))}
      </section>

      {/* 3. Two-Column Activity Feeds */}
      <div className="admin-two-column" style={{ gridTemplateColumns: "1fr 1fr", gap: "18px", alignItems: "stretch" }}>
        {/* Cột 1: Dịch vụ sửa chữa & Báo giá */}
        <section className="admin-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="admin-panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Dịch vụ sửa chữa ({services.length})</h2>
            </div>
            <Link href="/admin/services">
              <span>Quản lý & Bảng giá</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  height: "62px",
                  borderRadius: "10px",
                  border: "1px solid #f1f5f9",
                  background: "#ffffff",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "#ecfdf5",
                        color: "#059669",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Wrench size={16} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/services/${service.id}`}
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#0f172a",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {service.name}
                    </Link>
                    <small style={{ color: "#059669", fontSize: "11.5px", fontWeight: 600 }}>
                      {service.price}
                    </small>
                  </div>
                </div>

                <span style={{ fontSize: "11.5px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap", flexShrink: 0 }}>
                  <ShieldCheck size={13} color="#059669" /> {service.warranty}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Cột 2: Sản phẩm cửa cuốn mới nhất */}
        <section className="admin-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="admin-panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Sản phẩm nổi bật ({products.length})</h2>
            </div>
            <Link href="/admin/products">
              <span>Xem tất cả</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            {products.slice(0, 4).map((product) => (
                <div
                key={product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  height: "62px",
                  borderRadius: "10px",
                  border: "1px solid #f1f5f9",
                  background: "#ffffff",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  {product.images?.[0] ? (
                    <img
                      src={publicAssetUrl(product.images[0].storage_path) || product.images[0].storage_path}
                      alt={product.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "#eff6ff",
                        color: "#2563eb",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Boxes size={16} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/products/${product.id}`}
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#0f172a",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </Link>
                    <small style={{ color: "#64748b", fontSize: "11.5px" }}>
                      {product.category?.name || "Cửa cuốn"}
                    </small>
                  </div>
                </div>

                <span className={`status-badge ${product.status}`} style={{ fontSize: "11px", padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {product.status === "published" ? "Hiển thị" : "Bản nháp"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
