import { ArrowLeft, Calendar, CheckCircle2, Clock3, ImageIcon, MapPin, Phone, PhoneCall, Save, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateServiceRequestStatus } from "@/lib/admin-actions";
import { getAdminServiceRequest } from "@/lib/admin-data";
import { publicAssetUrl } from "@/lib/supabase-rest";

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const [request, query] = await Promise.all([getAdminServiceRequest(id), searchParams]);

  if (!request) notFound();

  const formattedDate = new Date(request.created_at).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Cập nhật trạng thái và ghi chú xử lý thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <Link href="/admin/requests" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách yêu cầu</span>
          </Link>
          <h1>Đơn yêu cầu: {request.request_code}</h1>
          <p>Tiếp nhận lúc {formattedDate}</p>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* Chi tiết yêu cầu */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <section className="admin-form-card">
            <div className="admin-form-section-title">
              <div>
                <span>Thông tin liên hệ</span>
                <h2>Khách hàng & Địa chỉ</h2>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ padding: "12px 16px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <small style={{ color: "#64748b", display: "block", marginBottom: "4px" }}>Họ tên khách hàng</small>
                <b style={{ fontSize: "16px", color: "#0f2b48" }}>{request.name}</b>
              </div>

              <div style={{ padding: "12px 16px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <small style={{ color: "#64748b", display: "block", marginBottom: "4px" }}>Số điện thoại</small>
                <a
                  href={`tel:${request.phone.replace(/\D/g, "")}`}
                  style={{ fontSize: "16px", fontWeight: 700, color: "#10b981", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                >
                  <Phone size={16} /> {request.phone}
                </a>
              </div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "16px" }}>
              <small style={{ color: "#64748b", display: "block", marginBottom: "4px" }}>Địa chỉ cần hỗ trợ</small>
              <span style={{ fontSize: "15px", color: "#1e293b", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} color="#d97706" /> {request.address}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ padding: "12px 16px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <small style={{ color: "#64748b", display: "block", marginBottom: "4px" }}>Khung giờ mong muốn</small>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f2b48" }}>
                  <Clock3 size={14} style={{ display: "inline", marginRight: "4px" }} />
                  {request.preferred_time}
                </span>
              </div>

              <div style={{ padding: "12px 16px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <small style={{ color: "#64748b", display: "block", marginBottom: "4px" }}>Ngày mong muốn</small>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f2b48" }}>
                  <Calendar size={14} style={{ display: "inline", marginRight: "4px" }} />
                  {request.preferred_date || "Hôm nay / Sớm nhất"}
                </span>
              </div>
            </div>
          </section>

          <section className="admin-form-card">
            <div className="admin-form-section-title">
              <div>
                <span>Hiện trạng sự cố</span>
                <h2>Mô tả lỗi từ khách hàng</h2>
              </div>
            </div>

            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "15px", lineHeight: "1.6", color: "#0f172a" }}>
              {request.issue}
            </div>

            {/* Ảnh khách gửi đính kèm */}
            {request.images && request.images.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px", color: "#334155" }}>
                  Hình ảnh hiện trạng khách đính kèm ({request.images.length} ảnh)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                  {request.images.map((path, idx) => (
                    <a
                      key={idx}
                      href={publicAssetUrl(path) || path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicAssetUrl(path) || path}
                        alt={`Ảnh hiện trạng ${idx + 1}`}
                        style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Xử lý trạng thái & Ghi chú nội bộ */}
        <aside>
          <form action={updateServiceRequestStatus} className="admin-form-card" style={{ position: "sticky", top: "20px" }}>
            <input type="hidden" name="id" value={request.id} />

            <div className="admin-form-section-title">
              <div>
                <span>Điều phối kỹ thuật</span>
                <h2>Cập nhật trạng thái</h2>
              </div>
            </div>

            <div className="admin-fields" style={{ marginTop: "16px" }}>
              <label>
                <span>Trạng thái xử lý *</span>
                <select name="status" defaultValue={request.status} style={{ width: "100%" }}>
                  <option value="new">🔴 Mới nhận (Chưa gọi)</option>
                  <option value="contacted">🟡 Đã liên hệ xác nhận</option>
                  <option value="in_progress">🔵 Đang điều phối / Đang sửa</option>
                  <option value="completed">🟢 Hoàn tất bàn giao</option>
                  <option value="cancelled">⚪ Đã hủy / Khách hẹn lại</option>
                </select>
              </label>

              <label>
                <span>Ghi chú nội bộ (KTV phụ trách, kết quả báo giá...)</span>
                <textarea
                  name="admin_notes"
                  rows={6}
                  defaultValue={request.admin_notes || ""}
                  placeholder="VD: Đã gọi lúc 10h15. KTV Tuấn nhận lịch qua kiểm tra lúc 14h chiều nay. Dự kiến thay bình ắc quy 12V..."
                />
              </label>

              <button type="submit" className="button button-primary" style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}>
                <Save size={16} />
                <span>Lưu cập nhật</span>
              </button>
            </div>
          </form>
        </aside>
      </div>
    </>
  );
}
