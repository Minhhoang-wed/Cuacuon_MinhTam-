import type { Metadata } from "next";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
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
      <CtaBand compact />
    </>
  );
}
