import { ArrowUpRight, Boxes, Building2, Eye, FilePenLine, FolderTree, ImageIcon, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { getAdminOverview, getAdminProducts } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function AdminDashboardPage() {
  const [overview, products] = await Promise.all([getAdminOverview(), getAdminProducts()]);

  const cards = [
    { label: "Tổng sản phẩm", value: overview.products, icon: Boxes, color: "blue" },
    { label: "Đang hiển thị", value: overview.published, icon: Eye, color: "emerald" },
    { label: "Danh mục", value: overview.categories, icon: FolderTree, color: "purple" },
    { label: "Dự án hoàn thành", value: overview.projects, icon: Building2, color: "amber" },
    { label: "Ảnh đã tải", value: overview.media, icon: ImageIcon, color: "teal" },
  ];


  return (
    <>
      <header className="admin-page-header">
        <div>
          <span>Tổng quan</span>
          <h1>Bảng điều khiển CMS</h1>
          <p>Theo dõi nhanh hệ thống danh mục, sản phẩm và kho hình ảnh của website.</p>
        </div>
        <Link href="/admin/products/new" className="button button-primary">
          <Plus size={18} />
          <span>Thêm sản phẩm</span>
        </Link>
      </header>

      <section className="admin-stat-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article key={label}>
            <div className={`admin-stat-icon-wrap ${color}`}>
              <Icon strokeWidth={2} />
            </div>
            <span>{label}</span>
            <b>{value}</b>
          </article>
        ))}
      </section>

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
                <th>Ngày cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
                    <small>/{product.slug}</small>
                  </td>
                  <td>{product.category?.name || "—"}</td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status === "published"
                        ? "Hiển thị"
                        : product.status === "draft"
                        ? "Bản nháp"
                        : "Lưu trữ"}
                    </span>
                  </td>
                  <td>
                    {product.updated_at
                      ? new Date(product.updated_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Vừa cập nhật"}
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

