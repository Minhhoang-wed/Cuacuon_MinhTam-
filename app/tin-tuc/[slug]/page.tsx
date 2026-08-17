import type { Metadata } from "next";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { articles, getArticle } from "@/data/content";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getArticle((await params).slug); if (!item) return {}; return { title: item.title, description: item.excerpt, openGraph: { title: item.title, description: item.excerpt, images: [] }, twitter: { title: item.title, description: item.excerpt, images: [] } }; }
export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) { const item = getArticle((await params).slug); if (!item) notFound(); return <><article><header className="article-hero"><div className="narrow-container"><Link href="/tin-tuc" className="back-link"><ArrowLeft /> Tất cả bài viết</Link><span className="kicker">{item.category}</span><h1>{item.title}</h1><p>{item.excerpt}</p><div className="article-meta"><span>{item.date}</span><span><Clock3 /> {item.readTime} đọc</span></div></div></header><div className="narrow-container prose">{item.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="content-note"><p><b>Lưu ý an toàn:</b> Ngắt nguồn khi có nguy cơ chập điện và không đứng dưới thân cửa đang lệch hoặc có dấu hiệu rơi.</p></div></div></article><CtaBand compact /></>; }
