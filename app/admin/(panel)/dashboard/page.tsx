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
      value: `${overview.branches || 2} Cửa hàng / ${overview.districts || 23} Quận`,
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

  return (
    <>
      {/* Top Header */}
      <header className="admin-page-header">
        <div>
          <span>
            <Sparkles size={14} /> Trung tâm điều khiển
          </span>
          <h1>Hệ thống Quản trị CMS Minh Tâm Door</h1>
          <p>
            Chào mừng bạn trở lại! Quản lý thông tin dịch vụ, bảng giá, sản phẩm và nội dung website.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/admin/services/new" className="button button-primary button-small">
            <Plus size={15} />
            <span>Thêm dịch vụ</span>
          </Link>
          <Link href="/" target="_blank" className="button button-ghost button-small">
            <ExternalLink size={15} />
            <span>Xem website ngoài</span>
          </Link>
        </div>
      </header>

      {/* 1. Quick Actions Strip */}
      <section className="admin-quick-actions">
        <div className="admin-quick-actions-title">
          <Sparkles size={16} color="#2563eb" />
          <span>Thao tác nhanh:</span>
        </div>
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
      <div className="admin-two-column" style={{ gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Cột 1: Dịch vụ sửa chữa & Báo giá */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>Kỹ thuật chuyên sâu</span>
              <h2>Dịch vụ sửa chữa ({services.length})</h2>
            </div>
            <Link href="/admin/services">
              <span>Quản lý & Bảng giá</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #f1f5f9",
                  background: "#ffffff",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: "#ecfdf5",
                        color: "#059669",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Wrench size={18} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/services/${service.id}`}
                      style={{
                        fontSize: "13.5px",
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
                    <small style={{ color: "#059669", fontSize: "12px", fontWeight: 600 }}>
                      {service.price}
                    </small>
                  </div>
                </div>

                <span style={{ fontSize: "12px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={13} color="#059669" /> {service.warranty}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Cột 2: Sản phẩm cửa cuốn mới nhất */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>Catalog cửa cuốn</span>
              <h2>Sản phẩm nổi bật ({products.length})</h2>
            </div>
            <Link href="/admin/products">
              <span>Xem tất cả</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #f1f5f9",
                  background: "#ffffff",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  {product.images?.[0] ? (
                    <img
                      src={publicAssetUrl(product.images[0].storage_path) || product.images[0].storage_path}
                      alt={product.name}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: "#eff6ff",
                        color: "#2563eb",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Boxes size={18} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/products/${product.id}`}
                      style={{
                        fontSize: "13.5px",
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
                    <small style={{ color: "#64748b", fontSize: "12px" }}>
                      {product.category?.name || "Cửa cuốn"}
                    </small>
                  </div>
                </div>

                <span className={`status-badge ${product.status}`}>
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
