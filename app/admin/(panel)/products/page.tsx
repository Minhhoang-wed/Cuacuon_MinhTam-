import { CheckCircle2, Edit3, Plus, Star } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { deleteProduct } from "@/lib/admin-actions";
import { getAdminProducts } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [products, query] = await Promise.all([getAdminProducts(), searchParams]);
  const demo = !isSupabaseConfigured();

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa vĩnh viễn sản phẩm và toàn bộ hình ảnh liên quan.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Quản lý Catalog</span>
          <h1>Sản phẩm ({products.length})</h1>
          <p>Quản lý toàn bộ danh mục sản phẩm, bảng giá hiển thị, ảnh thực tế và thông số kỹ thuật.</p>
        </div>
        <Link href="/admin/products/new" className="button button-primary">
          <Plus size={18} />
          <span>Thêm sản phẩm mới</span>
        </Link>
      </header>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table product-admin-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá niêm yết</th>
                <th>Trạng thái</th>
                <th>Nổi bật</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
                    <small>/{product.slug}</small>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{product.category?.name || "Chưa phân loại"}</span>
                  </td>
                  <td>
                    <b style={{ color: "#0f172a", fontWeight: 600 }}>
                      {product.price_label || (product.price_amount ? new Intl.NumberFormat("vi-VN").format(product.price_amount) + "đ" : "Liên hệ")}
                    </b>
                  </td>
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
                    {product.is_featured ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#d97706", fontSize: 13, fontWeight: 600 }}>
                        <Star size={14} fill="#d97706" /> Nổi bật
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/products/${product.id}`} aria-label={`Sửa ${product.name}`} title="Chỉnh sửa sản phẩm">
                        <Edit3 size={16} />
                      </Link>
                      <form action={deleteProduct} style={{ margin: 0 }}>
                        <input type="hidden" name="id" value={product.id} />
                        <DeleteProductButton productName={product.name} />
                      </form>
                    </div>
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

