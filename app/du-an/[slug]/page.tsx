import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { getProjectBySlug, getProjects } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getProjectBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.name} — Dự án hoàn thành`,
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
  const item = await getProjectBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <section className="detail-hero">
        <div className="container detail-hero-grid">
          <div>
            <Link href="/du-an" className="back-link">
              <ArrowLeft size={16} /> Tất cả dự án
            </Link>
            <span className="kicker">{item.category}</span>
            <h1>{item.name}</h1>
            <p className="project-location">
              <MapPin size={16} /> {item.location}
            </p>
            <p>{item.summary}</p>
          </div>

          {item.images?.[0]?.url ? (
            <div style={{ width: "100%", height: 380, position: "relative", overflow: "hidden", borderRadius: 16 }}>
              <img
                src={item.images[0].url}
                alt={item.images[0].altText || item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <DoorVisual label={item.category} kind="project" accent={item.accent} />
          )}
        </div>
      </section>

      {item.description ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ background: "var(--bg-card)", padding: "36px", borderRadius: 16, border: "1px solid var(--border-color)", lineHeight: 1.8 }}>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Chi tiết quá trình thi công</h2>
              <div style={{ whiteSpace: "pre-line", color: "var(--text-body)" }}>
                {item.description}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Thư viện ảnh công trình nếu có > 1 ảnh */}
      {item.images && item.images.length > 1 ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Hình ảnh thực tế công trình</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {item.images.map((img, idx) => (
                <div key={img.id || idx} style={{ height: 220, borderRadius: 12, overflow: "hidden" }}>
                  <img
                    src={img.url || ""}
                    alt={img.altText || item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container story-panel">
          <span className="story-index">KẾT QUẢ</span>
          <div>
            <h2>{item.result || "Hoàn tất bàn giao đúng tiến độ, vận hành êm ái."}</h2>
            <p>Toàn bộ thiết bị và vật tư được kiểm tra nghiêm ngặt trước khi bàn giao cho chủ đầu tư.</p>
            <span className="result-chip">
              <CheckCircle2 size={16} /> Đã nghiệm thu & bàn giao
            </span>
          </div>
        </div>
      </section>

      <CtaBand compact />
    </>
  );
}

