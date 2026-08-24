import type { Metadata } from "next";
import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getArticles, getSiteSettings } from "@/lib/catalog";
import { publicAssetUrl } from "@/lib/supabase-rest";

export const metadata: Metadata = {
  title: "Tin tức & hướng dẫn",
  description: "Kiến thức sử dụng, an toàn và bảo trì cửa cuốn cho gia đình và cửa hàng.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function NewsPage() {
  const [articles, site] = await Promise.all([getArticles(), getSiteSettings()]);

  return (
    <>
      <PageHero
        eyebrow="GÓC SỬ DỤNG AN TOÀN"
        title="Tin Tức & Cẩm Nang Cửa Cuốn"
        description="Hướng dẫn ngắn gọn để nhận biết sự cố, bảo trì đúng cách và đảm bảo an toàn tối đa cho gia đình."
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=82"
      />

      <div className="container">
        <Breadcrumb
          items={[{ name: "Tin tức & Hướng dẫn", href: "/tin-tuc" }]}
          baseUrl={site.seoCanonicalBase || site.baseUrl}
        />
      </div>

      <section className="section">
        <div className="container">
          {articles.length > 0 ? (
            <div className="article-grid">
              {articles.map((article) => (
                <article className="article-card" key={article.slug}>
                  <Link href={`/tin-tuc/${article.slug}`} className="article-card-media">
                    {article.imageUrl ? (
                      <img
                        src={publicAssetUrl(article.imageUrl) || article.imageUrl}
                        alt={article.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="article-card-placeholder">
                        <span>{article.category || "Cẩm nang"}</span>
                      </div>
                    )}
                  </Link>

                  <div className="article-card-body">
                    <div className="article-card-meta">
                      <span>{article.publishedAt}</span>
                      <span>·</span>
                      <span><Clock3 size={13} /> {article.readTime} đọc</span>
                    </div>
                    <h3>
                      <Link href={`/tin-tuc/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    {article.excerpt && <p>{article.excerpt}</p>}
                    <Link href={`/tin-tuc/${article.slug}`} className="article-card-link">
                      Đọc bài viết <ArrowRight size={15} />
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
