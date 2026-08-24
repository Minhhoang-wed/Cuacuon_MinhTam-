import { CheckCircle2, ExternalLink, Info, ListOrdered, Save, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { saveAboutContent } from "@/lib/admin-actions";
import { getAdminAboutContent } from "@/lib/admin-data";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const content = await getAdminAboutContent();
  const saved = (await searchParams).saved;

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã cập nhật và xuất bản nội dung Trang Giới Thiệu thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Quản lý Nội dung</span>
          <h1>Chỉnh sửa Trang Giới Thiệu</h1>
          <p>Tùy chỉnh thông điệp đầu trang, triết lý phục vụ, 3 giá trị cốt lõi và 5 bước quy trình làm việc.</p>
        </div>
        <Link href="/ve-chung-toi" target="_blank" className="button button-ghost">
          <ExternalLink size={16} />
          <span>Xem trang thực tế</span>
        </Link>
      </header>

      <form action={saveAboutContent} className="admin-form">
        {/* 1. Banner đầu trang (Hero Section) */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Phần 1</span>
              <h2>Banner đầu trang (Hero Section)</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label className="full">
              <span>Tiêu đề lớn đầu trang</span>
              <input
                name="hero_title"
                defaultValue={content.hero_title || ""}
                placeholder="VD: Tận tâm trong từng công trình."
              />
            </label>

            <label className="full">
              <span>Đoạn mô tả phụ dưới tiêu đề</span>
              <textarea
                name="hero_description"
                rows={3}
                defaultValue={content.hero_description || ""}
                placeholder="Mô tả tóm tắt cam kết và định vị phục vụ của thương hiệu..."
              />
            </label>

            <label className="full">
              <span>Đường dẫn ảnh nền Banner (URL hoặc đường dẫn nội bộ)</span>
              <input
                name="hero_image"
                defaultValue={content.hero_image || ""}
                placeholder="VD: /images/about-hero-banner.jpg"
              />
            </label>
          </div>
        </section>

        {/* 2. Triết lý phục vụ */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Phần 2</span>
              <h2>Triết lý phục vụ & Năng lực</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Nhãn nhỏ (Kicker text)</span>
              <input
                name="philosophy_kicker"
                defaultValue={content.philosophy_kicker || ""}
                placeholder="VD: Triết lý phục vụ"
              />
            </label>

            <label className="full">
              <span>Tiêu đề triết lý</span>
              <input
                name="philosophy_title"
                defaultValue={content.philosophy_title || ""}
                placeholder="VD: Giải pháp tốt phải an toàn, phù hợp và bền lâu."
              />
            </label>

            <label className="full">
              <span>Đoạn văn giới thiệu 1</span>
              <textarea
                name="philosophy_text_1"
                rows={3}
                defaultValue={content.philosophy_text_1 || ""}
                placeholder="Nội dung đoạn văn thứ 1..."
              />
            </label>

            <label className="full">
              <span>Đoạn văn giới thiệu 2</span>
              <textarea
                name="philosophy_text_2"
                rows={3}
                defaultValue={content.philosophy_text_2 || ""}
                placeholder="Nội dung đoạn văn thứ 2..."
              />
            </label>
          </div>
        </section>

        {/* 3. Bộ ảnh hoạt động thực tế */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Phần 3</span>
              <h2>Bộ 2 ảnh hoạt động thực tế</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label>
              <span>Ảnh thực tế 1 (Kỹ thuật viên / Xưởng)</span>
              <input
                name="image_1_url"
                defaultValue={content.image_1_url || ""}
                placeholder="VD: https://images.unsplash.com/..."
              />
            </label>

            <label>
              <span>Ảnh thực tế 2 (Công trình / Thiết bị)</span>
              <input
                name="image_2_url"
                defaultValue={content.image_2_url || ""}
                placeholder="VD: https://images.unsplash.com/..."
              />
            </label>
          </div>
        </section>

        {/* 4. Giá trị cốt lõi */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Phần 4</span>
              <h2>3 Giá trị cốt lõi</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label className="full">
              <span>Tiêu đề mục giá trị</span>
              <input
                name="values_heading"
                defaultValue={content.values_heading || "Giá trị cốt lõi"}
                placeholder="VD: Giá trị cốt lõi"
              />
            </label>

            {/* Giá trị 01 */}
            <label>
              <span>01. Tiêu đề giá trị</span>
              <input
                name="value_1_title"
                defaultValue={content.value_1_title || "Đúng kỹ thuật"}
                placeholder="VD: Đúng kỹ thuật"
              />
            </label>
            <label>
              <span>01. Mô tả chi tiết</span>
              <textarea
                name="value_1_text"
                rows={2}
                defaultValue={content.value_1_text || ""}
                placeholder="Mô tả giá trị 1..."
              />
            </label>

            {/* Giá trị 02 */}
            <label>
              <span>02. Tiêu đề giá trị</span>
              <input
                name="value_2_title"
                defaultValue={content.value_2_title || "Minh bạch"}
                placeholder="VD: Minh bạch"
              />
            </label>
            <label>
              <span>02. Mô tả chi tiết</span>
              <textarea
                name="value_2_text"
                rows={2}
                defaultValue={content.value_2_text || ""}
                placeholder="Mô tả giá trị 2..."
              />
            </label>

            {/* Giá trị 03 */}
            <label>
              <span>03. Tiêu đề giá trị</span>
              <input
                name="value_3_title"
                defaultValue={content.value_3_title || "Tận tâm"}
                placeholder="VD: Tận tâm"
              />
            </label>
            <label>
              <span>03. Mô tả chi tiết</span>
              <textarea
                name="value_3_text"
                rows={2}
                defaultValue={content.value_3_text || ""}
                placeholder="Mô tả giá trị 3..."
              />
            </label>
          </div>
        </section>

        {/* 5. Quy trình làm việc 5 bước */}
        <section className="admin-form-card">
          <div className="admin-form-section-title">
            <div>
              <span>Phần 5</span>
              <h2>Quy trình làm việc 5 bước</h2>
            </div>
          </div>

          <div className="admin-fields two">
            <label className="full">
              <span>Tiêu đề mục quy trình</span>
              <input
                name="process_heading"
                defaultValue={content.process_heading || "Rõ ràng từ tiếp nhận đến bảo hành."}
                placeholder="VD: Rõ ràng từ tiếp nhận đến bảo hành."
              />
            </label>

            <label className="full">
              <span>Bước 01</span>
              <input
                name="process_step_1"
                defaultValue={content.process_step_1 || "Tiếp nhận thông tin và hình ảnh hiện trạng"}
                placeholder="Nội dung bước 1..."
              />
            </label>

            <label className="full">
              <span>Bước 02</span>
              <input
                name="process_step_2"
                defaultValue={content.process_step_2 || "Khảo sát, tư vấn giải pháp phù hợp"}
                placeholder="Nội dung bước 2..."
              />
            </label>

            <label className="full">
              <span>Bước 03</span>
              <input
                name="process_step_3"
                defaultValue={content.process_step_3 || "Thống nhất vật tư, chi phí và tiến độ"}
                placeholder="Nội dung bước 3..."
              />
            </label>

            <label className="full">
              <span>Bước 04</span>
              <input
                name="process_step_4"
                defaultValue={content.process_step_4 || "Thi công, chạy thử và nghiệm thu"}
                placeholder="Nội dung bước 4..."
              />
            </label>

            <label className="full">
              <span>Bước 05</span>
              <input
                name="process_step_5"
                defaultValue={content.process_step_5 || "Bàn giao hướng dẫn và chính sách bảo hành"}
                placeholder="Nội dung bước 5..."
              />
            </label>
          </div>
        </section>

        {/* Floating Save Button */}
        <div className="admin-sticky-save">
          <span>✓ Nội dung sẽ được cập nhật tức thì lên trang Giới thiệu (/ve-chung-toi).</span>
          <button className="button button-primary">
            <Save size={18} />
            <span>Lưu nội dung giới thiệu</span>
          </button>
        </div>
      </form>
    </>
  );
}
