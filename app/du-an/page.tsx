import type { Metadata } from "next";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { PageHero } from "@/components/page-hero";
import { getProjects } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Dự án đã thực hiện",
  description: "Một số công trình sửa chữa, bảo trì và lắp đặt cửa cuốn tiêu biểu.",
  alternates: { canonical: "/du-an" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="CÔNG TRÌNH TIÊU BIỂU"
        title="Dự Án Đã Thực Hiện"
        description="Mỗi bộ cửa là một giải pháp an toàn và hoàn thiện chỉn chu cho không gian sống và kinh doanh của bạn."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=82"
      />
      <section className="section">
        <div className="container">
          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.slug}>
                  {project.images?.[0]?.url ? (
                    <div style={{ width: "100%", height: 260, position: "relative", overflow: "hidden", borderRadius: 12, marginBottom: 20 }}>
                      <img
                        src={project.images[0].url}
                        alt={project.images[0].altText || project.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      />
                    </div>
                  ) : (
                    <DoorVisual label={project.category} kind="project" accent={project.accent} />
                  )}
                  <div>
                    <span className="product-category">{project.category}</span>
                    <h2>{project.name}</h2>
                    <p className="project-location">
                      <MapPin size={14} /> {project.location}
                    </p>
                    <p>{project.summary}</p>
                    <Link href={`/du-an/${project.slug}`} className="text-link">
                      Xem câu chuyện dự án <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "48px 24px", background: "var(--bg-card)", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ margin: 0, color: "#78716c", fontSize: "15px" }}>
                Danh sách dự án đang được cập nhật dữ liệu.
              </p>
            </div>
          )}
        </div>
      </section>
      <CtaBand compact />
    </>
  );
}


