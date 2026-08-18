import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu đội ngũ, quy trình và cam kết phục vụ trong lĩnh vực cửa cuốn.",
  alternates: { canonical: "/ve-chung-toi" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Câu chuyện của chúng tôi"
        title="Tận tâm trong từng công trình."
        description="Từ một yêu cầu sửa chữa nhỏ đến hệ cửa cho nhà xưởng, chúng tôi luôn bắt đầu bằng khảo sát rõ ràng và kết thúc bằng bàn giao minh bạch."
        image="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=82"
      />
      <section className="section about-intro">
        <div className="container about-intro-grid">
          <div><span className="kicker">Triết lý phục vụ</span><h2>Giải pháp tốt phải an toàn, phù hợp và bền lâu.</h2></div>
          <div><p>Chúng tôi không chỉ xử lý lỗi trước mắt. Mỗi hạng mục đều được xem xét theo tải cửa, tần suất vận hành, điều kiện công trình và nhu cầu thực tế của khách hàng.</p><p>Đội ngũ ưu tiên giải thích dễ hiểu, thống nhất chi phí trước khi làm và hướng dẫn sử dụng sau khi bàn giao.</p></div>
        </div>
      </section>
      <section className="about-image-band">
        <div className="container about-image-grid">
          <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=82" alt="Kỹ thuật viên kiểm tra thiết bị" />
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82" alt="Công trình cửa cuốn công nghiệp" />
        </div>
      </section>
      <section className="section about-values-section">
        <div className="container">
          <div className="lovable-section-heading"><span>Điều chúng tôi theo đuổi</span><h2>Giá trị cốt lõi</h2></div>
          <div className="about-values-grid">
            <article><Wrench /><span>01</span><h3>Đúng kỹ thuật</h3><p>Khảo sát hiện trạng, xác định nguyên nhân và lựa chọn giải pháp phù hợp với từng hệ cửa.</p></article>
            <article><ShieldCheck /><span>02</span><h3>Minh bạch</h3><p>Giải thích hạng mục, báo giá trước khi thực hiện và nêu rõ chính sách bảo hành.</p></article>
            <article><Sparkles /><span>03</span><h3>Tận tâm</h3><p>Thi công gọn gàng, chạy thử đầy đủ và tiếp tục hỗ trợ sau khi công trình hoàn tất.</p></article>
          </div>
        </div>
      </section>
      <section className="section about-process-section">
        <div className="container about-process-grid">
          <div><span className="kicker">Quy trình làm việc</span><h2>Rõ ràng từ tiếp nhận đến bảo hành.</h2></div>
          <ol>
            {[
              "Tiếp nhận thông tin và hình ảnh hiện trạng",
              "Khảo sát, tư vấn giải pháp phù hợp",
              "Thống nhất vật tư, chi phí và tiến độ",
              "Thi công, chạy thử và nghiệm thu",
              "Bàn giao hướng dẫn và chính sách bảo hành",
            ].map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span><CheckCircle2 /></li>)}
          </ol>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
