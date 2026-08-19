import type { Metadata } from "next";
import { ArrowRight, Clock3, FileText, Lightbulb } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { articles } from "@/data/content";
import { repairTips } from "@/data/public-home";

export const metadata: Metadata = {
  title: "Mẹo & Kiến Thức Cửa Cuốn",
  description: "Cẩm nang hướng dẫn sử dụng, nhận biết lỗi, xử lý an toàn và bảo dưỡng cửa cuốn bền đẹp.",
  alternates: { canonical: "/meo-kien-thuc" },
};

export default function TipsAndKnowledgePage() {
  return (
    <>
      <PageHero
        eyebrow="Cẩm nang hữu ích"
        title="Mẹo & Kiến Thức Sử Dụng Cửa Cuốn"
        description="Tổng hợp các kinh nghiệm nhận biết sự cố, mẹo vận hành an toàn và cách bảo trì cửa cuốn bền đẹp dài lâu."
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=82"
      />

      {/* 3 Mẹo thực tế nổi bật */}
      <section className="repair-section repair-tips-section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="repair-section-heading">
            <span>Kinh nghiệm thực tế</span>
            <h2>Những lưu ý quan trọng khi dùng cửa cuốn</h2>
            <p>Các gợi ý nhận biết sự cố và kiểm tra an toàn cơ bản trước khi cần kỹ thuật viên hỗ trợ.</p>
          </div>
          <div className="repair-tip-grid">
            {repairTips.map((tip) => (
              <article className="repair-tip-card" key={tip.title}>
                <img src={tip.image} alt={tip.title} />
                <div>
                  <span>{tip.tag}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bài viết chi tiết */}
      <section className="section" style={{ background: "var(--bg-stone)" }}>
        <div className="container">
          <div className="repair-section-heading">
            <span>Bài viết & Hướng dẫn</span>
            <h2>Chuyên mục bài viết chi tiết</h2>
            <p>Kiến thức chuyên sâu về motor, bình lưu điện, remote và phụ kiện cửa cuốn.</p>
          </div>

          <div className="article-grid">
            {articles.map((article, index) => (
              <article className="article-card" key={article.slug}>
                <div className={`article-cover tone-${index + 1}`}>
                  <span>{article.category}</span>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                </div>
                <div className="article-body">
                  <div className="card-meta">
                    <span>{article.date}</span>
                    <span><Clock3 size={13} /> {article.readTime}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                  <Link href={`/tin-tuc/${article.slug}`} className="text-link">
                    Đọc bài viết <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand compact />
    </>
  );
}
