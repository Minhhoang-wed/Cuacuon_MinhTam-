import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { ProductImageViewer } from "@/components/product-image-viewer";
import { CatalogImage, CatalogSpec, formatPrice, getProductBySlug, getProducts, getSiteSettings } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const image = product.images[0]?.url;
  const socialImage = image ? [{ url: image, alt: product.images[0]?.altText || product.name }] : ["/og.png"];
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    alternates: { canonical: `/san-pham/${slug}` },
    openGraph: {
      type: "website",
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: image ? [image] : ["/og.png"],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [site, related] = await Promise.all([
    getSiteSettings(),
    getProducts({ category: product.category.slug }),
  ]);
  const relatedProducts = related.filter((item) => item.id !== product.id).slice(0, 4);
  const productImages = product.images
    .map((image: CatalogImage) => image.url)
    .filter((image: string | null): image is string => Boolean(image));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    sku: product.id,
    category: product.category.name,
    ...(productImages.length ? { image: productImages } : {}),
    brand: { "@type": "Brand", name: "MITADOOR" },
    ...(product.priceMode === "exact" && product.priceAmount
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency,
            price: product.priceAmount,
            availability: "https://schema.org/InStock",
            url: `${site.baseUrl.replace(/\/$/, "")}/san-pham/${product.slug}`,
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: site.baseUrl },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${site.baseUrl.replace(/\/$/, "")}/san-pham` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${site.baseUrl.replace(/\/$/, "")}/san-pham/${product.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="detail-hero">
        <div className="container detail-hero-grid">
          <div>
            <Link href="/san-pham" className="back-link">
              <ArrowLeft size={16} /> Quay lại danh mục
            </Link>
            <Link href={`/danh-muc/${product.category.slug}`} className="kicker">
              {product.category.name}
            </Link>
            <h1>{product.name}</h1>
            <p>{product.shortDescription}</p>
            {formatPrice(product) && <div className="detail-price">{formatPrice(product)}</div>}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href={site.zaloHref}
                className="button button-primary"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} /> Nhận báo giá qua Zalo
              </a>
              <a href={site.hotlineHref} className="button button-light">
                <Phone size={17} /> Gọi tư vấn ngay
              </a>
            </div>
          </div>
          <ProductImageViewer
            label={product.category.name}
            accent={product.accent}
            imageUrl={product.images[0]?.url}
            imageUrls={product.images.map((image: CatalogImage) => image.url)}
            imageAlt={product.images[0]?.altText || product.name}
          />
        </div>
      </section>

      <section className="section">
        <div className="container detail-content-grid">
          <div>
            <h2>Thông tin sản phẩm</h2>
            <p className="product-description">{product.description || product.shortDescription}</p>

            <h2>Thông số kỹ thuật</h2>
            {product.specs.length ? (
              <ul className="spec-table">
                {product.specs.map((item: CatalogSpec) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <b>{item.value}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-copy">
                Thông số đang được cập nhật. Vui lòng liên hệ để được tư vấn kích thước và thông số theo hiện trạng thực tế.
              </p>
            )}


            <div className="content-note">
              <ShieldCheck size={24} />
              <p>
                <b>Chính sách bảo hành chính hãng: {product.warranty}.</b>
                <br />
                Đầy đủ chứng nhận xuất xưởng CO/CQ và hỗ trợ kỹ thuật tận nơi 24/7.
              </p>
            </div>
          </div>

          <aside className="quote-card">
            <span>TƯ VẤN KỸ THUẬT</span>
            <h3>Cần khảo sát & đo đạc kích thước tận nơi?</h3>
            <p>
              Gửi hình ảnh mặt bằng hoặc yêu cầu thiết kế để nhận tư vấn giải pháp phù hợp với tải trọng và tần suất sử dụng của bạn.
            </p>
            <a
              href={site.zaloHref}
              target="_blank"
              rel="noreferrer"
              className="button button-gold"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <MessageCircle size={17} /> Nhận báo giá qua Zalo
            </a>
          </aside>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section" style={{ background: "var(--bg-stone-subtle)", borderTop: "1px solid var(--color-border)" }}>
          <div className="container">
            <div className="lovable-section-heading">
              <span>BỘ SƯU TẬP LIÊN QUAN</span>
              <h2>Sản phẩm cùng danh mục</h2>
            </div>
            <div className="lovable-product-grid">
              {relatedProducts.map((item) => (
                <article className="lovable-product-card" key={item.id}>
                  <Link href={`/san-pham/${item.slug}`} className="lovable-product-card-link">
                    <div className="lovable-product-image">
                      <img
                        src={item.images[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"}
                        alt={item.images[0]?.altText || item.name}
                      />
                      {item.featured && <span>Nổi bật</span>}
                      <i>Chi tiết →</i>
                    </div>
                    <div className="lovable-product-body">
                      <span>{item.category.name}</span>
                      <h3>{item.name}</h3>
                      <p>{item.shortDescription}</p>
                      <div>
                        <b>{formatPrice(item)}</b>
                        <small>{item.warranty}</small>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand compact />
    </>
  );
}

