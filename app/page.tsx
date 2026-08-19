import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Hammer,
  Phone,
  RefreshCw,
  Settings,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { HeroSlider } from "@/components/hero-slider";
import { services } from "@/data/content";
import { formatPrice, getCategories, getHomepageContent, getProducts, getProjects, getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

const projectImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=82",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=82",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&q=82",
];

const serviceIcons = [Hammer, Wrench, Settings, RefreshCw, Truck, ShieldCheck];

export default async function HomePage() {
  const [site, homepage, catalogProducts, categories, catalogProjects] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getProducts(),
    getCategories(),
    getProjects(),
  ]);

  const products = catalogProducts.slice(0, 8);
  const projects = catalogProjects.slice(0, 4);

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

      {/* 1. Modern Rounded Card Hero Banner */}
      <HeroSlider
        heroEyebrow={homepage.heroEyebrow}
        heroTitle={homepage.heroTitle}
        heroEmphasis={homepage.heroEmphasis}
        heroDescription={homepage.heroDescription}
        heroCtaLabel={homepage.heroCtaLabel}
        hotline={site.hotline}
      />


      {/* 3. Featured Collection Split Banner (Maison Split Section) */}
      <section className="maison-split-section">
        <div className="container maison-split-grid">
          <div className="maison-split-media">
            <img
              src="/images/collection-banner.jpg"
              alt="Cửa cuốn khe thoáng công nghệ Đức"
            />
          </div>
          <div className="maison-split-content">
            <span className="kicker">BỘ SƯU TẬP TIÊU BIỂU</span>
            <h2>Cửa Cuốn Khe Thoáng Cao Cấp</h2>
            <p>
              Thiết kế nan nhôm định hình hợp kim nhôm 6063-T5 cao cấp, sơn tĩnh điện ngoài trời AkzoNobel bền màu 15 năm, tích hợp hệ thống khe thoáng đón gió và ánh sáng tự nhiên cho không gian sống hiện đại.
            </p>
            <Link href="/san-pham?category=cua-cuon-khe-thoang" className="button button-primary">
              Khám phá danh mục <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Latest Products Grid (Maison 4-Column Lookbook) */}
      <section className="section lovable-products-section">
        <div className="container">
          <div className="lovable-section-heading">
            <span>DANH MỤC SẢN PHẨM</span>
            <h2>{homepage.introTitle || "Các dòng cửa cuốn & phụ kiện"}</h2>
            <p>{homepage.introText || "Đa dạng giải pháp cho nhà phố, cửa hàng và nhà xưởng — thông số, giá và bảo hành được quản lý tập trung."}</p>
          </div>
          {products.length > 0 ? (
            <>
              <div className="lovable-product-grid">
                {products.map((product, index) => (
                  <article className="lovable-product-card" key={product.id}>
                    <Link href={`/san-pham/${product.slug}`} className="lovable-product-card-link">
                      <div className="lovable-product-image">
                        <img
                          src={product.images[0]?.url || projectImages[index % projectImages.length]}
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
              <div className="lovable-center-action">
                <Link href="/san-pham" className="button button-primary">
                  Xem tất cả sản phẩm <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "48px 24px", background: "var(--bg-card)", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ margin: "0 0 16px", color: "#78716c", fontSize: "15px" }}>
                Danh mục sản phẩm đang được cập nhật dữ liệu.
              </p>
              <Link href="/admin/products/new" className="button button-primary" style={{ display: "inline-flex" }}>
                + Thêm sản phẩm mới trong Admin
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. Services Section */}
      {services.length > 0 && (
        <section className="section lovable-services-section">
          <div className="container">
            <div className="lovable-section-heading">
              <span>DỊCH VỤ CHUYÊN NGHIỆP</span>
              <h2>Dịch vụ chúng tôi cung cấp</h2>
              <p>Tư vấn đúng hiện trạng, xác nhận chi phí trước khi thực hiện và bàn giao rõ ràng.</p>
            </div>
            <div className="lovable-service-grid">
              {services.slice(0, 6).map((service, index) => (
                <Link href={`/dich-vu/${service.slug}`} className="lovable-service-card" key={service.slug}>
                  {(() => {
                    const Icon = serviceIcons[index % serviceIcons.length];
                    return (
                      <span className="lovable-service-icon">
                        <Icon size={22} />
                      </span>
                    );
                  })()}
                  <h3>{service.name}</h3>
                  <p>{service.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Category Lookbook Wrap */}
      {categories.length > 0 && (
        <section className="lovable-categories-section">
          <div className="container lovable-category-wrap">
            <h2>Danh mục nổi bật</h2>
            <div>
              {categories.slice(0, 8).map((category) => (
                <Link href={`/danh-muc/${category.slug}`} key={category.id}>
                  {category.name}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Why Choose Us & Stats Grid */}
      <section className="section lovable-why-section">
        <div className="container lovable-why-grid">
          <div className="lovable-why-copy">
            <span className="kicker">VÌ SAO CHỌN CHÚNG TÔI</span>
            <h2>Cam kết chất lượng trên từng công trình</h2>
            <p>
              Quy trình rõ ràng từ khảo sát, báo giá, thi công đến nghiệm thu và bảo hành. Mọi hạng mục đều được thống nhất trước khi bắt đầu.
            </p>
            <ul>
              <li>
                <CheckCircle2 /> Báo giá minh bạch, không tự ý phát sinh chi phí
              </li>
              <li>
                <CheckCircle2 /> Kỹ thuật viên được đào tạo chuyên sâu, tay nghề cao
              </li>
              <li>
                <CheckCircle2 /> Vật tư và motor chính hãng 100%, có tem bảo hành
              </li>
              <li>
                <CheckCircle2 /> Hỗ trợ kỹ thuật 24/7 và kiểm tra định kỳ sau bàn giao
              </li>
              <li>
                <CheckCircle2 /> Thi công đúng tiến độ cam kết, dọn dẹp sạch sẽ
              </li>
            </ul>
          </div>
          <div className="lovable-stat-grid">
            <article>
              <b>15+</b>
              <span>Năm kinh nghiệm</span>
            </article>
            <article>
              <b>8.000+</b>
              <span>Công trình hoàn thiện</span>
            </article>
            <article>
              <b>30</b>
              <span>Phút có mặt nội thành</span>
            </article>
            <article>
              <b>5 Năm</b>
              <span>Bảo hành dài hạn</span>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

