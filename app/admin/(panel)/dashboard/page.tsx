import { ArrowUpRight, Boxes, Building2, Eye, FolderTree, ImageIcon, Newspaper, PhoneCall, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { getAdminOverview, getAdminProducts, getAdminServiceRequests } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const [overview, products, requests] = await Promise.all([
    getAdminOverview(),
    getAdminProducts(),
    getAdminServiceRequests(),
  ]);

  const cards = [
    { label: "Yêu cầu mới", value: overview.newRequests, icon: PhoneCall, color: overview.newRequests > 0 ? "rose" : "blue", href: "/admin/requests?status=new" },
    { label: "Tổng sản phẩm", value: overview.products, icon: Boxes, color: "blue", href: "/admin/products" },
    { label: "Danh mục", value: overview.categories, icon: FolderTree, color: "purple", href: "/admin/categories" },
    { label: "Dịch vụ sửa chữa", value: overview.services, icon: Wrench, color: "emerald", href: "/admin/services" },
    { label: "Dự án đã làm", value: overview.projects, icon: Building2, color: "amber", href: "/admin/projects" },
    { label: "Bài viết / Tin tức", value: overview.articles, icon: Newspaper, color: "indigo", href: "/admin/articles" },
    { label: "Ảnh media", value: overview.media, icon: ImageIcon, color: "teal", href: "/admin/media" },
  ];

  return (
    <>
      <header className="admin-page-header">
        <div>
          <span>Tổng quan hệ thống</span>
          <h1>Bảng điều khiển CMS Toàn diện</h1>
          <p>Theo dõi nhanh sản phẩm, danh mục, dịch vụ, dự án, tin tức và yêu cầu khách hàng.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/admin/products/new" className="button button-primary button-small">
            <Plus size={16} />
            <span>Thêm sản phẩm</span>
          </Link>
          <Link href="/admin/services/new" className="button button-ghost button-small">
            <Plus size={16} />
            <span>Thêm dịch vụ</span>
          </Link>
          <Link href="/admin/articles/new" className="button button-ghost button-small">
            <Plus size={16} />
            <span>Viết tin tức</span>
          </Link>
        </div>
      </header>

      {/* Grid thống kê */}
      <section className="admin-stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <Link href={href} key={label} style={{ textDecoration: "none", color: "inherit" }}>
            <article style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer" }}>
              <div className={`admin-stat-icon-wrap ${color}`}>
                <Icon strokeWidth={2} />
              </div>
              <span>{label}</span>
              <b>{value}</b>
            </article>
          </Link>
        ))}
      </section>

      {/* 2 Bảng song song: Yêu cầu khách hàng mới & Sản phẩm gần đây */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* Yêu cầu mới nhất */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>CRM Leads</span>
              <h2>Yêu cầu khách hàng gần đây</h2>
            </div>
            <Link href="/admin/requests">
              <span>Xem tất cả ({requests.length})</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id}>
                    <td>
                      <Link href={`/admin/requests/${req.id}`} style={{ fontWeight: 700 }}>
                        {req.name}
                      </Link>
                      <small style={{ display: "block", color: "#64748b" }}>{req.address}</small>
                    </td>
                    <td>
                      <a href={`tel:${req.phone.replace(/\D/g, "")}`} style={{ color: "#10b981", fontWeight: 600 }}>
                        {req.phone}
                      </a>
                    </td>
                    <td>
                      <span className={`status-badge ${req.status === "new" ? "live" : "secondary"}`}>
                        {req.status === "new" ? "Mới" : req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "#94a3b8", padding: "24px" }}>
                      Chưa có đơn yêu cầu nào gửi về.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sản phẩm cập nhật gần đây */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>Catalog</span>
              <h2>Sản phẩm cập nhật gần đây</h2>
            </div>
            <Link href="/admin/products">
              <span>Xem tất cả ({products.length})</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link href={`/admin/products/${product.id}`} style={{ fontWeight: 600 }}>
                        {product.name}
                      </Link>
                      <small style={{ display: "block", color: "#64748b" }}>/{product.slug}</small>
                    </td>
                    <td>{product.category?.name || "—"}</td>
                    <td>
                      <span className={`status-badge ${product.status}`}>
                        {product.status === "published" ? "Hiển thị" : "Bản nháp"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
