import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Image,
  Save,
  Search,
  Share2,
  Tag,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { saveSeoSettings } from "@/lib/admin-actions";
import { getAdminSeoSettings } from "@/lib/admin-data";

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
          <span>Đã cập nhật toàn bộ cấu hình SEO thành công. Thay đổi đã có hiệu lực trên website.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>
            <Search size={13} /> Tối ưu công cụ tìm kiếm
          </span>
          <h1>Quản trị SEO</h1>
          <p>
            Cấu hình title template, meta description, Open Graph, Twitter Card, Robots và JSON-LD Schema — tách biệt hoàn toàn với thông tin doanh nghiệp.
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

        {/* ── 1. Title & Keywords ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Tag size={12} /> Metadata cơ bản</span>
              <h2>Title & Keywords</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label className="full">
              <span>Template tiêu đề trang (Title Template)</span>
              <input
                name="seo_title_template"
                defaultValue={seo.seo_title_template}
                placeholder="%s | Minh Tâm 24H"
              />
              <small style={{ color: "#64748b", fontSize: 12 }}>
                Dùng <code>%s</code> làm chỗ chứa tên từng trang. VD: <em>Sửa Cửa Cuốn | Minh Tâm 24H</em>
              </small>
            </label>

            <label>
              <span>Tên website (Site Name)</span>
              <input
                name="seo_site_name"
                defaultValue={seo.seo_site_name}
                placeholder="Cửa Cuốn Minh Tâm 24H"
              />
            </label>

            <label>
              <span>URL gốc chuẩn (Canonical Base URL)</span>
              <input
                type="url"
                name="seo_canonical_base"
                defaultValue={seo.seo_canonical_base}
                placeholder="https://www.suachuacuacuonnhanh24h.com"
              />
            </label>

            <label className="full">
              <span>Mô tả mặc định (Default Meta Description) — tối đa 160 ký tự</span>
              <textarea
                name="seo_default_description"
                rows={3}
                maxLength={160}
                defaultValue={seo.seo_default_description}
                placeholder="Chuyên sửa chữa, lắp đặt cửa cuốn tại TP.HCM. Phục vụ 24/7, thợ kỹ thuật chuyên nghiệp..."
              />
            </label>

            <label className="full">
              <span>Từ khóa SEO (Keywords) — phân cách bằng dấu phẩy</span>
              <input
                name="seo_keywords"
                defaultValue={seo.seo_keywords}
                placeholder="sửa cửa cuốn, cửa cuốn TP.HCM, motor cửa cuốn, phụ kiện cửa cuốn"
              />
            </label>
          </div>
        </section>

        {/* ── 2. Open Graph (Facebook / Zalo) ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Share2 size={12} /> Mạng xã hội</span>
              <h2>Open Graph (Facebook · Zalo · LinkedIn)</h2>
            </div>
          </div>

          <div className="seo-preview-card">
            <div className="seo-preview-label">
              <Globe size={13} /> Xem trước khi chia sẻ lên Facebook / Zalo
            </div>
            <div className="seo-og-preview">
              <div className="seo-og-image">
                <Image size={28} style={{ opacity: .35 }} />
                <span>og:image</span>
              </div>
              <div className="seo-og-copy">
                <span className="seo-og-site">{seo.seo_canonical_base?.replace(/https?:\/\//, "") || "yourdomain.com"}</span>
                <b>{seo.og_title || seo.seo_site_name}</b>
                <p>{seo.og_description || seo.seo_default_description}</p>
              </div>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>OG Title</span>
              <input
                name="og_title"
                defaultValue={seo.og_title}
                placeholder="Cửa Cuốn Minh Tâm — Sửa chữa 24/7 TP.HCM"
              />
            </label>

            <label>
              <span>OG Locale</span>
              <select name="og_locale" defaultValue={seo.og_locale}>
                <option value="vi_VN">vi_VN — Tiếng Việt</option>
                <option value="en_US">en_US — English</option>
              </select>
            </label>

            <label className="full">
              <span>OG Description</span>
              <textarea
                name="og_description"
                rows={2}
                maxLength={200}
                defaultValue={seo.og_description}
                placeholder="Chuyên sửa chữa, lắp đặt cửa cuốn 24/7 tại TP.HCM..."
              />
            </label>

            <label className="full">
              <span>OG Image URL — ảnh chia sẻ mạng xã hội (khuyến nghị 1200×630px)</span>
              <input
                type="url"
                name="og_image_url"
                defaultValue={seo.og_image_url}
                placeholder="https://yourdomain.com/og.png"
              />
            </label>
          </div>
        </section>

        {/* ── 3. Twitter Card ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Twitter size={12} /> Twitter / X</span>
              <h2>Twitter Card</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Loại card</span>
              <select name="twitter_card" defaultValue={seo.twitter_card}>
                <option value="summary_large_image">Summary Large Image (khuyến nghị)</option>
                <option value="summary">Summary</option>
                <option value="app">App</option>
              </select>
            </label>

            <label>
              <span>Twitter Site (@username)</span>
              <input
                name="twitter_site"
                defaultValue={seo.twitter_site}
                placeholder="@cuacuonminhtam"
              />
            </label>

            <label>
              <span>Twitter Title</span>
              <input
                name="twitter_title"
                defaultValue={seo.twitter_title}
                placeholder="Cửa Cuốn Minh Tâm 24H"
              />
            </label>

            <label>
              <span>Twitter Image URL</span>
              <input
                type="url"
                name="twitter_image_url"
                defaultValue={seo.twitter_image_url}
                placeholder="https://yourdomain.com/og.png"
              />
            </label>

            <label className="full">
              <span>Twitter Description</span>
              <textarea
                name="twitter_description"
                rows={2}
                maxLength={200}
                defaultValue={seo.twitter_description}
                placeholder="Sửa chữa cửa cuốn 24/7 TP.HCM..."
              />
            </label>
          </div>
        </section>

        {/* ── 4. Robots ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Eye size={12} /> Robots</span>
              <h2>Robots.txt & Indexing</h2>
            </div>
          </div>

          <div className="seo-robots-info">
            <AlertTriangle size={15} />
            <span>
              Thay đổi robots có thể ảnh hưởng toàn bộ khả năng hiển thị trên Google.
              Chỉ thay đổi nếu bạn hiểu rõ tác động.
            </span>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Index</span>
              <select name="robots_index" defaultValue={seo.robots_index}>
                <option value="index"><Eye size={14} /> index — Cho phép Google lập chỉ mục</option>
                <option value="noindex"><EyeOff size={14} /> noindex — Ẩn khỏi Google</option>
              </select>
            </label>

            <label>
              <span>Follow</span>
              <select name="robots_follow" defaultValue={seo.robots_follow}>
                <option value="follow">follow — Google theo link</option>
                <option value="nofollow">nofollow — Google không theo link</option>
              </select>
            </label>
          </div>
        </section>

        {/* ── 5. Structured Data (JSON-LD) ── */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span><Globe size={12} /> Structured Data</span>
              <h2>JSON-LD Schema (LocalBusiness)</h2>
            </div>
          </div>

          <div className="seo-schema-info">
            <span>📌</span>
            <span>
              Structured Data giúp Google hiển thị thông tin doanh nghiệp trực tiếp trên kết quả tìm kiếm
              (Knowledge Panel, Rich Snippets). Schema type: <strong>LocalBusiness + HomeAndConstructionBusiness</strong>.
            </span>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Tên doanh nghiệp (schema:name)</span>
              <input
                name="structured_business_name"
                defaultValue={seo.structured_business_name}
                placeholder="Cửa Cuốn Minh Tâm 24H"
              />
            </label>

            <label>
              <span>Số điện thoại (schema:telephone)</span>
              <input
                name="structured_phone"
                defaultValue={seo.structured_phone}
                placeholder="0901 234 567"
              />
            </label>

            <label>
              <span>Thành phố (addressLocality)</span>
              <input
                name="structured_address_locality"
                defaultValue={seo.structured_address_locality}
                placeholder="TP. Hồ Chí Minh"
              />
            </label>

            <label>
              <span>Khu vực / Mã vùng (addressRegion)</span>
              <input
                name="structured_address_region"
                defaultValue={seo.structured_address_region}
                placeholder="VN-SG"
              />
            </label>

            <label>
              <span>Price Range (priceRange)</span>
              <select name="structured_price_range" defaultValue={seo.structured_price_range}>
                <option value="$">$ — Bình dân</option>
                <option value="$$">$$ — Trung bình</option>
                <option value="$$$">$$$ — Cao cấp</option>
              </select>
            </label>
          </div>
        </section>

        {/* ── Save Bar ── */}
        <div className="admin-sticky-save">
          <span>✓ Thay đổi SEO sẽ có hiệu lực ngay sau khi lưu và website được revalidate.</span>
          <button type="submit" className="button button-primary">
            <Save size={18} />
            <span>Lưu cấu hình SEO</span>
          </button>
        </div>
      </form>
    </>
  );
}
