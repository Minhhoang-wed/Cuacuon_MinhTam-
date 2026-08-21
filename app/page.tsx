import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { CinematicHeroSlider } from "@/components/cinematic-hero-slider";
import { FaqJsonLd, WebSiteJsonLd } from "@/components/structured-data";
import {
  repairIssues,
  repairTips,
  trustItems,
} from "@/data/public-home";
import { serviceFaqs } from "@/data/faq";
import { formatPrice, getCategories, getHomepageContent, getProducts, getServices, getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: `Sửa Cửa Cuốn TP.HCM 24/7 | ${site.name} - Có Mặt Sau 15 Phút`,
    description:
      "Dịch vụ sửa cửa cuốn tận nơi tại TP.HCM. Kỹ thuật viên có mặt sau 15-30 phút, báo giá minh bạch, bảo hành 3-24 tháng. Tiếp nhận 24/7 kể cả ngày lễ. Hotline: " +
      site.hotline,
    keywords: [
      "sửa cửa cuốn",
      "sửa cửa cuốn TP.HCM",
      "sửa cửa cuốn 24/7",
      "sửa cửa cuốn tận nơi",
      "cửa cuốn bị kẹt",
      "thay motor cửa cuốn",
      "sửa remote cửa cuốn",
      "cửa cuốn Minh Tâm",
      "dịch vụ cửa cuốn",
      "lắp đặt cửa cuốn",
    ],
    alternates: { canonical: "/" },
  };
}

const productFallbackImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=82",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=82",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&q=82",
];

