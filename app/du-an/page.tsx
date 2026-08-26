import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock, MapPin, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBand } from "@/components/cta-band";
import { getProjects, getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Dự án thi công cửa cuốn thực tế | Minh Tâm Door",
  description:
    "Tổng hợp hình ảnh các công trình sửa chữa, thay thế motor và lắp đặt cửa cuốn thực tế do Minh Tâm Door hoàn thiện bàn giao tại TP.HCM & Hà Nội.",
  alternates: { canonical: "/du-an" },
};

export default async function ProjectsPage() {
  const [projects, site] = await Promise.all([getProjects(), getSiteSettings()]);

  return (
    <>
      <div className="container" style={{ paddingTop: 24 }}>
        <Breadcrumb
          items={[{ name: "Dự án thi công", href: "/du-an" }]}
          baseUrl={site.seoCanonicalBase || site.baseUrl}
        />
      </div>

      <section className="repair-area-band" style={{ paddingTop: 20, paddingBottom: 80 }}>
        <div className="container">
          <div className="repair-section-heading" style={{ marginBottom: 36 }}>
            <span>Hồ sơ năng lực & Công trình</span>
            <h2>Các dự án tiêu biểu đã bàn giao ({projects.length})</h2>
            <p>Minh Tâm Door cam kết chất lượng vật tư chính hãng 100%, thi công an toàn và bảo hành dài hạn.</p>
          </div>

          {projects.length > 0 ? (
            <div className="direct-stores-grid" style={{ gap: 28 }}>
              {projects.map((project) => (
                <article
                  className="direct-store-card"
                  key={project.id || project.slug}
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 0,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {/* Ảnh dự án */}
                  <div style={{ position: "relative", width: "100%", height: 250, overflow: "hidden", background: "#0a2540", borderRadius: 0 }}>
                    <img
                      src={project.images?.[0]?.url || "/images/home-hero-daylight.jpg"}
                      alt={project.images?.[0]?.altText || project.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        background: "rgba(10, 37, 64, 0.85)",
                        backdropFilter: "blur(6px)",
                        color: "#ffffff",
                        padding: "4px 10px",
                        borderRadius: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {project.category || "Công trình thực tế"}
                    </div>
                  </div>

                  {/* Nội dung card */}
                  <div style={{ padding: "24px 26px", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0f5fd7", fontSize: 13, fontWeight: 600 }}>
                      <MapPin size={15} />
                      <span>{project.location}</span>
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "var(--font-heading), 'Be Vietnam Pro', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        color: "#0a2540",
                        lineHeight: 1.4,
                      }}
                    >
                      <Link
                        href={`/du-an/${project.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {project.name}
                      </Link>
                    </h3>

                    <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.6, flex: 1 }}>
                      {project.summary}
                    </p>

                    <div
                      style={{
                        marginTop: 10,
                        paddingTop: 16,
                        borderTop: "1px dashed #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#16a34a", fontWeight: 600 }}>
                        <CheckCircle2 size={16} /> {project.result || "Đã nghiệm thu"}
                      </span>

                      <Link
                        href={`/du-an/${project.slug}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#0f5fd7",
                          fontSize: 13.5,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Chi tiết <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="repair-area-panel" style={{ textAlign: "center", padding: "60px 24px" }}>
              <Wrench size={40} style={{ color: "#0f5fd7", margin: "0 auto 16px" }} />
              <h3 style={{ margin: "0 0 8px", color: "#0a2540", fontSize: 18, fontWeight: 700 }}>
                Hồ sơ dự án đang được cập nhật
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                Quý khách có thể liên hệ trực tiếp hotline {site.hotline} để nhận tư vấn và xem catalogue công trình mẫu.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand compact />
    </>
  );
}


