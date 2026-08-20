import { CheckCircle2, Clock3, Edit3, Plus, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { deleteService } from "@/lib/admin-actions";
import { getAdminServices } from "@/lib/admin-data";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; saved?: string }>;
}) {
  const [services, query] = await Promise.all([getAdminServices(), searchParams]);

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa dịch vụ thành công.</span>
        </div>
      )}

      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Thông tin dịch vụ đã được cập nhật thành công lên website.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Dịch vụ kỹ thuật</span>
          <h1>Dịch vụ sửa chữa & Bảo trì ({services.length})</h1>
          <p>Quản lý các gói dịch vụ cứu hộ 24/7, bảo dưỡng định kỳ và thay thế linh kiện.</p>
        </div>
        <Link href="/admin/services/new" className="button button-primary">
          <Plus size={18} />
          <span>Thêm dịch vụ mới</span>
        </Link>
      </header>

      <section className="admin-panel">
        {services.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên gói dịch vụ</th>
                  <th>Khoảng giá</th>
                  <th>Thời gian xử lý</th>
                  <th>Bảo hành</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="admin-item-cell">
                        <div
                          className="admin-item-icon"
                          style={{
                            background: "#ecfdf5",
                            color: "#059669",
                            border: "1px solid #a7f3d0",
                          }}
                        >
                          <Wrench size={19} />
                        </div>
                        <div className="admin-item-info">
                          <Link href={`/admin/services/${service.id}`} title="Chỉnh sửa dịch vụ">
                            {service.name}
                          </Link>
                          <small>/{service.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <b style={{ color: "#0f172a", fontWeight: 600, fontSize: "14px" }}>
                        {service.price}
                      </b>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13.5px", color: "#475569" }}>
                        <Clock3 size={14} color="#64748b" /> {service.duration}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13.5px", color: "#059669", fontWeight: 500 }}>
                        <ShieldCheck size={14} color="#059669" /> {service.warranty}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${service.is_active ? "published" : "draft"}`}>
                        {service.is_active ? "Hiển thị" : "Đang ẩn"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/admin/services/${service.id}`}
                          aria-label={`Sửa ${service.name}`}
                          title="Chỉnh sửa dịch vụ"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <form action={deleteService} style={{ margin: 0 }}>
                          <input type="hidden" name="id" value={service.id} />
                          <DeleteServiceButton serviceName={service.name} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Wrench size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", margin: "0 0 16px" }}>Chưa có dịch vụ nào trong cơ sở dữ liệu.</p>
            <Link href="/admin/services/new" className="button button-primary">
              <Plus size={16} /> Thêm dịch vụ đầu tiên
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
