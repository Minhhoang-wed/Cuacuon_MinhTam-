import type { Metadata } from "next";
import { ArrowRight, Clock3, FileText, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { repairTips } from "@/data/public-home";
import { getArticles, getSiteSettings } from "@/lib/catalog";
import { publicAssetUrl } from "@/lib/supabase-rest";

export const metadata: Metadata = {
  title: "Mẹo & Kiến Thức Cửa Cuốn",
  description: "Cẩm nang hướng dẫn sử dụng, nhận biết lỗi, xử lý an toàn và bảo dưỡng cửa cuốn bền đẹp.",
  alternates: { canonical: "/meo-kien-thuc" },
};

export default async function TipsAndKnowledgePage() {
  const [articles, site] = await Promise.all([getArticles(), getSiteSettings()]);

  return (
    <>
      <PageHero
        title="Mẹo & Kiến Thức Sử Dụng Cửa Cuốn"
        description="Tổng hợp các kinh nghiệm nhận biết sự cố, mẹo vận hành an toàn và cách bảo trì cửa cuốn bền đẹp dài lâu."
        image="/images/tips-hero-banner.jpg"
      />

      <div className="container">
        <Breadcrumb
          items={[{ name: "Mẹo & Kiến thức", href: "/meo-kien-thuc" }]}
          baseUrl={site.seoCanonicalBase || site.baseUrl}
        />
      </div>

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                {article.imageUrl ? (
                  <div
                    className="article-cover"
                    style={{
                      padding: 0,
                      backgroundImage: `url(${publicAssetUrl(article.imageUrl) || article.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <span style={{ position: "relative", zIndex: 2 }}>{article.category}</span>
                    <b style={{ position: "relative", zIndex: 2 }}>{String(index + 1).padStart(2, "0")}</b>
                  </div>
                ) : (
                  <div className={`article-cover tone-${(index % 4) + 1}`}>
                    <span>{article.category}</span>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                  </div>
                )}
                <div className="article-body">
                  <div className="card-meta">
                    <span>{article.publishedAt}</span>
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
