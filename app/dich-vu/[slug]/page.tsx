import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
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
            <Link href="/dich-vu" className="back-link">
              <ArrowLeft size={16} /> Quay lại danh mục dịch vụ
            </Link>
            <span className="kicker">Dịch vụ sửa chữa chuyên nghiệp</span>
            <h1>{service.name}</h1>
            <p>{service.summary}</p>
            {service.price && (
              <div className="detail-price">
                {service.price.trim().toLowerCase().startsWith("từ")
                  ? service.price
                  : `Từ ${service.price}`}
              </div>
            )}
            <div className="detail-hero-actions" style={{ marginTop: "24px" }}>
              <a
                href={settings.zaloHref || "https://zalo.me/"}
                className="button button-primary"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} /> Nhận báo giá qua Zalo
              </a>
              <a
                href={settings.hotlineHref || `tel:${settings.hotline}`}
                className="button button-light"
              >
                <Phone size={17} /> Gọi tư vấn ngay
              </a>
            </div>
          </div>
          <div className="service-detail-image-card">
            <img
              src={service.imageUrl || "/services/sua-cua-bi-ket.png"}
              alt={service.name}
            />
          </div>
        </div>
      </section>
      {((service.symptoms && service.symptoms.length > 0) || (service.process && service.process.length > 0)) && (
        <section className="section" style={{ background: "#ffffff" }}>
          <div className="container" style={{ maxWidth: "1000px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "48px" }}>
              {service.symptoms && service.symptoms.length > 0 && (
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0a2540", margin: "0 0 18px" }}>
                    Dấu hiệu thường gặp
                  </h2>
                  <ul className="check-list">
                    {service.symptoms.map((item) => (
                      <li key={item}><CheckCircle2 /> {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {service.process && service.process.length > 0 && (
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0a2540", margin: "0 0 18px" }}>
                    Quy trình xử lý
                  </h2>
                  <ol className="number-list">
                    {service.process.map((item, index) => (
                      <li key={item}>
                        <b>{String(index + 1).padStart(2, "0")}</b>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      <CtaBand compact />
    </>
  );
}
