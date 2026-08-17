import type { Metadata } from "next";
import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { articles } from "@/data/content";

export const metadata: Metadata = { title: "Tin tức & hướng dẫn", description: "Kiến thức sử dụng, an toàn và bảo trì cửa cuốn cho gia đình và cửa hàng." };
export default function NewsPage() { return <><PageHero eyebrow="Góc sử dụng an toàn" title="Hiểu chiếc cửa bạn dùng mỗi ngày." description="Hướng dẫn ngắn gọn để nhận biết sự cố, bảo trì đúng cách và tránh rủi ro không cần thiết." image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=82" /><section className="section"><div className="container article-grid">{articles.map((article, index) => <article className="article-card" key={article.slug}><div className={`article-cover tone-${index + 1}`}><span>{article.category}</span><b>{String(index + 1).padStart(2, "0")}</b></div><div className="article-body"><div className="card-meta"><span>{article.date}</span><span><Clock3 /> {article.readTime}</span></div><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={`/tin-tuc/${article.slug}`} className="text-link">Đọc bài viết <ArrowRight size={17} /></Link></div></article>)}</div></section><CtaBand compact /></>; }
