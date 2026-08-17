import { ArrowRight, CheckCircle2, Clock3, Settings, ShieldCheck, Phone, BadgeCheck, Wrench, Package, Cpu } from "lucide-react";
import Link from "next/link";
import { articles, projects } from "@/data/content";
import { getHomepageContent, getProducts, getSiteSettings } from "@/lib/catalog";

export default async function HomePage() {
  const [site, homepage, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(),
    getProducts({ featured: true }),
  ]);

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

      {/* ========== HERO ========== */}
      <section className="hero-navy">
        <div className="container hero-navy-grid">
          <div className="hero-navy-copy">
            <span className="hero-navy-eyebrow">UY TÍN - CHẤT LƯỢNG - TẬN TÂM</span>
            <h1>
              SỬA CHỮA - LẮP ĐẶT<br />
              <span className="accent">CỬA CUỐN</span> CHUYÊN NGHIỆP
            </h1>
            <p>Chúng tôi cung cấp giải pháp cửa cuốn toàn diện, đáp ứng mọi nhu cầu của khách hàng với chất lượng tốt nhất và giá cả hợp lý.</p>

            <div className="hero-navy-checks">
              <span><Clock3 /> Có mặt 15-30 phút</span>
              <span><ShieldCheck /> Bảo hành dài hạn</span>
              <span><BadgeCheck /> Giá cả minh bạch</span>
            </div>

            <div className="hero-navy-actions">
              <a href={site.hotlineHref} className="btn-hero-primary"><Phone size={17} /> {site.hotline}</a>
              <Link href="/san-pham" className="btn-hero-outline">XEM SẢN PHẨM</Link>
            </div>
          </div>

          <div className="hero-navy-visual">
            <div className="hero-img-main">
              <Wrench size={60} style={{ opacity: 0.3 }} />
            </div>
            <div className="hero-img-circle-1"></div>
            <div className="hero-img-circle-2"></div>
          </div>
        </div>
      </section>

      {/* ========== TRUST BAR ========== */}
      <div className="trust-bar-navy">
        <div className="container">
          <div className="trust-navy-grid">
            <div className="trust-item">
              <div className="trust-item-icon"><Wrench /></div>
              <div className="trust-item-text"><b>SỬA CHỮA 24/7</b><span>Hỗ trợ mọi lúc, mọi nơi</span></div>
            </div>
            <div className="trust-item">
              <div className="trust-item-icon"><Settings /></div>
              <div className="trust-item-text"><b>LẮP ĐẶT CHUYÊN NGHIỆP</b><span>Đội ngũ kỹ thuật lành nghề</span></div>
            </div>
            <div className="trust-item">
              <div className="trust-item-icon"><Package /></div>
              <div className="trust-item-text"><b>LINH KIỆN CHÍNH HÃNG</b><span>Cam kết 100% chính hãng</span></div>
            </div>
            <div className="trust-item">
              <div className="trust-item-icon"><ShieldCheck /></div>
              <div className="trust-item-text"><b>BẢO HÀNH DÀI HẠN</b><span>Lên đến 36 tháng</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PRODUCTS ========== */}
      <section className="section-navy-products">
        <div className="container">
          <div className="navy-section-header">
            <span className="kicker">SẢN PHẨM</span>
            <h2>CÁC LOẠI CỬA CUỐN CHẤT LƯỢNG CAO</h2>
            <p>Đa dạng mẫu mã - Chất lượng vượt trội - Giá tốt nhất thị trường</p>
          </div>
          <div className="navy-product-grid">
            {featuredProducts.slice(0, 5).map((product) => (
              <article className="navy-product-card" key={product.slug}>
                <div className="navy-product-image">
                  {product.images[0]?.url ? (
                    <img src={product.images[0].url} alt={product.images[0]?.altText || product.name} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#dde1e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={40} style={{ color: "#9ca3af" }} />
                    </div>
                  )}
                </div>
                <div className="navy-product-card-body">
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                  <Link href={`/san-pham/${product.slug}`} className="navy-link">
                    XEM CHI TIẾT <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="navy-view-all">
            <Link href="/san-pham" className="btn-navy-solid">XEM TẤT CẢ SẢN PHẨM</Link>
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="section-navy-services">
        <div className="container">
          <div className="navy-section-header">
            <span className="kicker">DỊCH VỤ</span>
            <h2>DỊCH VỤ CỦA CHÚNG TÔI</h2>
            <p>Chúng tôi cung cấp dịch vụ toàn diện cho mọi nhu cầu về cửa cuốn</p>
          </div>
          <div className="navy-service-grid">
            <article className="navy-service-card">
              <div className="service-icon-wrap"><Wrench /></div>
              <h3>SỬA CHỮA CỬA CUỐN</h3>
              <p>Khắc phục mọi sự cố cửa cuốn nhanh chóng, hiệu quả</p>
              <Link href="/dich-vu" className="navy-link">XEM CHI TIẾT <ArrowRight size={12} /></Link>
            </article>
            <article className="navy-service-card">
              <div className="service-icon-wrap"><Settings /></div>
              <h3>LẮP ĐẶT CỬA CUỐN</h3>
              <p>Lắp đặt mới cửa cuốn chính hãng, đúng kỹ thuật</p>
              <Link href="/dich-vu" className="navy-link">XEM CHI TIẾT <ArrowRight size={12} /></Link>
            </article>
            <article className="navy-service-card">
              <div className="service-icon-wrap"><Cpu /></div>
              <h3>BẢO TRÌ CỬA CUỐN</h3>
              <p>Bảo trì định kỳ giúp cửa hoạt động bền bỉ, an toàn</p>
              <Link href="/dich-vu" className="navy-link">XEM CHI TIẾT <ArrowRight size={12} /></Link>
            </article>
            <article className="navy-service-card">
              <div className="service-icon-wrap"><Package /></div>
              <h3>THAY THẾ PHỤ KIỆN</h3>
              <p>Cung cấp và thay thế phụ kiện cửa cuốn chính hãng</p>
              <Link href="/dich-vu" className="navy-link">XEM CHI TIẾT <ArrowRight size={12} /></Link>
            </article>
          </div>
        </div>
      </section>

      {/* ========== WHY US + STATS ========== */}
      <section className="section-navy-stats">
        <div className="container">
          <div className="navy-stats-layout">
            <div className="navy-stats-content">
              <span className="navy-kicker-left">VÌ SAO CHỌN CHÚNG TÔI</span>
              <h2>UY TÍN TẠO NÊN THƯƠNG HIỆU</h2>
              <p>Với nhiều năm kinh nghiệm trong lĩnh vực cửa cuốn, chúng tôi cam kết mang đến dịch vụ tốt nhất cho khách hàng.</p>
              <ul className="navy-check-list">
                <li><CheckCircle2 /> Đội ngũ kỹ thuật giàu kinh nghiệm</li>
                <li><CheckCircle2 /> Sản phẩm chính hãng, chất lượng cao</li>
                <li><CheckCircle2 /> Giá cả cạnh tranh, minh bạch</li>
                <li><CheckCircle2 /> Bảo hành dài hạn, hỗ trợ tận tâm</li>
              </ul>
              <Link href="/lien-he" className="btn-yellow-solid">TÌM HIỂU THÊM</Link>
            </div>
            <div className="navy-stats-grid">
              <div className="stat-box">
                <span className="stat-icon"><Clock3 /></span>
                <span className="stat-num">10+</span>
                <span className="stat-label">NĂM KINH NGHIỆM</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon"><ShieldCheck /></span>
                <span className="stat-num">5000+</span>
                <span className="stat-label">KHÁCH HÀNG HÀI LÒNG</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon"><Settings /></span>
                <span className="stat-num">10000+</span>
                <span className="stat-label">CÔNG TRÌNH THỰC HIỆN</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon"><Phone /></span>
                <span className="stat-num">24/7</span>
                <span className="stat-label">HỖ TRỢ KHÁCH HÀNG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROJECTS ========== */}
      <section className="section-navy-projects">
        <div className="container">
          <div className="navy-section-header">
            <span className="kicker">DỰ ÁN TIÊU BIỂU</span>
            <h2>MỘT SỐ CÔNG TRÌNH ĐÃ THỰC HIỆN</h2>
          </div>
          <div className="navy-project-strip">
            {projects.slice(0, 5).map((project) => (
              <Link href={`/du-an/${project.slug}`} key={project.slug} className="navy-project-item">
                <div className="navy-project-image">
                  <div className="placeholder-image"></div>
                </div>
                <div className="navy-project-label">{project.name} - {project.location}</div>
              </Link>
            ))}
          </div>
          <div className="navy-view-all">
            <Link href="/du-an" className="btn-navy-outline">XEM THÊM DỰ ÁN</Link>
          </div>
        </div>
      </section>

      {/* ========== CTA BAND ========== */}
      <div className="navy-cta-band">
        <div className="container navy-cta-inner">
          <div className="cta-left">
            <h2>CẦN HỖ TRỢ NGAY?</h2>
            <p>Liên hệ chúng tôi để được tư vấn và hỗ trợ nhanh chóng 24/7</p>
          </div>
          <div className="cta-right">
            <div className="cta-phone">
              <div className="cta-phone-icon"><Phone /></div>
              <div className="cta-phone-text">
                <b>{site.hotline}</b>
                <span>Hotline miễn phí 24/7</span>
              </div>
            </div>
            <a href={site.hotlineHref} className="btn-yellow-solid">GỌI NGAY</a>
          </div>
        </div>
      </div>
    </>
  );
}
