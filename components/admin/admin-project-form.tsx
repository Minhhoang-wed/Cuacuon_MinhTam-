import { Building2, CheckCircle2, ImagePlus, MapPin, Save, Trash2, Upload } from "lucide-react";
import { deleteProjectImage, saveProject } from "@/lib/admin-actions";
import type { AdminProjectRow } from "@/lib/admin-data";
import { publicAssetUrl } from "@/lib/supabase-rest";

const defaultCategories = [
  "Nhà phố hiện đại",
  "Biệt thự sang trọng",
  "Showroom & Cửa hàng",
  "Gara & Nhà xe gia đình",
  "Nhà liền kề & Shophouse",
  "Nhà xưởng & Kho bãi",
];

export function AdminProjectForm({
  project,
}: {
  project?: AdminProjectRow | null;
}) {
  return (
    <form action={saveProject} className="admin-form">
      <input type="hidden" name="id" value={project?.id || ""} />
      <input type="hidden" name="has_images" value={project?.images?.length ? "yes" : "no"} />

      {/* Thông tin chính */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Thông tin công trình</span>
            <h2>Tên & Vị trí dự án</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Tên công trình / dự án *</span>
            <input
              name="name"
              required
              defaultValue={project?.name || ""}
              placeholder="VD: Thi công cửa cuốn khe thoáng Biệt thự Thảo Điền"
            />
          </label>

          <label>
            <span>Đường dẫn tĩnh (Slug) — Để trống sẽ tự tạo</span>
            <input
              name="slug"
              defaultValue={project?.slug || ""}
              placeholder="VD: thi-cong-cua-cuon-khe-thoang-biet-thu-thao-dien"
            />
          </label>

          <div className="admin-grid-2">
            <label>
              <span>Loại công trình *</span>
              <input
                name="category"
                list="project-categories"
                required
                defaultValue={project?.category || "Biệt thự sang trọng"}
                placeholder="VD: Biệt thự sang trọng"
              />
              <datalist id="project-categories">
                {defaultCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>

            <label>
              <span>Địa điểm thi công *</span>
              <input
                name="location"
                required
                defaultValue={project?.location || "Quận 2, TP.HCM"}
                placeholder="VD: Thảo Điền, TP. Thủ Đức, TP.HCM"
              />
            </label>
          </div>

          <label>
            <span>Tóm tắt giải pháp & quy mô (Hiển thị ngoài danh mục) *</span>
            <textarea
              name="summary"
              required
              rows={3}
              defaultValue={project?.summary || ""}
              placeholder="VD: Lắp đặt 2 bộ cửa cuốn khe thoáng nhôm hợp kim chống ồn, tích hợp cảm biến chống xô và bộ điều khiển qua điện thoại cho biệt thự sân vườn..."
            />
          </label>

          <label>
            <span>Kết quả nghiệm thu & Bàn giao</span>
            <input
              name="result"
              defaultValue={project?.result || "Bàn giao đúng tiến độ 100%, vận hành êm ái, bảo hành chính hãng 24 tháng."}
              placeholder="VD: Hoàn thành đúng tiến độ cam kết, vận hành êm ái..."
            />
          </label>

          <label>
            <span>Mô tả chi tiết quá trình thi công (Tùy chọn)</span>
            <textarea
              name="description"
              rows={6}
              defaultValue={project?.description || ""}
              placeholder="Mô tả chi tiết về hiện trạng công trình, khó khăn kỹ thuật và giải pháp xử lý, phản hồi của chủ nhà..."
            />
          </label>
        </div>
      </section>

      {/* Thiết lập hiển thị */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Hiển thị & Sắp xếp</span>
            <h2>Trạng thái công bố dự án</h2>
          </div>
        </div>

        <div className="admin-fields">
          <div className="admin-grid-3">
            <label>
              <span>Trạng thái</span>
              <select name="status" defaultValue={project?.status || "published"}>
                <option value="published">Công khai (Hiển thị ngay)</option>
                <option value="draft">Bản nháp (Ẩn)</option>
                <option value="archived">Lưu trữ (Ẩn)</option>
              </select>
            </label>

            <label>
              <span>Thứ tự ưu tiên</span>
              <input
                type="number"
                name="sort_order"
                defaultValue={project?.sort_order ?? 0}
                placeholder="0"
              />
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="is_featured"
                value="true"
                defaultChecked={Boolean(project?.is_featured)}
              />
              <span>Đưa lên mục Dự Án Nổi Bật trên Trang chủ</span>
            </label>
          </div>
        </div>
      </section>

      {/* Thư viện hình ảnh */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Hình ảnh thực tế</span>
            <h2>Ảnh chụp công trình sau khi hoàn thiện</h2>
          </div>
        </div>

        {project?.images && project.images.length > 0 ? (
          <div className="admin-images-grid">
            {project.images.map((image) => {
              const removeImage = deleteProjectImage.bind(null, project.id, image.id, image.storage_path);
              return (
                <div className="admin-image-item" key={image.id}>
                  <img
                    src={publicAssetUrl(image.storage_path) || ""}
                    alt={image.alt_text || project.name}
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
          <span>Bấm hoặc kéo thả ảnh chụp thực tế công trình (tối đa 6 ảnh)</span>
          <input
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
          />
        </label>
      </section>

      {/* Floating Save Action */}
      <div className="admin-sticky-save">
        <span>✓ Dự án sau khi lưu sẽ xuất hiện trực tiếp trên trang Dự Án & Trang Chủ.</span>
        <button className="button button-primary">
          <Save size={18} />
          <span>Lưu thông tin dự án</span>
        </button>
      </div>
    </form>
  );
}
