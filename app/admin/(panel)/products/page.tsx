import { Boxes, CheckCircle2, Edit3, Plus, Star } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { deleteProduct } from "@/lib/admin-actions";
import { getAdminProducts } from "@/lib/admin-data";
import { isSupabaseConfigured, publicAssetUrl } from "@/lib/supabase-rest";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ deleted?: string; saved?: string }> }) {
  const [products, query] = await Promise.all([getAdminProducts(), searchParams]);
  const demo = !isSupabaseConfigured();

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa vĩnh viễn sản phẩm khỏi hệ thống.</span>
        </div>
      )}

      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Thông tin sản phẩm đã được lưu và cập nhật thành công lên website.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Quản lý Catalog</span>
          <h1>Danh sách Sản phẩm Cửa cuốn ({products.length})</h1>
          <p>Quản lý toàn bộ danh mục sản phẩm, bảng giá hiển thị, ảnh đại diện và thông số kỹ thuật.</p>
        </div>
        <Link href="/admin/products/new" className="button button-primary">
          <Plus size={18} />
          <span>Thêm sản phẩm mới</span>
        </Link>
      </header>

      <section className="admin-panel">
        {products.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá niêm yết</th>
                  <th>Trạng thái</th>
                  <th>Đặc biệt</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-item-cell">
                        {product.images?.[0] ? (
                          <img
                            src={publicAssetUrl(product.images[0].storage_path) || product.images[0].storage_path}
                            alt={product.name}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "1px solid var(--border)",
                            }}
                          />
                        ) : (
                          <div
                            className="admin-item-icon"
                            style={{
                              background: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe",
                            }}
                          >
                            <Boxes size={18} />
                          </div>
                        )}
                        <div className="admin-item-info">
                          <Link href={`/admin/products/${product.id}`} title="Chỉnh sửa sản phẩm">
                            {product.name}
                          </Link>
                          <small>/{product.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          background: "#f1f5f9",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        {product.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td>
                      <b style={{ color: "#0f172a", fontWeight: 600, fontSize: "14px" }}>
                        {product.price_label || (product.price_amount ? new Intl.NumberFormat("vi-VN").format(product.price_amount) + " VNĐ" : "Liên hệ báo giá")}
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
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#d97706", fontSize: 13, fontWeight: 600, background: "#fffbeb", padding: "2px 8px", borderRadius: "6px" }}>
                          <Star size={13} fill="#d97706" /> Nổi bật
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
        ) : (
          <div className="admin-empty">
            <Boxes size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", margin: "0 0 16px" }}>Chưa có sản phẩm nào trong hệ thống.</p>
            <Link href="/admin/products/new" className="button button-primary">
              <Plus size={16} /> Thêm sản phẩm đầu tiên
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
