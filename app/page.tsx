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
import {
  repairIssues,
  repairServices,
  repairTips,
  trustItems,
} from "@/data/public-home";
import { formatPrice, getCategories, getHomepageContent, getProducts, getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

const productFallbackImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=82",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=82",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&q=82",
];

export default async function HomePage() {
  const [site, homepage, catalogProducts, categories] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getProducts(),
    getCategories(),
  ]);

  const products = catalogProducts.slice(0, 8);

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    url: site.baseUrl,
    telephone: site.hotline,
    address: site.address,
    areaServed: site.serviceArea,
    openingHours: "Mo-Su 00:00-23:59",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />

      <section className="repair-hero" id="sua-cua-cuon">
        <div className="container repair-hero-grid">
          <div className="repair-hero-copy">
            <span className="repair-eyebrow">
              Sửa cửa cuốn · Tiếp nhận nhanh
            </span>
            <h1>
              Cửa cuốn gặp sự cố?
              <span>Minh Tâm hỗ trợ <em>sửa chữa</em> tận nơi.</span>
            </h1>
            <p>
              Tiếp nhận các tình trạng cửa cuốn bị kẹt, lỗi motor, remote, lệch ray, đứt nan và nhiều sự cố thường gặp.
            </p>
            <a href="#loi-thuong-gap" className="repair-text-link">
              Xem lỗi thường gặp <ArrowRight size={18} />
            </a>
          </div>

          <div className="repair-hero-visual" aria-label="Kỹ thuật viên sửa cửa cuốn">
            <img src="/hero/hero-technician-repair.png" alt="Kỹ thuật viên Minh Tâm đang kiểm tra cửa cuốn" />
          </div>
        </div>
      </section>

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
            {repairServices.map((service, index) => (
              <article className="repair-service-card" key={service.title}>
                <div className="repair-service-copy">
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="repair-service-price-stack">
                    <b className="service-price">{service.price}</b>
                    <span className="service-warranty">{service.warranty}</span>
                  </div>
                </div>
                <img src={service.image} alt={service.title} />
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
    </>
  );
}
