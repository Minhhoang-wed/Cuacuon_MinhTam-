import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Clock3, MessageCircle, Phone, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBand } from "@/components/cta-band";
import { getArticleBySlug, getArticles, getSiteSettings } from "@/lib/catalog";
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
    title: `${item.title} — Mẹo & Kiến Thức Cửa Cuốn`,
    description: item.excerpt,
    alternates: { canonical: `/tin-tuc/${slug}` },
    openGraph: { type: "article", title: item.title, description: item.excerpt, images: [image] },
    twitter: { card: "summary_large_image", title: item.title, description: item.excerpt, images: [image] },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, allArticles, site] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
    getSiteSettings(),
  ]);
  if (!item) notFound();

  const otherArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 3);
  const articleImage = item.imageUrl ? publicAssetUrl(item.imageUrl) || item.imageUrl : "/og.png";
  const baseUrl = site.seoCanonicalBase || site.baseUrl;

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
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Mẹo & Kiến thức", item: `${baseUrl}/meo-kien-thuc` },
      { "@type": "ListItem", position: 3, name: item.title, item: `${baseUrl}/tin-tuc/${slug}` },
    ],
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Minimalist Single-Column Article Reader ── */}
      <main className="container" style={{ maxWidth: "780px", padding: "36px 20px 60px" }}>
        {/* Back Link */}
        <Link
          href="/meo-kien-thuc"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#0f5fd7",
            fontSize: "13.5px",
            fontWeight: 600,
            marginBottom: "18px",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          <ArrowLeft size={15} /> Quay lại Mẹo & Kiến thức
        </Link>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(26px, 4.5vw, 36px)",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#0a2540",
            margin: "0 0 16px",
            letterSpacing: "-0.015em",
          }}
        >
          {item.title}
        </h1>

        {/* Meta Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "13px",
            color: "#64748b",
            flexWrap: "wrap",
            paddingBottom: "18px",
            marginBottom: "24px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#0f172a", fontWeight: 600 }}>
            <User size={14} color="#0f5fd7" /> Cửa Cuốn Minh Tâm
          </span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <Calendar size={14} color="#64748b" /> {item.publishedAt}
          </span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <Clock3 size={14} color="#64748b" /> {item.readTime} đọc
          </span>
        </div>

        {/* Sapo / Lead Excerpt */}
        {item.excerpt && (
          <div
            style={{
              borderLeft: "3.5px solid #0f5fd7",
              paddingLeft: "16px",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#1e293b",
              fontWeight: 500,
              fontStyle: "italic",
              margin: "0 0 28px",
              background: "linear-gradient(90deg, rgba(15,95,215,0.03) 0%, transparent 100%)",
              padding: "12px 16px",
              borderRadius: "0 8px 8px 0",
            }}
          >
            {item.excerpt}
          </div>
        )}

        {/* Featured Image */}
        {item.imageUrl && (
          <div
            style={{
              marginBottom: "32px",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
              background: "#f8fafc",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicAssetUrl(item.imageUrl) || item.imageUrl}
              alt={item.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "460px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Article Body Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontSize: "16.5px", lineHeight: "1.85", color: "#334155" }}>
          {item.content.map((paragraph, index) => (
            <p key={index} style={{ margin: 0, wordBreak: "break-word", overflowWrap: "break-word" }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Safety Notice Callout */}
        <div
          style={{
            marginTop: "36px",
            padding: "18px 20px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderLeft: "4px solid #f59e0b",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "14.5px", lineHeight: "1.65", color: "#92400e" }}>
            <b style={{ color: "#78350f" }}>Lưu ý an toàn:</b> Ngắt nguồn điện khi có nguy cơ chập cháy, và tuyệt đối không đứng dưới thân cửa đang có dấu hiệu kẹt nghiêng hoặc xô lệch trước khi kỹ thuật viên đến hỗ trợ.
          </div>
        </div>

        {/* Quick Hotline Consultation Card */}
        <div
          style={{
            marginTop: "40px",
            padding: "24px 22px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#0a2540" }}>
              Cần hỗ trợ kỹ thuật hoặc sửa cửa cuốn tận nơi?
            </h4>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b" }}>
              Đội thợ kỹ thuật Minh Tâm có mặt sau 15 – 30 phút tại tất cả các quận TP.HCM.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a
              href={`tel:${(site.hotline || "0327359368").replace(/\s+/g, "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#0a2540",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              <Phone size={14} /> Gọi Hotline
            </a>
            <a
              href={site.zaloHref || "https://zalo.me/"}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "#0068ff",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              <MessageCircle size={14} /> Chat Zalo
            </a>
          </div>
        </div>

        {/* ── 3. Other Recommended Articles ── */}
        {otherArticles.length > 0 && (
          <section style={{ marginTop: "56px", paddingTop: "36px", borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#0a2540" }}>
                Bài viết & Mẹo khác
              </h3>
              <Link
                href="/meo-kien-thuc"
                style={{ fontSize: "13.5px", color: "#0f5fd7", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
              {otherArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/tin-tuc/${art.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    overflow: "hidden",
                    textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  }}
                  className="related-article-card"
                >
                  {art.imageUrl ? (
                    <div style={{ height: "130px", overflow: "hidden", background: "#0f172a" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicAssetUrl(art.imageUrl) || art.imageUrl}
                        alt={art.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: "130px", background: "linear-gradient(135deg, #0a2540 0%, #1e40af 100%)", display: "grid", placeItems: "center", color: "#93c5fd", padding: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{art.category}</span>
                    </div>
                  )}
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", marginBottom: "4px" }}>
                      {art.category}
                    </span>
                    <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "#0a2540", lineHeight: 1.4 }}>
                      {art.title}
                    </h4>
                    <span style={{ marginTop: "auto", fontSize: "12px", color: "#94a3b8" }}>
                      {art.publishedAt}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── 4. CTA Band ── */}
      <CtaBand compact />
    </div>
  );
}
