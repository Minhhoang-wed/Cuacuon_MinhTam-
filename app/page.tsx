import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Headphones,
  PackageCheck,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { services, projects } from "@/data/content";
import { formatPrice, getCategories, getHomepageContent, getProducts, getSiteSettings } from "@/lib/catalog";

const projectImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=82",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=82",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&q=82",
];

export default async function HomePage() {
  const [site, homepage, featuredProducts, categories] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getProducts({ featured: true }),
    getCategories(),
  ]);

  const products = featuredProducts.slice(0, 8);
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

      <section className="lovable-hero">
        <div className="container lovable-hero-grid">
          <div className="lovable-hero-copy">
            <span className="hero-badge"><ShieldCheck size={15} /> {homepage.heroEyebrow || "15 năm kinh nghiệm thi công"}</span>
            <h1>{homepage.heroTitle || "Lắp đặt & sửa chữa cửa cuốn"}<span>{homepage.heroEmphasis || "chuyên nghiệp, uy tín"}</span></h1>
            <p>{homepage.heroDescription || site.description}</p>
            <div className="lovable-hero-actions">
              <a href={site.hotlineHref} className="button button-primary"><Phone size={18} /> Gọi ngay {site.hotline}</a>
              <Link href="/san-pham" className="button button-light">Xem sản phẩm <ArrowRight size={17} /></Link>
            </div>
            <div className="lovable-hero-points">
              <span><CheckCircle2 /> Khảo sát miễn phí</span>
              <span><CheckCircle2 /> Báo giá minh bạch</span>
              <span><CheckCircle2 /> Thi công tận nơi</span>
            </div>
          </div>
          <div className="lovable-hero-media">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=84" alt="Công trình cửa cuốn do đội ngũ thi công" />
            <div className="hero-stat"><b>8.000+</b><span>Công trình bàn giao</span></div>
          </div>
        </div>
      </section>

      <section className="lovable-trust-strip" aria-label="Cam kết dịch vụ">
        <div className="container lovable-trust-grid">
          <article><Clock3 /><div><b>Sửa chữa 24/7</b><span>Có mặt nhanh chóng</span></div></article>
          <article><Wrench /><div><b>Lắp đặt chuyên nghiệp</b><span>Đội thợ tay nghề cao</span></div></article>
          <article><PackageCheck /><div><b>Linh kiện chính hãng</b><span>Đầy đủ tem bảo hành</span></div></article>
          <article><ShieldCheck /><div><b>Bảo hành dài hạn</b><span>Chính sách minh bạch</span></div></article>
        </div>
      </section>

      <section className="section lovable-products-section">
        <div className="container">
          <div className="lovable-section-heading">
            <span>Sản phẩm</span>
            <h2>Các dòng cửa cuốn & phụ kiện</h2>
            <p>Đa dạng giải pháp cho nhà phố, cửa hàng và nhà xưởng — thông số, giá và bảo hành được quản lý tập trung.</p>
          </div>
          <div className="lovable-product-grid">
            {products.map((product, index) => (
              <article className="lovable-product-card" key={product.id}>
                <Link href={`/san-pham/${product.slug}`} className="lovable-product-image">
                  <img src={product.images[0]?.url || projectImages[index % projectImages.length]} alt={product.images[0]?.altText || product.name} />
                  {product.featured && <span>Nổi bật</span>}
                  <i>Xem chi tiết</i>
                </Link>
                <div className="lovable-product-body">
                  <span>{product.category.name}</span>
                  <h3><Link href={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
                  <p>{product.shortDescription}</p>
                  <div><b>{formatPrice(product)}</b><small>{product.warranty}</small></div>
                </div>
              </article>
            ))}
          </div>
          <div className="lovable-center-action"><Link href="/san-pham" className="button button-primary">Xem tất cả sản phẩm <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="section lovable-services-section">
        <div className="container">
          <div className="lovable-section-heading">
            <span>Dịch vụ</span>
            <h2>Dịch vụ chúng tôi cung cấp</h2>
            <p>Tư vấn đúng hiện trạng, xác nhận chi phí trước khi thực hiện và bàn giao rõ ràng.</p>
          </div>
          <div className="lovable-service-grid">
            {services.slice(0, 6).map((service, index) => (
              <Link href={`/dich-vu/${service.slug}`} className="lovable-service-card" key={service.slug}>
                <span className="service-number">0{index + 1}</span>
                <Wrench />
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
                <span className="service-arrow"><ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section lovable-why-section">
        <div className="container lovable-why-grid">
          <div className="lovable-why-copy">
            <span className="kicker">Vì sao chọn chúng tôi</span>
            <h2>Cam kết chất lượng trên từng công trình</h2>
            <p>Quy trình rõ ràng từ khảo sát, báo giá, thi công đến nghiệm thu và bảo hành. Mọi hạng mục đều được thống nhất trước khi bắt đầu.</p>
            <ul>
              <li><CheckCircle2 /> Báo giá minh bạch, không tự ý phát sinh</li>
              <li><CheckCircle2 /> Kỹ thuật viên giàu kinh nghiệm</li>
              <li><CheckCircle2 /> Vật tư và thiết bị có nguồn gốc rõ ràng</li>
              <li><CheckCircle2 /> Hỗ trợ kỹ thuật sau bàn giao</li>
            </ul>
            <Link href="/lien-he" className="button button-primary">Nhận tư vấn <ArrowRight size={17} /></Link>
          </div>
          <div className="lovable-stat-grid">
            <article><BadgeCheck /><b>15+</b><span>Năm kinh nghiệm</span></article>
            <article><PackageCheck /><b>8.000+</b><span>Công trình bàn giao</span></article>
            <article><Clock3 /><b>30–60</b><span>Phút phản hồi nội thành</span></article>
            <article><Headphones /><b>24/7</b><span>Tiếp nhận hỗ trợ</span></article>
          </div>
        </div>
      </section>

      <section className="section lovable-projects-section">
        <div className="container">
          <div className="lovable-section-heading">
            <span>Dự án</span>
            <h2>Công trình thực tế</h2>
            <p>Một số hạng mục sửa chữa, bảo trì và lắp đặt tiêu biểu của đội ngũ kỹ thuật.</p>
          </div>
          <div className="lovable-project-grid">
            {projects.map((project, index) => (
              <Link href={`/du-an/${project.slug}`} className="lovable-project-card" key={project.slug}>
                <img src={projectImages[index % projectImages.length]} alt={project.name} />
                <div><span>{project.category}</span><h3>{project.name}</h3><p>{project.location}</p></div>
              </Link>
            ))}
          </div>
          <div className="lovable-center-action"><Link href="/du-an" className="button button-light">Xem tất cả công trình <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="lovable-categories-section">
          <div className="container lovable-category-wrap">
            <h2>Danh mục nổi bật</h2>
            <div>{categories.slice(0, 8).map((category) => <Link href={`/danh-muc/${category.slug}`} key={category.id}>{category.name}<ArrowRight size={16} /></Link>)}</div>
          </div>
        </section>
      )}

      <section className="lovable-home-cta">
        <div className="container"><div><h2>Cần tư vấn hoặc sửa cửa cuốn gấp?</h2><p>Gọi hotline để được hỗ trợ. Khảo sát và báo giá ban đầu hoàn toàn miễn phí.</p></div><a href={site.hotlineHref} className="button button-gold"><Phone size={19} /> {site.hotline}</a></div>
      </section>
    </>
  );
}
