import { CheckCircle2, FolderPlus, FolderTree, Plus, Save, Trash2 } from "lucide-react";
import { deleteCategory, saveCategory } from "@/lib/admin-actions";
import { getAdminCategories } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const categories = await getAdminCategories();
  const demo = !isSupabaseConfigured();
  const saved = (await searchParams).saved;

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã lưu và cập nhật danh mục sản phẩm thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <h1>Danh mục sản phẩm ({categories.length})</h1>
          <p>Phân loại các dòng cửa cuốn thành các nhóm rõ ràng giúp khách hàng dễ tìm kiếm.</p>
        </div>
      </header>

      <div className="admin-two-column">
        {/* Danh sách danh mục */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Danh sách {categories.length} nhóm sản phẩm</h2>
            </div>
          </div>

          <div className="category-admin-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {categories.map((category) => (
              <article
                key={category.id}
                style={{
                  padding: "18px 20px",
                  border: "1px solid var(--adm-border)",
                  borderRadius: "12px",
                  background: "var(--adm-surface)",
                  boxShadow: "var(--adm-shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <form id={`cat-form-${category.id}`} action={saveCategory} className="category-edit-form">
                  <input type="hidden" name="id" value={category.id} />
                  <div className="admin-fields two">
                    <label>
                      <span>Tên danh mục *</span>
                      <input name="name" defaultValue={category.name} required />
                    </label>

                    <label>
                      <span>Slug</span>
                      <input name="slug" defaultValue={category.slug} />
                    </label>

                    <label className="full">
                      <span>Mô tả ngắn</span>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={category.description || ""}
                        placeholder="Mô tả đặc điểm nổi bật của nhóm sản phẩm này..."
                      />
                    </label>

                    <label>
                      <span>Thứ tự hiển thị</span>
                      <input name="sort_order" type="number" defaultValue={category.sort_order} />
                    </label>

                    <label className="check-field">
                      <input name="is_active" type="checkbox" defaultChecked={category.is_active} />
                      <span>Đang kích hoạt hiển thị</span>
                    </label>
                  </div>
                </form>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <button
                    form={`cat-form-${category.id}`}
                    type="submit"
                    className="button button-dark"
                    disabled={demo}
                  >
                    <Save size={14} />
                    <span>Lưu thay đổi</span>
                  </button>

                  <form action={deleteCategory} className="category-delete-form" style={{ margin: 0 }}>
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      disabled={demo}
                      title={demo ? "Khóa ở chế độ xem trước" : "Xóa danh mục (chỉ xóa được danh mục trống)"}
                      aria-label={`Xóa danh mục ${category.name}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "31px",
                        height: "31px",
                        borderRadius: "6px",
                        border: "1px solid #fca5a5",
                        background: "#fef2f2",
                        color: "#dc2626",
                        cursor: demo ? "not-allowed" : "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Thêm mới danh mục */}
        <aside className="admin-form-card sticky-card">
          <FolderPlus size={26} />
          <h2>Thêm danh mục mới</h2>

          <form action={saveCategory}>
            <div className="admin-fields">
              <label>
                <span>Tên danh mục *</span>
                <input name="name" required placeholder="VD: Cửa Cuốn Siêu Thoáng" />
              </label>

              <label>
                <span>Slug</span>
                <input name="slug" placeholder="Tự tạo nếu để trống" />
              </label>

              <label>
                <span>Mô tả</span>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Giới thiệu về dòng cửa cuốn này..."
                />
              </label>

              <label>
                <span>Thứ tự hiển thị</span>
                <input name="sort_order" type="number" defaultValue={categories.length + 1} />
              </label>

              <label className="check-field">
                <input name="is_active" type="checkbox" defaultChecked />
                <span>Hiển thị ngay trên website</span>
              </label>
            </div>

            <button className="button button-primary" style={{ width: "100%", marginTop: 14 }} disabled={demo}>
              <Plus size={14} />
              <span>Thêm danh mục</span>
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}

