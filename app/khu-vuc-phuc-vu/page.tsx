import type { Metadata } from "next";
import { Clock3, MapPin, Phone, ShieldCheck, Zap } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageHero } from "@/components/page-hero";
import { getServiceDistricts, getSiteSettings, getStoreBranches } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng Tại TP.HCM và Hà Nội | Minh Tâm Door",
  description:
    "Hệ thống cửa hàng trực tiếp và đội ngũ kỹ thuật viên túc trực tại tất cả các quận huyện TP.HCM và Hà Nội. Có mặt nhanh chóng trong 15-30 phút.",
  alternates: { canonical: "/khu-vuc-phuc-vu" },
};

export default async function ServiceAreaPage() {
  const [site, storeBranches, serviceDistricts] = await Promise.all([
    getSiteSettings(),
    getStoreBranches(),
    getServiceDistricts(),
  ]);

  // Phân chia theo TP. Hồ Chí Minh và TP. Hà Nội
  const hanoiDistricts = serviceDistricts.filter(
    (d) =>
      d.districtName.toLowerCase().includes("hà nội") ||
      d.districtName.toLowerCase().includes("ha noi") ||
      d.districtName.toLowerCase().includes("(hn)")
  );

  const hcmDistricts = serviceDistricts.filter(
    (d) =>
      !d.districtName.toLowerCase().includes("hà nội") &&
      !d.districtName.toLowerCase().includes("ha noi") &&
      !d.districtName.toLowerCase().includes("(hn)")
  );

  return (
    <>
      <PageHero
        eyebrow="Phủ sóng TP.HCM & Hà Nội"
        title="Hệ Thống Cửa Hàng Tại TP.HCM và Hà Nội"
        description="Minh Tâm Door sở hữu các showroom trưng bày và mạng lưới kỹ thuật viên thường trực tại tất cả các quận huyện TP.HCM và Hà Nội, sẵn sàng có mặt nhanh sau 15 - 30 phút."
        image="/images/area-hero-banner.jpg"
        cardOverlay={true}
      />

      <div className="container">
        <Breadcrumb
          items={[{ name: "Khu vực phục vụ", href: "/khu-vuc-phuc-vu" }]}
          baseUrl={site.seoCanonicalBase || site.baseUrl}
        />
      </div>

      <section className="repair-area-band">
        <div className="container">
          <div className="repair-section-heading">
            <span>Điểm phục vụ trực tiếp</span>
            <h2>Hệ thống cửa hàng & Trung tâm kỹ thuật Minh Tâm Door ({storeBranches.length})</h2>
            <p>Quý khách có thể đến trực tiếp cửa hàng hoặc yêu cầu kỹ thuật viên đến tận nơi khảo sát, sửa chữa.</p>
          </div>

          {/* Danh sách Cửa hàng trực tiếp từ CMS */}
          <div className="direct-stores-grid">
            {storeBranches.map((store) => (
              <div className="direct-store-card" key={store.id || store.branchName}>
                <div className="direct-store-badge">
                  <MapPin size={17} /> {store.badge || "Cửa hàng trực tiếp"}
                </div>
                <h3>{store.branchName}</h3>
                <p className="direct-store-address">{store.address}</p>
                <div className="direct-store-footer">
                  <span>{store.note}</span>
                  <a href={`tel:${store.hotline.replace(/\D/g, "")}`} className="direct-store-phone">
                    <Phone size={15} /> {store.hotline}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 1. MẠNG LƯỚI TP. HỒ CHÍ MINH */}
          <div className="repair-section-heading compact" style={{ marginTop: "32px" }}>
            <span>Phủ sóng TP. Hồ Chí Minh</span>
            <h2>Đội ngũ kỹ thuật túc trực tại TP. Hồ Chí Minh ({hcmDistricts.length} điểm)</h2>
            <p>Kỹ thuật viên tại chỗ có mặt sau 15 – 30 phút, quý khách ở bất kỳ quận huyện nào tại TP.HCM cũng không phải chờ đợi lâu.</p>
          </div>

          <div className="repair-area-panel">
            <div className="repair-area-panel-heading">
              <span>Đội kỹ thuật lưu động TP.HCM 24/7</span>
              <p>Kỹ thuật viên túc trực tại chỗ ở từng quận huyện · 15 - 30 phút có mặt tận nơi xử lý sự cố.</p>
            </div>
            <div className="repair-area-list">
              {hcmDistricts.map((item) => (
                <a href={site.hotlineHref} className="repair-area-row" key={item.id || item.districtName}>
                  <MapPin size={18} />
                  <span>
                    <b>{item.districtName}</b>
                    {item.addressLandmark && item.addressLandmark.trim() ? (
                      <em>{item.addressLandmark}</em>
                    ) : null}
                    <small>{item.responseTime} {item.note ? `· ${item.note}` : ""}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 2. MẠNG LƯỚI TP. HÀ NỘI */}
          {hanoiDistricts.length > 0 && (
            <>
              <div className="repair-section-heading compact" style={{ marginTop: "56px" }}>
                <span>Phủ sóng TP. Hà Nội</span>
                <h2>Đội ngũ kỹ thuật túc trực tại TP. Hà Nội ({hanoiDistricts.length} quận huyện)</h2>
                <p>Đội ngũ kỹ sư & thợ sửa cửa cuốn túc trực 24/7 tại các quận nội thành và ngoại thành Hà Nội, xử lý nhanh mọi sự cố khẩn cấp.</p>
              </div>

              <div className="repair-area-panel">
                <div className="repair-area-panel-heading">
                  <span>Đội kỹ thuật lưu động TP. Hà Nội 24/7</span>
                  <p>Tiếp nhận yêu cầu cứu hộ & sửa chữa cửa cuốn tại các quận huyện Hà Nội · Có mặt sau 15 - 30 phút.</p>
                </div>
                <div className="repair-area-list">
                  {hanoiDistricts.map((item) => (
                    <a href={site.hotlineHref} className="repair-area-row" key={item.id || item.districtName}>
                      <MapPin size={18} />
                      <span>
                        <b>{item.districtName.replace(/\s*\(Hà Nội\)/gi, "")}</b>
                        {item.addressLandmark && item.addressLandmark.trim() ? (
                          <em>{item.addressLandmark}</em>
                        ) : null}
                        <small>{item.responseTime} {item.note ? `· ${item.note}` : "· Túc trực 24/7"}</small>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
