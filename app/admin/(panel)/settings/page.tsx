import { Building2, CheckCircle2, ExternalLink, Globe, PhoneCall, Save, Shield } from "lucide-react";
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
          <span>Cấu hình Hệ thống</span>
          <h1>Thông tin Doanh nghiệp & Website</h1>
          <p>Quản lý tên thương hiệu, địa chỉ, hotline, kênh Zalo/Facebook và thông tin SEO mặc định.</p>
        </div>
        <Link href="/" target="_blank" className="button button-ghost">
          <ExternalLink size={16} />
          <span>Xem website thực tế</span>
        </Link>
      </header>

      <form action={saveSettings} className="admin-form">
        {/* Thông tin thương hiệu */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Hồ sơ Doanh nghiệp</span>
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
              <span>Mô tả ngắn website (SEO mặc định)</span>
              <textarea
                name="site_description"
                maxLength={170}
                rows={3}
                defaultValue={settings.site_description || ""}
                placeholder="VD: Chuyên lắp đặt, sửa chữa và bảo dưỡng cửa cuốn chính hãng tại TP.HCM..."
              />
            </label>

            <label className="full">
              <span>Địa chỉ trụ sở / Xưởng kỹ thuật</span>
              <input
                name="address"
                defaultValue={settings.address || ""}
                placeholder="VD: Số 123 Đường Nguyễn Xí, Phường 26, Quận Bình Thạnh, TP.HCM"
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

        {/* Kênh liên hệ & Mạng xã hội */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Kênh tương tác trực tiếp</span>
              <h2>Hotline & Liên kết mạng xã hội</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Số điện thoại Hotline / Cứu hộ</span>
              <input
                name="hotline"
                defaultValue={settings.hotline || ""}
                placeholder="VD: 0901 234 567"
              />
            </label>

            <label>
              <span>Email liên hệ tiếp nhận</span>
              <input
                type="email"
                name="email"
                defaultValue={settings.email || ""}
                placeholder="VD: cuacuonantamtphcm@gmail.com"
              />
            </label>

            <label>
              <span>Đường dẫn Zalo (URL hoặc số)</span>
              <input
                type="text"
                name="zalo_url"
                defaultValue={settings.zalo_url || ""}
                placeholder="VD: https://zalo.me/0901234567"
              />
            </label>

            <label>
              <span>Trang Facebook Fanpage</span>
              <input
                type="url"
                name="facebook_url"
                defaultValue={settings.facebook_url || ""}
                placeholder="VD: https://facebook.com/cuacuonantam"
              />
            </label>

            <label>
              <span>Liên kết Messenger</span>
              <input
                type="url"
                name="messenger_url"
                defaultValue={settings.messenger_url || ""}
                placeholder="VD: https://m.me/cuacuonantam"
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

