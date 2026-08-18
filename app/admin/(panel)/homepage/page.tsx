import { CheckCircle2, ExternalLink, LayoutTemplate, MessageSquareQuote, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { saveHomepage } from "@/lib/admin-actions";
import { getAdminHomepage } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const content = await getAdminHomepage();
  const demo = !isSupabaseConfigured();
  const saved = (await searchParams).saved;

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã cập nhật và xuất bản nội dung trang chủ thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Quản lý Nội dung</span>
          <h1>Chỉnh sửa Trang chủ</h1>
          <p>Tùy chỉnh thông điệp đầu trang (Hero Banner), khẩu hiệu và khu vực giới thiệu sản phẩm.</p>
        </div>
        <Link href="/" target="_blank" className="button button-ghost">
          <ExternalLink size={16} />
          <span>Xem trang chủ thực tế</span>
        </Link>
      </header>

      <form action={saveHomepage} className="admin-form">
        {/* Banner Hero */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Banner đầu trang (Hero Section)</span>
              <h2>Thông điệp thương hiệu</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label className="full">
              <span>Nhãn nhỏ phía trên tiêu đề (Eyebrow text)</span>
              <input
                name="hero_eyebrow"
                defaultValue={content.hero_eyebrow || ""}
                placeholder="VD: CỬA CUỐN AN TÂM 24H · UY TÍN TẠI TP.HCM"
              />
            </label>

            <label>
              <span>Tiêu đề chính</span>
              <input
                name="hero_title"
                defaultValue={content.hero_title || ""}
                placeholder="VD: Cửa cuốn bền êm, an toàn tuyệt đối"
              />
            </label>

            <label>
              <span>Dòng chữ nhấn mạnh màu nổi</span>
              <input
                name="hero_emphasis"
                defaultValue={content.hero_emphasis || ""}
                placeholder="VD: Lắp đặt siêu tốc trong 24 giờ"
              />
            </label>

            <label className="full">
              <span>Đoạn mô tả phụ</span>
              <textarea
                name="hero_description"
                rows={3}
                defaultValue={content.hero_description || ""}
                placeholder="Mô tả tóm tắt dịch vụ, bảo hành, cam kết chất lượng của thương hiệu..."
              />
            </label>

            <label>
              <span>Nhãn nút kêu gọi hành động (CTA Button)</span>
              <input
                name="hero_cta_label"
                defaultValue={content.hero_cta_label || ""}
                placeholder="VD: Nhận báo giá ngay"
              />
            </label>
          </div>
        </section>

        {/* Giới thiệu catalog */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Khu vực danh mục & sản phẩm</span>
              <h2>Tiêu đề giới thiệu Catalog</h2>
            </div>
          </div>

          <div className="admin-fields">
            <label>
              <span>Tiêu đề phần sản phẩm</span>
              <input
                name="intro_title"
                defaultValue={content.intro_title || ""}
                placeholder="VD: Các dòng cửa cuốn công nghệ Đức & Úc cao cấp"
              />
            </label>

            <label>
              <span>Mô tả chi tiết</span>
              <textarea
                name="intro_text"
                rows={3}
                defaultValue={content.intro_text || ""}
                placeholder="Giới thiệu về độ bền, tiêu chuẩn nan nhôm, tính năng chống trộm..."
              />
            </label>
          </div>
        </section>

        {/* Floating Save */}
        <div className="admin-sticky-save">
          <span>✓ Trang chủ sẽ tự động làm mới nội dung ngay sau khi lưu.</span>
          <button className="button button-primary">
            <Save size={18} />
            <span>Lưu nội dung trang chủ</span>
          </button>
        </div>
      </form>
    </>
  );
}

