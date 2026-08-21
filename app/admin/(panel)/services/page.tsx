import { CheckCircle2, Clock3, Edit3, Layers, Plus, Save, ShieldCheck, Tag, Trash2, Wrench } from "lucide-react";
import Link from "next/link";
import { DeletePriceItemButton } from "@/components/admin/delete-price-item-button";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { deleteService, deleteServicePriceItem, saveServicePriceItem } from "@/lib/admin-actions";
import { getAdminServicePriceItems, getAdminServices } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

const priceCategoryOptions = [
  "1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn",
  "2. Bảng giá sửa chữa & thay mới Motor",
  "3. Bảng giá Remote & Hộp nhận tín hiệu",
  "4. Bảng giá sửa chữa Bộ lưu điện (UPS)",
];

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; saved?: string; pricing_saved?: string; pricing_deleted?: string }>;
}) {
  const [services, priceItems, query] = await Promise.all([
    getAdminServices(),
    getAdminServicePriceItems(),
    searchParams,
  ]);
  const demo = !isSupabaseConfigured();

  // Nhóm các dòng giá theo category_name
  const groupedPricing: Record<string, typeof priceItems> = {};
  for (const item of priceItems) {
    if (!groupedPricing[item.category_name]) {
      groupedPricing[item.category_name] = [];
    }
    groupedPricing[item.category_name].push(item);
  }

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa dịch vụ kỹ thuật thành công.</span>
        </div>
      )}

      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Thông tin dịch vụ kỹ thuật đã được cập nhật thành công lên website.</span>
        </div>
      )}

      {query.pricing_saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã lưu và cập nhật dòng bảng giá dịch vụ thành công.</span>
        </div>
      )}

      {query.pricing_deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa dòng báo giá khỏi danh sách.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Dịch vụ & Báo giá</span>
          <h1>Quản lý Dịch vụ & Bảng giá ({services.length} Dịch vụ / {priceItems.length} Hạng mục giá)</h1>
          <p>Quản lý các gói dịch vụ cứu hộ 24/7 và điều chỉnh bảng báo giá chi tiết hiển thị trên trang /dich-vu.</p>
        </div>
        <Link href="/admin/services/new" className="button button-primary">
          <Plus size={18} />
          <span>Thêm dịch vụ mới</span>
        </Link>
      </header>

      {/* 1. KHỐI CÁC DỊCH VỤ KỸ THUẬT CHÍNH */}
      <section className="admin-panel" style={{ marginBottom: "36px" }}>
        <div className="admin-panel-heading">
          <div>
            <span>Kỹ thuật chuyên sâu</span>
            <h2>1. Danh sách Dịch vụ sửa chữa ({services.length})</h2>
          </div>
          <Link href="/admin/services/new" className="button button-primary" style={{ padding: "7px 14px", fontSize: "13.5px" }}>
            <Plus size={15} /> Thêm dịch vụ
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên dịch vụ kỹ thuật</th>
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
                        {service.image_url ? (
                          <img
                            src={service.image_url}
                            alt={service.name}
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
                              background: "#ecfdf5",
                              color: "#059669",
                              border: "1px solid #a7f3d0",
                            }}
                          >
                            <Wrench size={19} />
                          </div>
                        )}
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

      {/* 2. KHỐI QUẢN LÝ BẢNG BÁO GIÁ CHI TIẾT */}
      <div className="admin-two-column">
        {/* Danh sách các nhóm bảng giá */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>Bảng báo giá chi tiết</span>
              <h2>2. Bảng giá dịch vụ theo từng hạng mục</h2>
            </div>
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {priceCategoryOptions.map((catTitle) => {
              const items = groupedPricing[catTitle] || [];
              return (
                <div
                  key={catTitle}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1e293b",
                      margin: "0 0 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Layers size={17} color="#2563eb" /> {catTitle} ({items.length})
                  </h3>

                  {items.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: "#ffffff",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                          }}
                        >
                          <div style={{ flex: "1 1 240px" }}>
                            <b style={{ fontSize: "14px", color: "#0f172a" }}>{item.item_name}</b>
                            <div style={{ display: "flex", gap: "14px", marginTop: "4px", fontSize: "13px" }}>
                              <span style={{ color: "#2563eb", fontWeight: 600 }}>{item.price}</span>
                              <span style={{ color: "#059669" }}>Bảo hành: {item.warranty}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <form action={deleteServicePriceItem} style={{ margin: 0 }}>
                              <input type="hidden" name="id" value={item.id} />
                              <DeletePriceItemButton itemName={item.item_name} />
                            </form>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: "13.5px", color: "#94a3b8" }}>
                      Chưa có hạng mục nào trong danh mục giá này.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Form Thêm nhanh dòng báo giá */}
        <aside className="admin-form-card sticky-card">
          <Tag size={28} color="#2563eb" />
          <h2>Thêm hạng mục báo giá mới</h2>
          <p style={{ fontSize: "13.5px", color: "#64748b", margin: "-6px 0 14px" }}>
            Bổ sung dòng giá vào 1 trong 4 danh mục bảng giá trên website.
          </p>

          <form action={saveServicePriceItem}>
            <div className="admin-fields">
              <label>
                <span>Nhóm bảng giá *</span>
                <select name="category_name" required defaultValue={priceCategoryOptions[0]}>
                  {priceCategoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Tên hạng mục sửa chữa / Dịch vụ *</span>
                <input
                  name="item_name"
                  required
                  placeholder="VD: Sửa motor bị kẹt cơ, hỏng tụ"
                />
              </label>

              <label>
                <span>Mức giá tham khảo *</span>
                <input
                  name="price"
                  required
                  placeholder="VD: 350.000 – 800.000 VNĐ"
                />
              </label>

              <label>
                <span>Thời gian bảo hành</span>
                <input
                  name="warranty"
                  defaultValue="3 – 6 tháng"
                  placeholder="VD: 6 – 12 tháng"
                />
              </label>

              <label>
                <span>Thứ tự hiển thị</span>
                <input name="sort_order" type="number" defaultValue={priceItems.length + 1} />
              </label>

              <label className="check-field">
                <input name="is_active" type="checkbox" defaultChecked />
                <span>Hiển thị ngay trên bảng giá ngoài website</span>
              </label>
            </div>

            <button
              className="button button-primary"
              style={{ width: "100%", marginTop: 14 }}
              disabled={demo}
            >
              <Plus size={18} />
              <span>Thêm vào bảng giá</span>
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
