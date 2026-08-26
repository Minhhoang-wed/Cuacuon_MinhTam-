import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Clock, MapPin, MessageCircle, Phone, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBand } from "@/components/cta-band";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getProjectBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.name} | Dự án Minh Tâm Door`,
    description: item.summary,
    alternates: { canonical: `/du-an/${slug}` },
    openGraph: {
      title: item.name,
      description: item.summary,
      images: item.images?.[0]?.url ? [item.images[0].url] : ["/og.png"],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, site] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!item) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: site.baseUrl },
      { "@type": "ListItem", position: 2, name: "Dự án thi công", item: `${site.baseUrl.replace(/\/$/, "")}/du-an` },
      { "@type": "ListItem", position: 3, name: item.name, item: `${site.baseUrl.replace(/\/$/, "")}/du-an/${item.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container" style={{ paddingTop: 20 }}>
        <Breadcrumb
          items={[
            { name: "Dự án thi công", href: "/du-an" },
            { name: item.name, href: `/du-an/${item.slug}` },
          ]}
          baseUrl={site.seoCanonicalBase || site.baseUrl}
        />
      </div>

      <section className="repair-area-band" style={{ paddingTop: 20, paddingBottom: 60 }}>
        <div className="container">
          <Link
            href="/du-an"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: "#0f5fd7",
              textDecoration: "none",
              marginBottom: 20,
            }}
          >
            <ArrowLeft size={16} /> Quay lại danh sách dự án
          </Link>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 0,
              border: "1px solid #edf2f7",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Header thông tin dự án */}
            <div style={{ padding: "36px 40px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "4px 10px",
                    borderRadius: 0,
                    fontSize: 12.5,
                    fontWeight: 700,
                  }}
                >
                  {item.category || "Dự án thi công"}
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13.5 }}>
                  <MapPin size={15} color="#0f5fd7" /> {item.location}
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#16a34a", fontSize: 13.5, fontWeight: 600 }}>
                  <CheckCircle2 size={15} /> Đã hoàn thành bàn giao
                </span>
              </div>

              <h1
                style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(22px, 3vw, 30px)",
                  fontWeight: 700,
                  fontFamily: "var(--font-heading), 'Be Vietnam Pro', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  color: "#0a2540",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.name}
              </h1>

              <p style={{ margin: 0, fontSize: 16, color: "#475569", lineHeight: 1.65 }}>
                {item.summary}
              </p>
            </div>

            {/* Ảnh chính dự án */}
            {item.images?.[0]?.url && (
              <div style={{ width: "100%", maxHeight: 520, overflow: "hidden", background: "#0a2540", borderRadius: 0 }}>
                <img
                  src={item.images[0].url}
                  alt={item.images[0].altText || item.name}
                  style={{ width: "100%", height: "100%", maxHeight: 520, objectFit: "cover" }}
                />
              </div>
            )}

            {/* Nội dung chi tiết */}
            <div style={{ padding: "40px" }}>
              {item.description && (
                <div style={{ marginBottom: 36 }}>
                  <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#0a2540" }}>
                    Quá trình triển khai & Giải pháp kỹ thuật
                  </h2>
                  <div
                    style={{
                      fontSize: 15.5,
                      lineHeight: 1.8,
                      color: "#334155",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              )}

              {/* Thư viện ảnh nếu có nhiều ảnh */}
              {item.images && item.images.length > 1 && (
                <div style={{ marginBottom: 36 }}>
                  <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#0a2540" }}>
                    Hình ảnh bàn giao công trình
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
                    {item.images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        style={{
                          height: 240,
                          borderRadius: 0,
                          overflow: "hidden",
                          border: "1px solid #e2e8f0",
                          background: "#0a2540",
                        }}
                      >
                        <img
                          src={img.url || ""}
                          alt={img.altText || item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kết quả bàn giao */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 0,
                  padding: "24px 28px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 0,
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    display: "grid",
                    placeItems: "center",
                    color: "#059669",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#0a2540" }}>
                    Kết quả bàn giao: {item.result || "Nghiệm thu đạt chuẩn 100%"}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.55 }}>
                    Công trình được kiểm tra vận hành đầy đủ chu kỳ, bảo hành trực tiếp từ kỹ thuật Minh Tâm Door.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand compact />
    </>
  );
}

