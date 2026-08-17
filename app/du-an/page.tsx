import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { PageHero } from "@/components/page-hero";
import { projects } from "@/data/content";

export const metadata: Metadata = { title: "Dự án đã thực hiện", description: "Một số công trình sửa chữa, bảo trì và lắp đặt cửa cuốn tiêu biểu." };
export default function ProjectsPage() { return <><PageHero eyebrow="Công trình thực tế" title="Mỗi bộ cửa là một bài toán vận hành." description="Các dự án dưới đây là dữ liệu minh họa về cách trình bày. Doanh nghiệp cần cung cấp ảnh và thông tin có quyền sử dụng trước khi chạy chính thức." image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=82" /><section className="section"><div className="container project-grid">{projects.map((project) => <article className="project-card" key={project.slug}><DoorVisual label={project.category} kind="project" accent={project.accent} /><div><span className="product-category">{project.category}</span><h2>{project.name}</h2><p className="project-location"><MapPin /> {project.location}</p><p>{project.summary}</p><Link href={`/du-an/${project.slug}`} className="text-link">Xem câu chuyện dự án <ArrowRight size={17} /></Link></div></article>)}</div></section><CtaBand compact /></>; }
