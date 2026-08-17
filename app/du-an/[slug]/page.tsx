import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { getProject, projects } from "@/data/content";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getProject((await params).slug); if (!item) return {}; return { title: item.name, description: item.summary, openGraph: { title: item.name, description: item.summary, images: [] }, twitter: { title: item.name, description: item.summary, images: [] } }; }
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) { const item = getProject((await params).slug); if (!item) notFound(); return <><section className="detail-hero"><div className="container detail-hero-grid"><div><Link href="/du-an" className="back-link"><ArrowLeft /> Tất cả dự án</Link><span className="kicker">{item.category}</span><h1>{item.name}</h1><p className="project-location"><MapPin /> {item.location}</p><p>{item.summary}</p></div><DoorVisual label={item.category} kind="project" accent={item.accent} /></div></section><section className="section"><div className="container story-panel"><span className="story-index">KẾT QUẢ</span><div><h2>{item.result}</h2><p>Nội dung dự án hiện là minh họa. Bản production nên bổ sung ảnh trước/sau, ngày thực hiện, hạng mục và xác nhận quyền sử dụng hình ảnh từ khách hàng.</p><span className="result-chip"><CheckCircle2 /> Đã nghiệm thu</span></div></div></section><CtaBand compact /></>; }