export default async function HomePage() {
  const [site, homepage, catalogProducts, categories, services] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getProducts(),
    getCategories(),
    getServices(),
  ]);

  const products = catalogProducts.slice(0, 8);

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.structuredBusinessName || site.name,
    url: site.seoCanonicalBase || site.baseUrl,
    telephone: site.structuredPhone || site.hotline,
    priceRange: site.structuredPriceRange || "$$",
    image: site.ogImageUrl ? (site.ogImageUrl.startsWith("http") ? site.ogImageUrl : `${site.baseUrl}${site.ogImageUrl}`) : `${site.baseUrl}/og.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.structuredAddressLocality || "TP. Hồ Chí Minh",
      addressRegion: site.structuredAddressRegion || "VN-SG",
      addressCountry: "VN",
    },
    areaServed: site.serviceArea,
    openingHours: "Mo-Su 00:00-23:59",
    sameAs: [site.facebookHref, site.zaloHref].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <WebSiteJsonLd
        name={site.name}
        url={site.seoCanonicalBase || site.baseUrl}
        description={site.description}
      />
      <FaqJsonLd items={serviceFaqs} />

      {/* SEO: H1 chính cho trang chủ — visually hidden nhưng semantic cho Google */}
      <h1 className="sr-only">
        Sửa cửa cuốn TP.HCM 24/7 — {site.name} — Có mặt sau 15 phút, bảo hành dài hạn
      </h1>

      {/* Hero Banner phong cách Card vòm tự động chuyển ảnh mỗi 3 giây (Fade Transition) */}
      <CinematicHeroSlider
        hotlineHref={site.hotlineHref}
        hotline={site.hotline}
        zaloHref={site.zaloHref}
      />

      <section className="repair-section repair-trust-section" id="vi-sao-chon-minh-tam">
        <div className="container">
          <div className="repair-section-heading">
            <span>Vì sao chọn Minh Tâm</span>
            <h2>Uy tín tạo nên niềm tin</h2>
            <p>Minh Tâm tập trung vào tư vấn rõ tình trạng, xử lý đúng nhu cầu và bàn giao minh bạch.</p>
          </div>
          <div className="repair-trust-grid">
            {trustItems.map((item) => (
              <article className="repair-trust-item" key={item.title}>
                <img src={item.icon} alt="" aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="repair-section repair-issues-section" id="loi-thuong-gap">
        <div className="container">
          <div className="repair-section-heading">
            <span>Kiểm tra nhanh</span>
            <h2>Cửa cuốn của bạn đang gặp lỗi nào?</h2>
            <p>Nhận biết đúng lỗi giúp xử lý nhanh hơn và tiết kiệm chi phí. Chọn lỗi bạn đang gặp để được tư vấn hướng phù hợp.</p>
          </div>
          <div className="repair-issue-grid">
            {repairIssues.map((issue) => (
              <article className="repair-issue-card" key={issue.title}>
                <img src={issue.icon} alt="" aria-hidden="true" />
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>
                <a href={site.hotlineHref}>
                  Gọi kỹ thuật <ArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="repair-section repair-services-section" id="dich-vu-sua-chua">
        <div className="container">
          <div className="repair-section-heading">
            <span>Dịch vụ sửa chữa cửa cuốn</span>
            <h2>Sửa nhanh - Chuẩn kỹ thuật - Giá hợp lý</h2>
            <p>Đội ngũ kỹ thuật viên xử lý các sự cố cửa cuốn tại nhà an toàn, rõ tình trạng và rõ hướng sửa.</p>
          </div>
          <div className="repair-service-grid">
            {services.map((service, index) => (
              <article className="repair-service-card" key={service.id || service.slug}>
                <div className="repair-service-image-wrap">
                  <img
                    src={service.imageUrl || "/services/sua-cua-bi-ket.png"}
                    alt={service.name}
                  />
                  <span className="repair-service-badge">{String(index + 1).padStart(2, "0")} • CỨU HỘ</span>
                </div>
                <div className="repair-service-copy">
                  <span className="repair-service-category">DỊCH VỤ SỬA CHỮA</span>
                  <h3>
                    <Link href={`/dich-vu/${service.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {service.name}
                    </Link>
                  </h3>
                  <p>{service.summary}</p>
                  <div className="repair-service-price-stack">
                    <b className="service-price">{service.price}</b>
                    {service.warranty && (
                      <>
                        <span className="service-divider">|</span>
                        <span className="service-warranty">{service.warranty}</span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="repair-section repair-products-section" id="san-pham-phu-kien">
        <div className="container">
          <div className="repair-section-heading">
            <span>Sản phẩm & phụ kiện nổi bật</span>
            <h2>{homepage.introTitle || "Thiết bị chính hãng - Vận hành bền bỉ"}</h2>
            <p>{homepage.introText || "Cung cấp và lắp đặt thiết bị cửa cuốn chất lượng, chính hãng, bảo hành đầy đủ."}</p>
          </div>
          {products.length > 0 ? (
            <>
              <div className="lovable-product-grid repair-product-grid">
                {products.map((product, index) => (
                  <article className="lovable-product-card repair-product-card" key={product.id}>
                    <Link href={`/san-pham/${product.slug}`} className="lovable-product-card-link">
                      <div className="lovable-product-image">
                        <img
                          src={product.images[0]?.url || productFallbackImages[index % productFallbackImages.length]}
                          alt={product.images[0]?.altText || product.name}
                        />
                        {product.featured && <span>Nổi bật</span>}
                        <i>Chi tiết →</i>
                      </div>
                      <div className="lovable-product-body">
                        <span>{product.category.name}</span>
                        <h3>{product.name}</h3>
                        <p>{product.shortDescription}</p>
                        <div>
                          <b>{formatPrice(product)}</b>
                          <small>{product.warranty}</small>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
              <div className="repair-center-action">
                <Link href="/san-pham" className="button button-primary">
                  Xem tất cả sản phẩm <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state repair-empty-state">
              <p>Danh mục sản phẩm đang được cập nhật dữ liệu.</p>
            </div>
          )}
        </div>
      </section>



      <section className="repair-section repair-tips-section" id="meo-kien-thuc">
        <div className="container">
          <div className="repair-section-heading">
            <span>Mẹo & kiến thức cửa cuốn</span>
            <h2>Chia sẻ kinh nghiệm - Giúp cửa luôn bền đẹp</h2>
            <p>Các gợi ý nhận biết sự cố và kiểm tra an toàn cơ bản trước khi cần kỹ thuật viên hỗ trợ.</p>
          </div>
          <div className="repair-tip-grid">
            {repairTips.map((tip) => (
              <article className="repair-tip-card" key={tip.title}>
                <img src={tip.image} alt={tip.title} />
                <div>
                  <span>{tip.tag}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.excerpt}</p>
                  <a href="/tin-tuc">
                    Xem chi tiết <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="repair-center-action">
            <Link href="/tin-tuc" className="button button-primary">
              <FileText size={18} /> Xem thêm bài viết hữu ích <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — Câu hỏi thường gặp (matches FAQPage JSON-LD) */}
      <section className="repair-section repair-faq-section" id="cau-hoi-thuong-gap">
        <div className="container">
          <div className="repair-section-heading">
            <span>Câu hỏi thường gặp</span>
            <h2>Khách hàng hay hỏi gì về dịch vụ sửa cửa cuốn?</h2>
            <p>Giải đáp nhanh các thắc mắc phổ biến nhất về dịch vụ, chi phí, thời gian và bảo hành.</p>
          </div>
          <div className="faq-list">
            {serviceFaqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
