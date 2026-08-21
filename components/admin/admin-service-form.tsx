import { CheckCircle2, Clock3, Save, ShieldCheck, Wrench } from "lucide-react";
import { saveService } from "@/lib/admin-actions";
import type { AdminServiceRow } from "@/lib/admin-data";

export function AdminServiceForm({ service }: { service?: AdminServiceRow | null }) {
  const defaultSymptoms = Array.isArray(service?.symptoms) ? service.symptoms.join("\n") : "";
  const defaultProcess = Array.isArray(service?.process) ? service.process.join("\n") : "";

  return (
    <form action={saveService} className="admin-form">
      <input type="hidden" name="id" value={service?.id || ""} />

      {/* Thông tin chính */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Dịch vụ kỹ thuật</span>
            <h2>Thông tin dịch vụ & Báo giá</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Tên dịch vụ *</span>
            <input
              name="name"
              required
              defaultValue={service?.name || ""}
              placeholder="VD: Sửa chữa cửa cuốn khẩn cấp 24/7"
            />
          </label>

          <label>
            <span>Đường dẫn tĩnh (Slug) — Để trống sẽ tự tạo</span>
            <input
              name="slug"
              defaultValue={service?.slug || ""}
              placeholder="VD: sua-chua-cua-cuon-khan-cap-24-7"
            />
          </label>

          <label>
            <span>Mô tả tóm tắt dịch vụ *</span>
            <textarea
              name="summary"
              required
              rows={3}
              defaultValue={service?.summary || ""}
              placeholder="Tóm tắt ngắn gọn phạm vi hỗ trợ, tốc độ phục vụ..."
            />
          </label>

          <div className="admin-fields three">
            <label>
              <span>Khoảng giá tham khảo *</span>
              <input
                name="price"
                required
                defaultValue={service?.price || "Khảo sát báo giá"}
                placeholder="VD: Từ 250.000đ"
              />
            </label>

            <label>
              <span>Thời gian xử lý *</span>
              <input
                name="duration"
                required
                defaultValue={service?.duration || "30 - 60 phút"}
                placeholder="VD: 20 - 45 phút"
              />
            </label>

            <label>
              <span>Thời gian bảo hành *</span>
              <input
                name="warranty"
                required
                defaultValue={service?.warranty || "12 tháng"}
                placeholder="VD: 6 - 24 tháng"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Dấu hiệu & Quy trình */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Nội dung kỹ thuật</span>
            <h2>Dấu hiệu hư hỏng & Quy trình xử lý</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Dấu hiệu thường gặp (Mỗi dòng một dấu hiệu)</span>
            <textarea
              name="symptoms"
              rows={5}
              defaultValue={defaultSymptoms}
              placeholder={`Cửa dừng giữa chừng không lên xuống được\nNan cửa bị kẹt, xô nan hoặc bung ray\nMotor phát tiếng kêu bất thường`}
            />
          </label>

          <label>
            <span>Quy trình xử lý chuẩn (Mỗi dòng một bước)</span>
            <textarea
              name="process"
              rows={5}
              defaultValue={defaultProcess}
              placeholder={`Tiếp nhận thông tin và định vị sự cố\nKỹ thuật viên đến hiện trường trong 15-30 phút\nKiểm tra toàn diện, báo giá trước khi làm\nTiến hành sửa chữa, thay linh kiện chính hãng\nBàn giao phiếu bảo hành`}
            />
          </label>
        </div>
      </section>

      {/* Ảnh dịch vụ & Cấu hình hiển thị */}
      <section className="admin-form-card">
        <div className="admin-form-section-title">
          <div>
            <span>Hình ảnh & Hiển thị</span>
            <h2>Ảnh minh họa dịch vụ & Trạng thái</h2>
          </div>
        </div>

        <div className="admin-fields">
          <label>
            <span>Tải lên ảnh minh họa mới (JPG, PNG, WebP tối đa 5MB)</span>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
            />
          </label>

          <label>
            <span>Đường dẫn ảnh (URL hoặc đường dẫn sẵn có trong hệ thống)</span>
            <input
              name="image_url"
              defaultValue={service?.image_url || ""}
              placeholder="VD: /services/sua-cua-bi-ket.png hoặc tải ảnh ở trên"
            />
          </label>

          <div className="admin-fields two">
            <label>
              <span>Thứ tự hiển thị</span>
              <input
                name="sort_order"
                type="number"
                defaultValue={service?.sort_order ?? 0}
              />
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "28px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={service ? service.is_active : true}
                />
                <span>Kích hoạt hiển thị trên website</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="admin-form-submit">
        <button type="submit" className="button button-primary">
          <Save size={18} />
          <span>{service ? "Lưu thay đổi" : "Tạo dịch vụ mới"}</span>
        </button>
      </div>
    </form>
  );
}
