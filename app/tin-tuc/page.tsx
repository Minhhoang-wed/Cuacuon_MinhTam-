import type { Metadata } from "next";
import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getArticles } from "@/lib/catalog";
import { publicAssetUrl } from "@/lib/supabase-rest";

export const metadata: Metadata = {
  title: "Tin tức & hướng dẫn",
  description: "Kiến thức sử dụng, an toàn và bảo trì cửa cuốn cho gia đình và cửa hàng.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHero
        eyebrow="GÓC SỬ DỤNG AN TOÀN"
        title="Tin Tức & Cẩm Nang Cửa Cuốn"
        description="Hướng dẫn ngắn gọn để nhận biết sự cố, bảo trì đúng cách và đảm bảo an toàn tối đa cho gia đình."
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=82"
      />
      <section className="section">
        <div className="container">
          {articles.length > 0 ? (
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
          ) : (
            <div className="empty-state" style={{ padding: "48px 24px", background: "var(--bg-card)", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ margin: 0, color: "#78716c", fontSize: "15px" }}>
                Chuyên mục tin tức đang được cập nhật các bài viết mới.
              </p>
            </div>
          )}
        </div>
      </section>
      <CtaBand compact />
    </>
  );
}
