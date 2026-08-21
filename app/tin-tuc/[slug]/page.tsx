import type { Metadata } from "next";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { getArticleBySlug, getArticles } from "@/lib/catalog";
import { publicAssetUrl } from "@/lib/supabase-rest";

export async function generateStaticParams() {
  const list = await getArticles();
  return list.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArticleBySlug(slug);
  if (!item) return {};
  const image = item.imageUrl ? publicAssetUrl(item.imageUrl) || item.imageUrl : "/og.png";
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/tin-tuc/${slug}` },
    openGraph: { type: "article", title: item.title, description: item.excerpt, images: [image] },
    twitter: { card: "summary_large_image", title: item.title, description: item.excerpt, images: [image] },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getArticleBySlug(slug);
  if (!item) notFound();

  const articleImage = item.imageUrl ? publicAssetUrl(item.imageUrl) || item.imageUrl : "/og.png";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    image: articleImage,
    datePublished: item.publishedAt,
    author: {
      "@type": "Organization",
      name: "Minh Tâm Door",
    },
    publisher: {
      "@type": "Organization",
      name: "Cửa Cuốn Minh Tâm 24H",
      logo: {
        "@type": "ImageObject",
        url: "/logo/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/tin-tuc/${slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: "/" },
      { "@type": "ListItem", position: 2, name: "Tin tức & Cẩm nang", item: "/tin-tuc" },
      { "@type": "ListItem", position: 3, name: item.title, item: `/tin-tuc/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article>
        <header className="article-hero">
          <div className="narrow-container">
            <Link href="/tin-tuc" className="back-link">
              <ArrowLeft /> Tất cả bài viết
            </Link>
            <span className="kicker">{item.category}</span>
            <h1>{item.title}</h1>
            <p>{item.excerpt}</p>
            <div className="article-meta">
              <span>{item.publishedAt}</span>
              <span><Clock3 /> {item.readTime} đọc</span>
            </div>
          </div>
        </header>

        <div className="narrow-container prose">
          {item.imageUrl && (
            <div style={{ marginBottom: "32px", borderRadius: "12px", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicAssetUrl(item.imageUrl) || item.imageUrl}
                alt={item.title}
                style={{ width: "100%", maxHeight: "480px", objectFit: "cover" }}
              />
            </div>
          )}

          {item.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div className="content-note">
            <p>
              <b>Lưu ý an toàn:</b> Ngắt nguồn khi có nguy cơ chập điện và không đứng dưới thân cửa đang lệch hoặc có dấu hiệu rơi.
            </p>
          </div>
        </div>
      </article>
      <CtaBand compact />
    </>
  );
}
