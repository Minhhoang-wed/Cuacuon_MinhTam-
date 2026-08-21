import type { Metadata } from "next";
import { Clock3, MapPin, Phone, ShieldCheck, Zap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getServiceDistricts, getSiteSettings, getStoreBranches } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Khu vực phục vụ sửa cửa cuốn toàn TP.HCM | Minh Tâm Door",
  description:
    "2 chi nhánh cửa hàng trực tiếp tại Quận 10, Quận 6 và đội ngũ kỹ thuật viên túc trực tại tất cả các quận huyện TP.HCM. Có mặt nhanh chóng trong 15-30 phút.",
  alternates: { canonical: "/khu-vuc-phuc-vu" },
};

export default async function ServiceAreaPage() {
  const [site, storeBranches, serviceDistricts] = await Promise.all([
    getSiteSettings(),
    getStoreBranches(),
    getServiceDistricts(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Phủ sóng toàn TP.HCM"
        title="Hệ Thống Cửa Hàng & Mạng Lưới Kỹ Thuật Tận Nơi"
        description="Minh Tâm Door sở hữu các cửa hàng trực tiếp và đội ngũ kỹ thuật viên thường trực tại tất cả các quận huyện TP.HCM, sẵn sàng có mặt nhanh sau 15 - 30 phút."
        image="/images/area-hero-banner.jpg"
        cardOverlay={true}
      />

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

          <div className="repair-section-heading compact">
            <span>Tiếp nhận nhanh 24/7</span>
            <h2>Đội ngũ kỹ thuật túc trực tại các quận huyện ({serviceDistricts.length} điểm)</h2>
            <p>Kỹ thuật viên tại chỗ có mặt sau 15 – 30 phút, quý khách ở bất kỳ quận nào cũng không phải chờ đợi lâu.</p>
          </div>

          <div className="repair-area-panel">
            <div className="repair-area-panel-heading">
              <span>Đội kỹ thuật lưu động 24/7</span>
              <p>Kỹ thuật viên túc trực tại chỗ ở từng quận huyện · 15 - 30 phút có mặt tận nơi xử lý sự cố.</p>
            </div>
            <div className="repair-area-list">
              {serviceDistricts.map((item) => (
                <a href={site.hotlineHref} className="repair-area-row" key={item.id || item.districtName}>
                  <MapPin size={18} />
                  <span>
                    <b>{item.districtName}</b>
                    <em>{item.addressLandmark}</em>
                    <small>{item.responseTime} {item.note ? `· ${item.note}` : ""}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
