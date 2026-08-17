import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
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
import { services, projects } from "@/data/content";
import { formatPrice, getCategories, getHomepageContent, getProducts, getSiteSettings } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const projectImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=82",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=82",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&q=82",
];

const serviceIcons = [Hammer, Wrench, Settings, RefreshCw, Truck, ShieldCheck];

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

      <section className="lovable-hero">
        <div className="container lovable-hero-grid">
          <div className="lovable-hero-copy">
            <span className="hero-badge"><ShieldCheck size={15} /> {homepage.heroEyebrow || "15 năm kinh nghiệm thi công"}</span>
            <h1>{homepage.heroTitle || "Lắp đặt & sửa chữa cửa cuốn"}<span>{homepage.heroEmphasis || "chuyên nghiệp, uy tín"}</span></h1>
            <p>{homepage.heroDescription || site.description}</p>
            <div className="lovable-hero-actions">
              <Link href="/lien-he" className="button button-primary"><Phone size={18} /> {homepage.heroCtaLabel || "Nhận báo giá miễn phí"}</Link>
              <Link href="/san-pham" className="button button-light">Xem sản phẩm <ArrowRight size={17} /></Link>
            </div>
            <div className="lovable-hero-points">
              <span><CheckCircle2 /> Khảo sát miễn phí</span>
              <span><CheckCircle2 /> Báo giá trong 15 phút</span>
              <span><CheckCircle2 /> Thi công toàn quốc</span>
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
          <article><BadgeCheck /><div><b>Linh kiện chính hãng</b><span>Đầy đủ tem bảo hành</span></div></article>
          <article><ShieldCheck /><div><b>Bảo hành dài hạn</b><span>Lên đến 5 năm</span></div></article>
        </div>
      </section>

      <section className="section lovable-products-section">
        <div className="container">
          <div className="lovable-section-heading">
            <span>Sản phẩm</span>
            <h2>{homepage.introTitle || "Các dòng cửa cuốn & phụ kiện"}</h2>
            <p>{homepage.introText || "Đa dạng giải pháp cho nhà phố, cửa hàng và nhà xưởng — thông số, giá và bảo hành được quản lý tập trung."}</p>
          </div>
          <div className="lovable-product-grid">
            {products.map((product, index) => (
              <article className="lovable-product-card" key={product.id}>
                <Link href={`/san-pham/${product.slug}`} className="lovable-product-card-link">
                  <div className={`lovable-product-image${product.images[1]?.url ? " has-alt" : ""}`}>
                    <img src={product.images[0]?.url || projectImages[index % projectImages.length]} alt={product.images[0]?.altText || product.name} />
                    {product.images[1]?.url && <img className="lovable-product-alt" src={product.images[1].url} alt="" />}
                    {product.featured && <span>Nổi bật</span>}
                    <i>Xem chi tiết</i>
                  </div>
                  <div className="lovable-product-body">
                    <span>{product.category.name}</span>
                    <h3>{product.name}</h3>
                    <p>{product.shortDescription}</p>
                    <div><b>{formatPrice(product)}</b><small>{product.warranty}</small></div>
                  </div>
                </Link>
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
                {(() => { const Icon = serviceIcons[index]; return <span className="lovable-service-icon"><Icon /></span>; })()}
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
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
              <li><CheckCircle2 /> Kỹ thuật viên được đào tạo, có chứng chỉ an toàn</li>
              <li><CheckCircle2 /> Vật tư và motor chính hãng, có tem bảo hành</li>
              <li><CheckCircle2 /> Hỗ trợ kỹ thuật trọn đời sau bàn giao</li>
              <li><CheckCircle2 /> Thi công đúng tiến độ, dọn dẹp sạch sẽ</li>
            </ul>
          </div>
          <div className="lovable-stat-grid">
            <article><b>15+</b><span>Năm kinh nghiệm</span></article>
            <article><b>8.000+</b><span>Công trình bàn giao</span></article>
            <article><b>30</b><span>Phút có mặt (nội thành)</span></article>
            <article><b>5 năm</b><span>Bảo hành tối đa</span></article>
          </div>
        </div>
      </section>

      <section className="section lovable-projects-section">
        <div className="container">
          <div className="lovable-project-heading">
            <div><span>Dự án</span><h2>Công trình thực tế</h2></div>
            <p>Một số công trình tiêu biểu đã được đội ngũ kỹ thuật của chúng tôi thi công và bàn giao.</p>
          </div>
          <div className="lovable-project-grid">
            {projects.map((project, index) => (
              <Link href={`/du-an/${project.slug}`} className="lovable-project-card" key={project.slug}>
                <img src={projectImages[index % projectImages.length]} alt={project.name} />
                <div><h3>{project.name}</h3><p>{project.category} · {project.location}</p></div>
              </Link>
            ))}
          </div>
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
        <div className="container"><div><h2>Cần tư vấn hoặc sửa cửa cuốn gấp?</h2><p>Gọi hotline để được kỹ thuật viên hỗ trợ ngay. Khảo sát và báo giá hoàn toàn miễn phí, có mặt trong 30–60 phút tại nội thành.</p></div><a href={site.hotlineHref} className="lovable-hotline-card"><Phone /><span><small>Hotline 24/7</small><b>{site.hotline}</b></span></a></div>
      </section>
    </>
  );
}
