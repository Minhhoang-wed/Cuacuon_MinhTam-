import type { Metadata } from "next";
import { Clock3, MapPin, Phone, ShieldCheck, Zap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { directStores, districtChips, serviceAreaPoints } from "@/data/public-home";
import { getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Khu vực phục vụ sửa cửa cuốn toàn TP.HCM | Minh Tâm Door",
  description:
    "2 chi nhánh cửa hàng trực tiếp tại Quận 10, Quận 6 và đội ngũ kỹ thuật viên túc trực tại tất cả các quận huyện TP.HCM. Có mặt nhanh chóng trong 15-30 phút.",
  alternates: { canonical: "/khu-vuc-phuc-vu" },
};

export default async function ServiceAreaPage() {
  const site = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Phủ sóng toàn TP.HCM"
        title="Hệ Thống Cửa Hàng & Mạng Lưới Kỹ Thuật Tận Nơi"
        description="Minh Tâm Door sở hữu 2 cửa hàng trực tiếp và đội ngũ kỹ thuật viên thường trực tại tất cả các quận huyện TP.HCM, sẵn sàng có mặt nhanh sau 15 - 30 phút."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=82"
      />

      <section className="repair-area-band" style={{ padding: "70px 0 90px", background: "var(--bg-stone)" }}>
        <div className="container">
          <div className="repair-section-heading">
            <span>Điểm phục vụ trực tiếp</span>
            <h2>Hệ thống cửa hàng & Trung tâm kỹ thuật Minh Tâm Door</h2>
            <p>Quý khách có thể đến trực tiếp cửa hàng hoặc yêu cầu kỹ thuật viên đến tận nơi khảo sát, sửa chữa.</p>
          </div>

          {/* 2 Cửa hàng trực tiếp */}
          <div className="direct-stores-grid" style={{ marginBottom: "50px" }}>
            {directStores.map((store) => (
              <div className="direct-store-card" key={store.branch}>
                <div className="direct-store-badge">
                  <MapPin size={17} /> Cửa hàng trực tiếp
                </div>
                <h3>{store.branch}</h3>
                <p className="direct-store-address">{store.address}</p>
                <div className="direct-store-footer">
                  <span>{store.note}</span>
                  <a href={`tel:${store.hotline.replace(/\./g, "")}`} className="direct-store-phone">
                    <Phone size={15} /> {store.hotline}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="repair-section-heading compact">
            <span>Tiếp nhận nhanh 24/7</span>
            <h2>Đội ngũ kỹ thuật túc trực tại tất cả các quận huyện</h2>
            <p>Kỹ thuật viên tại chỗ có mặt sau 15 – 30 phút, quý khách ở bất kỳ quận nào cũng không phải chờ đợi lâu.</p>
          </div>

          <div className="repair-area-panel" style={{ background: "#ffffff", padding: "36px 30px" }}>
            <div className="repair-area-panel-heading" style={{ marginBottom: "24px" }}>
              <span>Đội kỹ thuật lưu động 24/7</span>
              <p>Kỹ thuật viên túc trực tại chỗ ở từng quận huyện · 15 - 30 phút có mặt tận nơi xử lý sự cố.</p>
            </div>
            <div className="repair-area-list">
              {serviceAreaPoints.map((item) => (
                <a href={site.hotlineHref} className="repair-area-row" key={item.area}>
                  <MapPin size={18} />
                  <span>
                    <b>{item.area}</b>
                    <small>{item.note}</small>
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
