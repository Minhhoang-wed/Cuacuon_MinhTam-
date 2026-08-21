import { Calendar, CheckCircle2, Clock3, Edit3, MapPin, Phone, PhoneCall } from "lucide-react";
import Link from "next/link";
import { DeleteRequestButton } from "@/components/admin/delete-request-button";
import { deleteServiceRequest } from "@/lib/admin-actions";
import { getAdminServiceRequests } from "@/lib/admin-data";

const statusMap: Record<string, { label: string; className: string }> = {
  new: { label: "Mới nhận", className: "new" },
  contacted: { label: "Đã liên hệ", className: "contacted" },
  in_progress: { label: "Đang xử lý", className: "in_progress" },
  completed: { label: "Hoàn tất", className: "completed" },
  cancelled: { label: "Đã hủy", className: "cancelled" },
};

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; saved?: string; status?: string }>;
}) {
  const [requests, query] = await Promise.all([getAdminServiceRequests(), searchParams]);

  const filteredRequests = query.status
    ? requests.filter((r) => r.status === query.status)
    : requests;

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa đơn yêu cầu dịch vụ thành công.</span>
        </div>
      )}

      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Cập nhật trạng thái và ghi chú yêu cầu thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Tiếp nhận khách hàng</span>
          <h1>Yêu cầu sửa chữa & Đặt lịch ({requests.length})</h1>
          <p>
            Danh sách khách hàng gửi yêu cầu hỗ trợ qua form trực tuyến trên website.
            {newCount > 0 && (
              <span style={{ marginLeft: "8px", color: "#dc2626", fontWeight: 700 }}>
                ({newCount} đơn mới cần gọi lại)
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Bộ lọc trạng thái */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Link
          href="/admin/requests"
          className={`button ${!query.status ? "button-primary" : "button-ghost"} button-small`}
        >
          Tất cả ({requests.length})
        </Link>
        <Link
          href="/admin/requests?status=new"
          className={`button ${query.status === "new" ? "button-primary" : "button-ghost"} button-small`}
        >
          Mới nhận ({newCount})
        </Link>
        <Link
          href="/admin/requests?status=contacted"
          className={`button ${query.status === "contacted" ? "button-primary" : "button-ghost"} button-small`}
        >
          Đã liên hệ ({requests.filter((r) => r.status === "contacted").length})
        </Link>
        <Link
          href="/admin/requests?status=in_progress"
          className={`button ${query.status === "in_progress" ? "button-primary" : "button-ghost"} button-small`}
        >
          Đang xử lý ({requests.filter((r) => r.status === "in_progress").length})
        </Link>
        <Link
          href="/admin/requests?status=completed"
          className={`button ${query.status === "completed" ? "button-primary" : "button-ghost"} button-small`}
        >
          Hoàn tất ({requests.filter((r) => r.status === "completed").length})
        </Link>
        <Link
          href="/admin/requests?status=cancelled"
          className={`button ${query.status === "cancelled" ? "button-primary" : "button-ghost"} button-small`}
        >
          Đã hủy ({requests.filter((r) => r.status === "cancelled").length})
        </Link>
      </div>

      <section className="admin-panel">
        {filteredRequests.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng & Mã đơn</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ hỗ trợ</th>
                  <th>Tình trạng cửa</th>
                  <th>Thời gian mong muốn</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const statusInfo = statusMap[req.status] || { label: req.status, className: "secondary" };
                  return (
                    <tr key={req.id}>
                      <td>
                        <div className="admin-item-cell">
                          <div
                            className="admin-item-icon"
                            style={{
                              background: req.status === "new" ? "#fee2e2" : "#f1f5f9",
                              color: req.status === "new" ? "#dc2626" : "#64748b",
                              border: req.status === "new" ? "1px solid #fecaca" : "1px solid #e2e8f0",
                            }}
                          >
                            <PhoneCall size={18} />
                          </div>
                          <div className="admin-item-info">
                            <Link href={`/admin/requests/${req.id}`} title="Xem chi tiết đơn">
                              {req.name}
                            </Link>
                            <small style={{ color: "#d97706", fontWeight: 700 }}>
                              {req.request_code}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a
                          href={`tel:${req.phone.replace(/\D/g, "")}`}
                          style={{
                            fontWeight: 700,
                            color: "#0f2b48",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            textDecoration: "none",
                            fontSize: "14px",
                          }}
                        >
                          <Phone size={14} color="#10b981" /> {req.phone}
                        </a>
                      </td>
                      <td style={{ maxWidth: "220px", whiteSpace: "normal" }}>
                        <span style={{ fontSize: "13px", color: "#475569", display: "inline-flex", alignItems: "flex-start", gap: "4px" }}>
                          <MapPin size={14} color="#64748b" style={{ flexShrink: 0, marginTop: "2px" }} />
                          {req.address}
                        </span>
                      </td>
                      <td style={{ maxWidth: "250px", whiteSpace: "normal" }}>
                        <p style={{ fontSize: "13px", margin: 0, color: "#1e293b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {req.issue}
                        </p>
                      </td>
                      <td>
                        <span style={{ fontSize: "12.5px", color: "#64748b", display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span>
                            <Clock3 size={12} style={{ display: "inline", marginRight: "4px" }} />
                            {req.preferred_time}
                          </span>
                          {req.preferred_date && (
                            <span>
                              <Calendar size={12} style={{ display: "inline", marginRight: "4px" }} />
                              {req.preferred_date}
                            </span>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link
                            href={`/admin/requests/${req.id}`}
                            aria-label={`Xử lý yêu cầu ${req.request_code}`}
                            title="Xem chi tiết & xử lý"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <form action={deleteServiceRequest} style={{ margin: 0 }}>
                            <input type="hidden" name="id" value={req.id} />
                            <DeleteRequestButton requestCode={req.request_code} />
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty" style={{ textAlign: "center", padding: "48px 24px" }}>
            <PhoneCall size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", margin: 0 }}>Không có yêu cầu dịch vụ nào trong mục này.</p>
          </div>
        )}
      </section>
    </>
  );
}
