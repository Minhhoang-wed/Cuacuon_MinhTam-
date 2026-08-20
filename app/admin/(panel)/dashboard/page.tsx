import { ArrowUpRight, Boxes, Building2, Eye, FolderTree, Home, ImageIcon, Newspaper, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { getAdminOverview, getAdminProducts } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const [overview, products] = await Promise.all([
    getAdminOverview(),
    getAdminProducts(),
  ]);

  const cards = [
    { label: "Dịch vụ sửa chữa", value: overview.services, icon: Wrench, color: "emerald", href: "/admin/services" },
    { label: "Tổng sản phẩm", value: overview.products, icon: Boxes, color: "blue", href: "/admin/products" },
    { label: "Danh mục", value: overview.categories, icon: FolderTree, color: "purple", href: "/admin/categories" },
    { label: "Mẹo & Cẩm nang", value: overview.articles, icon: Newspaper, color: "indigo", href: "/admin/articles" },
    { label: "Dự án đã làm", value: overview.projects, icon: Building2, color: "amber", href: "/admin/projects" },
    { label: "Ảnh media", value: overview.media, icon: ImageIcon, color: "teal", href: "/admin/media" },
  ];

  return (
    <>
      <header className="admin-page-header">
        <div>
          <span>Tổng quan hệ thống</span>
          <h1>Bảng điều khiển CMS Minh Tâm Door</h1>
          <p>Theo dõi và quản lý nhanh nội dung Trang chủ, Dịch vụ, Sản phẩm, Tin tức và Dự án.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link href="/admin/services/new" className="button button-primary button-small">
            <Plus size={16} />
            <span>Thêm dịch vụ</span>
          </Link>
          <Link href="/admin/products/new" className="button button-ghost button-small">
            <Plus size={16} />
            <span>Thêm sản phẩm</span>
          </Link>
          <Link href="/admin/articles/new" className="button button-ghost button-small">
            <Plus size={16} />
            <span>Viết cẩm nang</span>
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

      {/* Sản phẩm cập nhật gần đây */}
      <section className="admin-panel" style={{ marginTop: "24px" }}>
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
              {products.slice(0, 8).map((product) => (
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
    </>
  );
}
