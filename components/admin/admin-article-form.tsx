import { ImagePlus, Newspaper, Save } from "lucide-react";
import { saveArticle } from "@/lib/admin-actions";
import type { AdminArticleRow } from "@/lib/admin-data";
import { ArticleImageManager } from "@/components/admin/article-image-manager";

const defaultCategories = [
  "Cẩm nang sử dụng",
  "Kinh nghiệm bảo trì",
  "Tư vấn chọn mua",
  "Tin tức kỹ thuật",
  "Khuyến mãi & Ưu đãi",
];

export function AdminArticleForm({ article }: { article?: AdminArticleRow | null }) {
  const defaultContent = Array.isArray(article?.content) ? article.content.join("\n\n") : "";

  return (
    <form action={saveArticle} className="admin-form">
      <input type="hidden" name="id" value={article?.id || ""} />

      {/* Nội dung bài viết */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Soạn thảo bài viết</span>
            <h2>Nội dung & Danh mục bài viết</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Tiêu đề bài viết *</span>
            <input
              name="title"
              required
              defaultValue={article?.title || ""}
              placeholder="VD: Hướng dẫn xử lý an toàn khi cửa cuốn bị kẹt nan giữa chừng"
            />
          </label>

          <label>
            <span>Đường dẫn tĩnh (Slug) — Để trống sẽ tự tạo</span>
            <input
              name="slug"
              defaultValue={article?.slug || ""}
              placeholder="VD: huong-dan-xu-ly-an-toan-khi-cua-cuon-bi-ket-nan"
            />
          </label>

          <div className="admin-fields three">
            <label>
              <span>Chuyên mục *</span>
              <input
                name="category"
                list="article-categories"
                required
                defaultValue={article?.category || "Cẩm nang sử dụng"}
                placeholder="Chọn hoặc nhập chuyên mục..."
              />
              <datalist id="article-categories">
                {defaultCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>

            <label>
              <span>Thời gian đọc dự kiến</span>
              <input
                name="read_time"
                defaultValue={article?.read_time || "3 phút"}
                placeholder="VD: 3 phút"
              />
            </label>

            <label>
              <span>Tác giả</span>
              <input
                name="author"
                defaultValue={article?.author || "Kỹ Thuật Viên An Tâm"}
                placeholder="VD: Kỹ Thuật Viên An Tâm"
              />
            </label>
          </div>

          <label>
            <span>Đoạn tóm tắt (Excerpt) *</span>
            <textarea
              name="excerpt"
              required
              rows={3}
              defaultValue={article?.excerpt || ""}
              placeholder="Đoạn văn ngắn xuất hiện ở trang danh sách tin tức và chia sẻ trên mạng xã hội..."
            />
          </label>

          <label>
            <span>Nội dung chi tiết (Phân tách các đoạn bằng 2 lần xuống dòng) *</span>
            <textarea
              name="content"
              required
              rows={12}
              defaultValue={defaultContent}
              placeholder={`Đoạn văn thứ nhất...\n\nĐoạn văn thứ hai...\n\nĐoạn văn thứ ba...`}
            />
          </label>
        </div>
      </section>

      {/* Cấu hình xuất bản & Ảnh bìa */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Xuất bản & Ảnh bìa</span>
            <h2>Ảnh bài viết & Trạng thái</h2>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <ArticleImageManager
            initialImageUrl={article?.image_url}
            articleTitle={article?.title}
          />
        </div>

        <div className="admin-fields three" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
          <label>
            <span>Trạng thái xuất bản *</span>
            <select name="status" defaultValue={article?.status || "published"}>
              <option value="published">Đã xuất bản (Công khai)</option>
              <option value="draft">Bản nháp (Ẩn)</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </label>

          <label>
            <span>Thứ tự ưu tiên</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={article?.sort_order ?? 0}
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "28px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={article?.is_featured || false}
              />
              <span style={{ fontWeight: 600, color: "#1e293b" }}>Ghim bài viết nổi bật</span>
            </label>
          </div>
        </div>
      </section>

      <div className="admin-form-submit">
        <button type="submit" className="button button-primary">
          <Save size={18} />
          <span>{article ? "Lưu bài viết" : "Đăng bài viết mới"}</span>
        </button>
      </div>
    </form>
  );
}
