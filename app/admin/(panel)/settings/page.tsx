import { CheckCircle2, ExternalLink, Save, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { saveSettings } from "@/lib/admin-actions";
import { getAdminSettings } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const settings = await getAdminSettings();
  const demo = !isSupabaseConfigured();
  const saved = (await searchParams).saved;

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã cập nhật toàn bộ thông tin cấu hình website thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <h1>Thông tin Doanh nghiệp & Website</h1>
          <p>Quản lý tên thương hiệu, địa chỉ, hotline, kênh Zalo/Facebook và thông tin liên hệ chính thức.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/seo" className="button button-ghost">
            <SlidersHorizontal size={16} />
            <span>Cấu hình SEO</span>
          </Link>
          <Link href="/" target="_blank" className="button button-ghost">
            <ExternalLink size={16} />
            <span>Xem website</span>
          </Link>
        </div>
      </header>

      <form action={saveSettings} className="admin-form">
        {/* Thông tin thương hiệu */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <h2>Thông tin thương hiệu</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Tên đầy đủ công ty</span>
              <input
                name="company_name"
                defaultValue={settings.company_name || ""}
                placeholder="VD: Cửa Cuốn An Tâm 24H"
              />
            </label>

            <label>
              <span>Tên thương hiệu ngắn gọn</span>
              <input
                name="short_name"
                defaultValue={settings.short_name || ""}
                placeholder="VD: An Tâm Door"
              />
            </label>

            <label className="full">
              <span>Mô tả giới thiệu doanh nghiệp</span>
              <textarea
                name="site_description"
                maxLength={170}
                rows={3}
                defaultValue={settings.site_description || ""}
                placeholder="VD: Chuyên lắp đặt, sửa chữa và bảo dưỡng cửa cuốn chính hãng tại TP.HCM..."
              />
            </label>

            <label>
              <span>Thời gian làm việc</span>
              <input
                name="business_hours"
                defaultValue={settings.business_hours || ""}
                placeholder="VD: 24/7 (Phục vụ cả ngày lễ & Chủ nhật)"
              />
            </label>

            <label>
              <span>Khu vực phục vụ</span>
              <input
                name="service_area"
                defaultValue={settings.service_area || ""}
                placeholder="VD: Toàn TP.HCM và các tỉnh lân cận"
              />
            </label>
          </div>
        </section>

        {/* Hệ thống Cơ sở 1 & Cơ sở 2 */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <h2>Hệ thống Cơ sở phục vụ (CS1 & CS2)</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Tên Cơ sở 1</span>
              <input
                name="branch_1_name"
                defaultValue={settings.branch_1_name || "Cơ sở 1 (Trụ sở Quận 10)"}
                placeholder="VD: Cơ sở 1 (Trụ sở Quận 10)"
              />
            </label>

            <label>
              <span>Địa chỉ Cơ sở 1</span>
              <input
                name="branch_1_address"
                defaultValue={settings.branch_1_address || settings.address || "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM"}
                placeholder="VD: 361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM"
              />
            </label>

            <label>
              <span>Tên Cơ sở 2</span>
              <input
                name="branch_2_name"
                defaultValue={settings.branch_2_name || "Cơ sở 2 (Chi nhánh Quận 6)"}
                placeholder="VD: Cơ sở 2 (Chi nhánh Quận 6)"
              />
            </label>

            <label>
              <span>Địa chỉ Cơ sở 2</span>
              <input
                name="branch_2_address"
                defaultValue={settings.branch_2_address || "617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM"}
                placeholder="VD: 617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM"
              />
            </label>
          </div>
        </section>

        {/* Kênh liên hệ & Hotline */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <h2>Hotline & Kênh liên hệ trực tiếp</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Số điện thoại Hotline / Cứu hộ 24/7</span>
              <input
                name="hotline"
                defaultValue={settings.hotline || ""}
                placeholder="VD: 0327 359 368"
              />
            </label>

            <label>
              <span>Email liên hệ tiếp nhận</span>
              <input
                type="email"
                name="email"
                defaultValue={settings.email || ""}
                placeholder="VD: cuacuonminhtam24h@gmail.com"
              />
            </label>

            <label>
              <span>Đường dẫn Zalo (URL hoặc số điện thoại)</span>
              <input
                type="text"
                name="zalo_url"
                defaultValue={settings.zalo_url || ""}
                placeholder="VD: https://zalo.me/0327359368"
              />
            </label>

            <label>
              <span>Bản đồ Google Maps (URL chỉ đường)</span>
              <input
                type="url"
                name="maps_url"
                defaultValue={settings.maps_url || ""}
                placeholder="VD: https://maps.app.goo.gl/..."
              />
            </label>
          </div>
        </section>

        {/* Floating Save */}
        <div className="admin-sticky-save">
          <span>✓ Cấu hình sau khi lưu sẽ đồng bộ tự động trên toàn bộ website.</span>
          <button className="button button-primary">
            <Save size={18} />
            <span>Lưu thông tin cấu hình</span>
          </button>
        </div>
      </form>
    </>
  );
}

