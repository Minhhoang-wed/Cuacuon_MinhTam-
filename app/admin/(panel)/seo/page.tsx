import {
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Image,
  Save,
  Search,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { saveSeoSettings } from "@/lib/admin-actions";
import { getAdminSeoSettings } from "@/lib/admin-data";
import { SeoImageUpload } from "@/components/admin/seo-image-upload";

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const seo = await getAdminSeoSettings();
  const saved = (await searchParams).saved;

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã cập nhật cấu hình SEO thành công. Thay đổi đã có hiệu lực trên website.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>
            <Search size={13} /> Tối ưu công cụ tìm kiếm & Chia sẻ
          </span>
          <h1>Quản trị SEO</h1>
          <p>
            Tối ưu hóa tiêu đề, mô tả hiển thị trên Google tìm kiếm và hình ảnh đại diện khi gửi link qua Zalo / Facebook.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" target="_blank" className="button button-ghost button-small">
            <ExternalLink size={15} />
            <span>Xem website</span>
          </Link>
        </div>
      </header>

      <form action={saveSeoSettings} className="admin-form">

        {/* ── 1. Google Search Preview & Metadata ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Tag size={12} /> Google Search</span>
              <h2>Hiển thị trên Google Tìm Kiếm</h2>
            </div>
          </div>

          {/* Google Search Snippet Preview */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Globe size={14} color="#2563eb" />
              <span>Xem trước kết quả tìm kiếm trên Google:</span>
            </div>
            <div style={{ fontSize: "13px", color: "#202124", lineHeight: 1.3 }}>
              <span style={{ color: "#202124", fontSize: "12px" }}>
                {seo.seo_canonical_base || "https://www.suachuacuacuonnhanh24h.com"}
              </span>
              <h3 style={{
                color: "#1a0dab",
                fontSize: "18px",
                fontWeight: 500,
                margin: "4px 0",
                lineHeight: 1.3,
                cursor: "pointer",
              }}>
                {seo.seo_site_name ? `${seo.seo_site_name} | Sửa Cửa Cuốn TP.HCM 24/7` : "Cửa Cuốn Minh Tâm | Sửa Cửa Cuốn TP.HCM 24/7"}
              </h3>
              <p style={{ color: "#4d5156", fontSize: "13.5px", margin: 0, lineHeight: 1.45 }}>
                {seo.seo_default_description || "Dịch vụ sửa chữa, bảo trì và lắp đặt cửa cuốn tận nơi tại TP.HCM. Thợ có mặt sau 15-20 phút, báo giá minh bạch, bảo hành dài hạn."}
              </p>
            </div>
          </div>

          <div className="admin-fields two">
            <label className="full">
              <span>Tên thương hiệu SEO / Tiêu đề trang chính</span>
              <input
                name="seo_site_name"
                defaultValue={seo.seo_site_name || "Cửa Cuốn Minh Tâm 24H"}
                placeholder="VD: Cửa Cuốn Minh Tâm 24H"
                required
              />
            </label>

            <label className="full">
              <span>Mô tả tìm kiếm Google (Meta Description) — Tối đa 160 ký tự</span>
              <textarea
                name="seo_default_description"
                rows={3}
                maxLength={160}
                defaultValue={seo.seo_default_description}
                placeholder="VD: Chuyên sửa chữa, lắp đặt cửa cuốn tại TP.HCM. Phục vụ 24/7, có mặt sau 15 phút, bảo hành dài hạn..."
                required
              />
              <small style={{ color: "#64748b", fontSize: "12px" }}>
                Đoạn văn ngắn gọn, thu hút khách hàng bấm vào link khi tìm kiếm trên Google.
              </small>
            </label>

            <label className="full">
              <span>Từ khóa SEO chính (Keywords) — Cách nhau bởi dấu phẩy</span>
              <input
                name="seo_keywords"
                defaultValue={seo.seo_keywords}
                placeholder="sửa cửa cuốn, sửa cửa cuốn TP.HCM, motor cửa cuốn, remote cửa cuốn"
              />
            </label>

            <label className="full">
              <span>Địa chỉ website chính thức (Canonical Base URL)</span>
              <input
                type="url"
                name="seo_canonical_base"
                defaultValue={seo.seo_canonical_base}
                placeholder="https://www.suachuacuacuonnhanh24h.com"
              />
            </label>
          </div>
        </section>

        {/* ── 2. Ảnh đại diện khi chia sẻ Zalo & Facebook (OG Image) ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Share2 size={12} /> Zalo · Facebook · Messenger</span>
              <h2>Hình ảnh đại diện khi gửi link (Social Thumbnail)</h2>
            </div>
          </div>

          <SeoImageUpload
            initialImageUrl={seo.og_image_url || "/og.png"}
            siteName={seo.seo_site_name || "Cửa Cuốn Minh Tâm"}
            siteUrl={seo.seo_canonical_base || "https://www.suachuacuacuonnhanh24h.com"}
            description={seo.seo_default_description || "Dịch vụ sửa chữa cửa cuốn 24/7 uy tín TP.HCM"}
          />
        </section>

        {/* ── 3. Trạng thái lập chỉ mục (Robots Index) ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Eye size={12} /> Google Index</span>
              <h2>Trạng thái hiển thị trên Google</h2>
            </div>
          </div>

          <div className="admin-fields">
            <label>
              <span>Cho phép Google tìm kiếm & lập chỉ mục website</span>
              <select name="robots_index" defaultValue={seo.robots_index || "index"}>
                <option value="index">🟢 index — Cho phép Google tìm thấy & hiển thị website (Khuyên dùng)</option>
                <option value="noindex">🔴 noindex — Ẩn hoàn toàn website khỏi kết quả tìm kiếm Google</option>
              </select>
            </label>
          </div>
        </section>

        {/* ── Save Bar ── */}
        <div className="admin-sticky-save">
          <span>✓ Cấu hình SEO sau khi lưu sẽ đồng bộ tự động trên toàn bộ website.</span>
          <button type="submit" className="button button-primary">
            <Save size={18} />
            <span>Lưu cấu hình SEO</span>
          </button>
        </div>
      </form>
    </>
  );
}
