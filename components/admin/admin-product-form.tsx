import { AlertCircle, DollarSign, ImagePlus, Layers, Package, Save, Search, Sliders, Trash2, Upload } from "lucide-react";
import { saveProduct } from "@/lib/admin-actions";
import type { AdminCategoryRow, AdminProductRow } from "@/lib/admin-data";
import { publicAssetUrl } from "@/lib/supabase-rest";
import { deleteProductImage } from "@/lib/admin-actions";

export function AdminProductForm({
  product,
  categories,
  demo = false,
}: {
  product?: AdminProductRow | null;
  categories: AdminCategoryRow[];
  demo?: boolean;
}) {
  const specs = (product?.specs || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => `${item.spec_name}|${item.spec_value}`)
    .join("\n");

  return (
    <form action={saveProduct} className="admin-form">
      <input type="hidden" name="id" value={product?.id || ""} />
      <input type="hidden" name="has_images" value={product?.images?.length ? "yes" : "no"} />

      {/* Thông tin chính */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Thông tin cơ bản</span>
            <h2>Tên & Danh mục sản phẩm</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Tên sản phẩm *</span>
            <input
              name="name"
              required
              defaultValue={product?.name || ""}
              placeholder="VD: Cửa cuốn khe thoáng AluDoor Pro A50"
            />
          </label>

          <label>
            <span>Đường dẫn tĩnh (Slug) — Để trống sẽ tự tạo</span>
            <input
              name="slug"
              defaultValue={product?.slug || ""}
              placeholder="VD: cua-cuon-khe-thoang-aludoor-pro-a50"
            />
          </label>

          <div className="admin-grid-2">
            <label>
              <span>Danh mục *</span>
              <select name="category_id" defaultValue={product?.category_id || categories[0]?.id || ""} required>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Thời gian bảo hành</span>
              <input
                name="warranty"
                defaultValue={product?.warranty || "24 tháng"}
                placeholder="VD: 24 tháng hoặc 5 năm"
              />
            </label>
          </div>

          <label>
            <span>Mô tả ngắn (Hiển thị ngoài danh mục & thẻ sản phẩm)</span>
            <textarea
              name="short_description"
              rows={2}
              defaultValue={product?.short_description || ""}
              placeholder="VD: Nan nhôm hợp kim 6063-T5, sơn tĩnh điện ngoài trời, vận hành êm ái..."
            />
          </label>

          <label>
            <span>Mô tả chi tiết</span>
            <textarea
              name="description"
              rows={5}
              defaultValue={product?.description || ""}
              placeholder="Chi tiết cấu tạo nan cửa, động cơ tương thích, tính năng an toàn, tiêu chuẩn kỹ thuật..."
            />
          </label>
        </div>
      </section>

      {/* Giá & Thiết lập bán */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Giá cả & Phân loại</span>
            <h2>Thiết lập hiển thị giá</h2>
          </div>
        </div>

        <div className="admin-fields">
          <div className="admin-grid-3">
            <label>
              <span>Chế độ giá</span>
              <select name="price_mode" defaultValue={product?.price_mode || "exact"}>
                <option value="exact">Giá chính xác (VNĐ)</option>
                <option value="from">Giá từ (Từ ...đ)</option>
                <option value="contact">Liên hệ báo giá</option>
                <option value="hidden">Ẩn giá</option>
              </select>
            </label>

            <label>
              <span>Số tiền (nếu có)</span>
              <input
                type="number"
                name="price_amount"
                defaultValue={product?.price_amount ?? ""}
                placeholder="VD: 1850000"
              />
            </label>

            <label>
              <span>Chữ hiển thị thay thế (tùy chọn)</span>
              <input
                name="price_label"
                defaultValue={product?.price_label || ""}
                placeholder="VD: 1.850.000đ/m² hoặc Theo kích thước"
              />
            </label>
          </div>

          <div className="admin-grid-3">
            <label>
              <span>Trạng thái hiển thị</span>
              <select name="status" defaultValue={product?.status || "published"}>
                <option value="published">Công khai (Hiển thị ngay)</option>
                <option value="draft">Bản nháp (Ẩn)</option>
                <option value="archived">Lưu trữ (Ẩn)</option>
              </select>
            </label>

            <label>
              <span>Thứ tự sắp xếp</span>
              <input
                type="number"
                name="sort_order"
                defaultValue={product?.sort_order ?? 0}
                placeholder="0"
              />
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="is_featured"
                value="true"
                defaultChecked={Boolean(product?.is_featured)}
              />
              <span>Đánh dấu là Sản phẩm Nổi Bật (Featured)</span>
            </label>
          </div>
        </div>
      </section>

      {/* Thông số kỹ thuật */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Thông số kỹ thuật</span>
            <h2>Bảng thông số chi tiết (Mỗi dòng một cặp Tên|Giá trị)</h2>
          </div>
        </div>

        <div className="admin-fields">
          <textarea
            name="specs"
            rows={6}
            defaultValue={specs}
            placeholder={`Độ dày nan|1.2mm - 1.4mm\nVật liệu|Hợp kim nhôm 6063-T5\nSơn phủ|AkzoNobel cao cấp bảo hành 15 năm\nMàu sắc|Ghi sáng, Cà phê, Vàng kem\nTốc độ đóng mở|3 - 5 cm/s`}
          />
          <small style={{ color: "#64748b" }}>
            Định dạng: <code>Tên thông số|Giá trị</code> (Phân tách bởi dấu gạch đứng |). Ví dụ: <code>Độ dày nan|1.3mm</code>
          </small>
        </div>
      </section>

      {/* Hình ảnh */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Hình ảnh sản phẩm</span>
            <h2>Thư viện ảnh sản phẩm thực tế</h2>
          </div>
        </div>

        {product?.images && product.images.length > 0 ? (
          <div className="admin-images-grid">
            {product.images.map((image) => {
              const removeImage = deleteProductImage.bind(null, product.id, image.id, image.storage_path);
              return (
                <div className="admin-image-item" key={image.id}>
                  <img
                    src={publicAssetUrl(image.storage_path) || ""}
                    alt={image.alt_text || product.name}
                  />
                  <button type="submit" formAction={removeImage}>
                    <Trash2 size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
                    Xóa ảnh này
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}

        <label className="admin-upload">
          <Upload />
          <span>Bấm hoặc kéo thả ảnh để tải lên (tối đa 6 ảnh)</span>
          <input
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
          />
        </label>
      </section>

      {/* SEO */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Tối ưu SEO</span>
            <h2>Hiển thị trên kết quả tìm kiếm Google</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Tiêu đề SEO (SEO Title)</span>
            <input
              name="seo_title"
              maxLength={65}
              defaultValue={product?.seo_title || ""}
              placeholder="VD: Cửa Cuốn Khe Thoáng Austdoor Chính Hãng - Giá Tốt Nhất"
            />
          </label>

          <label>
            <span>Mô tả SEO (Meta Description)</span>
            <textarea
              name="seo_description"
              maxLength={170}
              rows={3}
              defaultValue={product?.seo_description || ""}
              placeholder="VD: Cung cấp và lắp đặt cửa cuốn khe thoáng Austdoor cao cấp, bảo hành 24 tháng, hỗ trợ kỹ thuật 24/7..."
            />
          </label>
        </div>
      </section>

      {/* Floating Save Action */}
      <div className="admin-sticky-save">
        <span>✓ Mọi thay đổi sẽ được cập nhật ngay trên catalog website.</span>
        <button className="button button-primary">
          <Save size={18} />
          <span>Lưu thông tin sản phẩm</span>
        </button>
      </div>
    </form>
  );
}

