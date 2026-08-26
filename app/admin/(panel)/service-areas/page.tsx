import { CheckCircle2, Clock3, Edit3, Flame, MapPin, Phone, Plus, Save, Store, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteBranchButton } from "@/components/admin/delete-branch-button";
import { DeleteDistrictButton } from "@/components/admin/delete-district-button";
import { EditBranchModal } from "@/components/admin/edit-branch-modal";
import { EditDistrictModal } from "@/components/admin/edit-district-modal";
import { deleteServiceDistrict, deleteStoreBranch, saveServiceDistrict, saveStoreBranch } from "@/lib/admin-actions";
import { getAdminServiceDistricts, getAdminStoreBranches } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function AdminServiceAreasPage({
  searchParams,
}: {
  searchParams: Promise<{
    branch_saved?: string;
    branch_deleted?: string;
    district_saved?: string;
    district_deleted?: string;
  }>;
}) {
  const [branches, districts, query] = await Promise.all([
    getAdminStoreBranches(),
    getAdminServiceDistricts(),
    searchParams,
  ]);
  const demo = !isSupabaseConfigured();

  return (
    <>
      {query.branch_saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã lưu thông tin chi nhánh cửa hàng thành công.</span>
        </div>
      )}

      {query.branch_deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa chi nhánh cửa hàng khỏi hệ thống.</span>
        </div>
      )}

      {query.district_saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã lưu thông tin quận huyện phục vụ thành công.</span>
        </div>
      )}

      {query.district_deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa quận huyện khỏi danh sách phục vụ.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <h1>Khu vực phục vụ & Chi nhánh ({branches.length} Chi nhánh / {districts.length} Quận huyện)</h1>
          <p>Quản lý các điểm cửa hàng trực tiếp và mạng lưới kỹ thuật viên túc trực tại các quận huyện TP.HCM.</p>
        </div>
      </header>

      {/* 1. KHỐI CỬA HÀNG / CHI NHÁNH TRỰC TIẾP */}
      <div className="admin-two-column" style={{ marginBottom: "40px" }}>
        {/* Danh sách Chi nhánh */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>1. Chi nhánh cửa hàng trực tiếp ({branches.length})</h2>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
            {branches.map((branch) => (
              <article
                key={branch.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#059669",
                        background: "#ecfdf5",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        marginBottom: "6px",
                      }}
                    >
                      <Store size={13} /> {branch.badge || "Cửa hàng trực tiếp"}
                    </span>
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>{branch.branch_name}</h3>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <EditBranchModal branch={branch} />
                    <form action={deleteStoreBranch} style={{ margin: 0 }}>
                      <input type="hidden" name="id" value={branch.id} />
                      <DeleteBranchButton branchName={branch.branch_name} />
                    </form>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={15} color="#64748b" /> {branch.address}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>{branch.note}</span>
                  <a
                    href={`tel:${branch.hotline.replace(/\D/g, "")}`}
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#2563eb",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Phone size={14} /> {branch.hotline}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Form Thêm Chi nhánh mới */}
        <aside className="admin-form-card sticky-card">
          <Store size={28} color="#2563eb" />
          <h2>Thêm chi nhánh cửa hàng</h2>

          <form action={saveStoreBranch}>
            <div className="admin-fields">
              <label>
                <span>Tên chi nhánh *</span>
                <input
                  name="branch_name"
                  required
                  placeholder="VD: Cơ sở 3 (Chi nhánh Bình Thạnh)"
                />
              </label>

              <label>
                <span>Địa chỉ chi nhánh *</span>
                <input
                  name="address"
                  required
                  placeholder="VD: 268 Bạch Đằng, P.24, Q. Bình Thạnh, TP.HCM"
                />
              </label>

              <label>
                <span>Số điện thoại Hotline *</span>
                <input
                  name="hotline"
                  required
                  defaultValue="0327.359.368"
                  placeholder="0327.359.368"
                />
              </label>

              <label>
                <span>Ghi chú loại hình</span>
                <input
                  name="note"
                  defaultValue="Cửa hàng trưng bày & Trung tâm kỹ thuật"
                  placeholder="VD: Cửa hàng trưng bày & Showroom"
                />
              </label>

              <label>
                <span>Nhãn nổi bật</span>
                <input
                  name="badge"
                  defaultValue="Cửa hàng trực tiếp"
                  placeholder="VD: Showroom chính hãng"
                />
              </label>

              <label>
                <span>Thứ tự hiển thị</span>
                <input name="sort_order" type="number" defaultValue={branches.length + 1} />
              </label>

              <label className="check-field">
                <input name="is_active" type="checkbox" defaultChecked />
                <span>Hiển thị ngay trên trang Khu vực phục vụ</span>
              </label>
            </div>

            <button
              className="button button-primary"
              style={{ width: "100%", marginTop: 14 }}
              disabled={demo}
            >
              <Plus size={14} />
              <span>Thêm chi nhánh</span>
            </button>
          </form>
        </aside>
      </div>

      {/* 2. KHỐI QUẬN HUYỆN KỸ THUẬT TÚC TRỰC */}
      <div className="admin-two-column">
        {/* Danh sách Quận huyện */}
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>2. Danh sách Quận / Huyện phục vụ ({districts.length})</h2>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Quận / Huyện</th>
                  <th>Địa chỉ điểm chốt</th>
                  <th>Thời gian có mặt</th>
                  <th>Đặc biệt</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {districts.map((district) => (
                  <tr key={district.id}>
                    <td>
                      <b style={{ color: "#0f172a", fontSize: "14px" }}>{district.district_name}</b>
                    </td>
                    <td>
                      <span style={{ fontSize: "13.5px", color: "#475569" }}>{district.address_landmark}</span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#059669" }}>
                        <Clock3 size={13} /> {district.response_time}
                      </span>
                    </td>
                    <td>
                      {district.is_hotspot ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "#dc2626", fontWeight: 600, background: "#fef2f2", padding: "2px 6px", borderRadius: "4px" }}>
                          <Flame size={12} /> Trọng điểm
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Thường trực</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <EditDistrictModal district={district} />
                        <form action={deleteServiceDistrict} style={{ margin: 0 }}>
                          <input type="hidden" name="id" value={district.id} />
                          <DeleteDistrictButton districtName={district.district_name} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Form Thêm Quận huyện mới */}
        <aside className="admin-form-card sticky-card">
          <MapPin size={28} color="#2563eb" />
          <h2>Thêm điểm trực quận huyện</h2>

          <form action={saveServiceDistrict}>
            <div className="admin-fields">
              <label>
                <span>Tên Quận / Huyện *</span>
                <input
                  name="district_name"
                  required
                  placeholder="VD: Quận Cầu Giấy (Hà Nội), Quận Gò Vấp..."
                />
              </label>

              <label>
                <span>Địa chỉ điểm chốt / Cột mốc (Không bắt buộc)</span>
                <input
                  name="address_landmark"
                  placeholder="VD: 248 Quang Trung... (Để trống nếu chỉ cần ghi tên quận)"
                />
              </label>

              <label>
                <span>Thời gian cam kết có mặt *</span>
                <input
                  name="response_time"
                  required
                  defaultValue="Có mặt sau 15 – 25 phút"
                  placeholder="VD: Có mặt sau 15 – 20 phút"
                />
              </label>

              <label>
                <span>Ghi chú điểm chốt</span>
                <input
                  name="note"
                  defaultValue="Trạm trực kỹ thuật"
                  placeholder="VD: Trạm trực kỹ thuật lưu động"
                />
              </label>

              <label className="check-field">
                <input name="is_hotspot" type="checkbox" defaultChecked />
                <span>Đánh dấu là khu vực trọng điểm</span>
              </label>

              <label>
                <span>Thứ tự hiển thị</span>
                <input name="sort_order" type="number" defaultValue={districts.length + 1} />
              </label>

              <label className="check-field">
                <input name="is_active" type="checkbox" defaultChecked />
                <span>Hiển thị trên website</span>
              </label>
            </div>

            <button
              className="button button-primary"
              style={{ width: "100%", marginTop: 14 }}
              disabled={demo}
            >
              <Plus size={14} />
              <span>Thêm điểm phục vụ</span>
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
