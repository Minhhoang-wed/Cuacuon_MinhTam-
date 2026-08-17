import type { Metadata } from "next";
import { ArrowLeft, CalendarCheck, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { getService, services } from "@/data/content";

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return { title: service.name, description: service.summary, openGraph: { title: service.name, description: service.summary, images: [] }, twitter: { title: service.name, description: service.summary, images: [] } };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  if (!service) notFound();
  return (
    <>
      <section className="detail-hero">
        <div className="container detail-hero-grid">
          <div><Link href="/dich-vu" className="back-link"><ArrowLeft /> Tất cả dịch vụ</Link><span className="kicker">Sửa chữa tận nơi</span><h1>{service.name}</h1><p>{service.summary}</p><Link href="/lien-he#dat-lich" className="button button-primary"><CalendarCheck /> Đặt lịch kiểm tra</Link></div>
          <DoorVisual label="KỸ THUẬT" kind="service" />
        </div>
      </section>
      <section className="section">
        <div className="container detail-content-grid">
          <div>
            <h2>Dấu hiệu thường gặp</h2><ul className="check-list">{service.symptoms.map((item) => <li key={item}><CheckCircle2 /> {item}</li>)}</ul>
            <h2>Quy trình xử lý</h2><ol className="number-list">{service.process.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>
          </div>
          <aside className="quote-card"><span>Thông tin tham khảo</span><div><small>Khoảng giá</small><strong>{service.price}</strong></div><div><small>Thời gian dự kiến</small><b><Clock3 /> {service.duration}</b></div><div><small>Bảo hành</small><b><ShieldCheck /> {service.warranty}</b></div><p>Chi phí thực tế phụ thuộc hiện trạng, model thiết bị, khu vực và thời điểm phục vụ.</p></aside>
        </div>
      </section>
      <CtaBand compact />
    </>
  );
}
