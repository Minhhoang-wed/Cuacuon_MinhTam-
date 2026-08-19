import type { Metadata } from "next";
import { Clock3, MapPin, Phone, ShieldCheck, Zap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { districtChips, serviceAreaPoints } from "@/data/public-home";
import { getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Khu vực phục vụ sửa cửa cuốn TP.HCM",
  description:
    "Danh sách các quận, huyện và khu vực phục vụ sửa chữa, bảo trì và lắp đặt cửa cuốn tận nơi tại TP.HCM. Có mặt nhanh chóng trong 15-30 phút.",
  alternates: { canonical: "/khu-vuc-phuc-vu" },
};

export default async function ServiceAreaPage() {
  const site = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Phủ sóng toàn TP.HCM"
        title="Khu Vực Tiếp Nhận & Phục Vụ Tận Nơi"
        description="Đội ngũ kỹ thuật viên thường trực tại khắp các quận huyện TP.HCM, sẵn sàng có mặt nhanh sau 15 - 30 phút tiếp nhận yêu cầu."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=82"
      />

      <section className="repair-area-band" style={{ padding: "70px 0 90px", background: "var(--bg-stone)" }}>
        <div className="container">
          <div className="repair-section-heading">
            <span>Tiếp nhận nhanh 24/7</span>
            <h2>Các quận huyện tiếp nhận sửa cửa cuốn</h2>
            <p>Bấm vào khu vực của bạn để kết nối trực tiếp với kỹ thuật viên gần nhất.</p>
          </div>

          <div className="repair-district-list" aria-label="Các khu vực phục vụ tại TP.HCM" style={{ marginBottom: "40px" }}>
            {districtChips.map((district) => (
              <a href={site.hotlineHref} className="repair-district-pill" key={district}>
                <MapPin size={15} />
                {district}
              </a>
            ))}
          </div>

          <div className="repair-area-panel" style={{ background: "#ffffff", padding: "36px 30px" }}>
            <div className="repair-area-panel-heading" style={{ marginBottom: "28px" }}>
              <div>
                <span style={{ fontSize: "14px" }}>Mạng lưới hỗ trợ kỹ thuật TP.HCM</span>
                <h3 style={{ margin: "6px 0 0", fontSize: "22px", color: "var(--repair-navy-deep)" }}>
                  Có mặt nhanh trong 15 - 30 phút
                </h3>
              </div>
              <p>Danh sách các khu vực phân bổ kỹ thuật viên lưu động.</p>
            </div>
            <div className="repair-area-list">
              {serviceAreaPoints.map((area) => (
                <a href={site.hotlineHref} className="repair-area-row" key={area}>
                  <MapPin size={18} />
                  <span>
                    <b>{area}</b>
                    <small>Tiếp nhận yêu cầu sửa chữa cửa cuốn</small>
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
