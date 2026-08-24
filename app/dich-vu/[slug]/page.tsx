import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { getServiceBySlug, getServices, getSiteSettings } from "@/lib/catalog";

export async function generateStaticParams() {
  const list = await getServices();
  return list.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/dich-vu/${service.slug}` },
    openGraph: { title: service.name, description: service.summary, images: ["/og.png"] },
    twitter: { card: "summary_large_image", title: service.name, description: service.summary, images: ["/og.png"] },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) notFound();

  const baseUrl = (settings.seoCanonicalBase || settings.baseUrl).replace(/\/$/, "");

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: settings.name,
      telephone: settings.hotline,
      url: baseUrl,
    },
    areaServed: settings.serviceArea,
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "VND",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Dịch vụ kỹ thuật", item: `${baseUrl}/dich-vu` },
      { "@type": "ListItem", position: 3, name: service.name, item: `${baseUrl}/dich-vu/${service.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="detail-hero">
        <div className="container detail-hero-grid">
          <div>
            <Link href="/dich-vu" className="back-link"><ArrowLeft /> Tất cả dịch vụ</Link>
            <span className="kicker">Sửa chữa tận nơi</span>
            <h1>{service.name}</h1>
            <p>{service.summary}</p>
            <a href={settings.zaloHref || "https://zalo.me/"} target="_blank" rel="noreferrer" className="button button-primary">
              Tư vấn & Báo giá qua Zalo
            </a>
          </div>
          <DoorVisual
            label="KỸ THUẬT"
            kind="service"
            imageUrl={service.imageUrl}
            imageAlt={service.name}
          />
        </div>
      </section>
      <section className="section">
        <div className="container detail-content-grid">
          <div>
            {service.symptoms && service.symptoms.length > 0 && (
              <>
                <h2>Dấu hiệu thường gặp</h2>
                <ul className="check-list">
                  {service.symptoms.map((item) => (
                    <li key={item}><CheckCircle2 /> {item}</li>
                  ))}
                </ul>
              </>
            )}
            {service.process && service.process.length > 0 && (
              <>
                <h2>Quy trình xử lý</h2>
                <ol className="number-list">
                  {service.process.map((item, index) => (
                    <li key={item}>
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
          <aside className="quote-card">
            <span>Thông tin tham khảo</span>
            <div><small>Khoảng giá</small><strong>{service.price}</strong></div>
            <div><small>Thời gian dự kiến</small><b><Clock3 /> {service.duration}</b></div>
            <div><small>Bảo hành</small><b><ShieldCheck /> {service.warranty}</b></div>
            <p>Chi phí thực tế phụ thuộc hiện trạng, model thiết bị, khu vực và thời điểm phục vụ.</p>
          </aside>
        </div>
      </section>
      <CtaBand compact />
    </>
  );
}
