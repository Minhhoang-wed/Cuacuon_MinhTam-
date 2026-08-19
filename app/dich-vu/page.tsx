import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, MessageCircle, Phone, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { repairServices, servicePriceCategories } from "@/data/public-home";
import { getSiteSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Bảng báo giá dịch vụ sửa cửa cuốn Minh Tâm Door",
  description:
    "Bảng báo giá dịch vụ sửa cửa cuốn, motor, remote, bình lưu điện UPS và thay thế linh kiện cửa cuốn tận nơi tại TP.HCM. Hotline: 0327.359.368.",
  alternates: { canonical: "/dich-vu" },
};

export default async function ServicesPage() {
  const site = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Dịch vụ tận nơi 24/7"
        title="Đúng lỗi. Đúng giải pháp. Đúng phần cần sửa."
        description="Báo giá rõ ràng, minh bạch trước khi làm. Kỹ thuật viên kiểm tra thực tế, tư vấn phương án tối ưu và bảo hành dài hạn từ 3 - 24 tháng."
        image="/images/service-hero-banner.jpg"
      />

      {/* 6 Khối Dịch vụ Nổi bật có gắn giá và bảo hành */}
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="repair-section-heading">
            <span>Dịch vụ kỹ thuật chuyên sâu</span>
            <h2>Các hạng mục sửa chữa cửa cuốn phổ biến</h2>
            <p>Khảo sát tận nơi sau 15 - 30 phút, báo giá minh bạch trước khi sửa.</p>
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

      {/* BẢNG BÁO GIÁ DỊCH VỤ CỬA CUỐN MINH TÂM DOOR */}
      <section className="section repair-price-table-section" id="bang-bao-gia" style={{ background: "var(--bg-stone)", padding: "80px 0" }}>
        <div className="container">
          <div className="repair-section-heading">
            <span>Báo giá minh bạch & Tận tâm</span>
            <h2>BẢNG BÁO GIÁ DỊCH VỤ CỬA CUỐN MINH TÂM DOOR</h2>
            <p>Áp dụng cho dịch vụ sửa chữa, cứu hộ và thay thế linh kiện cửa cuốn tận nơi tại TP.HCM.</p>
          </div>

          {/* 4 Bảng giá chi tiết theo danh mục khách hàng cung cấp */}
          <div className="repair-price-tables-grid">
            {servicePriceCategories.map((cat) => (
              <div className="repair-price-category-card" key={cat.categoryTitle}>
                <div className="repair-price-category-header">
                  <h3 style={{ color: "#ffffff", margin: 0 }}>{cat.categoryTitle}</h3>
                </div>
                <div className="repair-price-table-wrap">
                  <table className="repair-price-table">
                    <thead>
                      <tr>
                        <th>Hạng mục sửa chữa / Dịch vụ</th>
                        <th>Mức giá tham khảo</th>
                        <th>Bảo hành</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map((item) => (
                        <tr key={item.name}>
                          <td><b>{item.name}</b></td>
                          <td className="price-cell">{item.price}</td>
                          <td><span className="warranty-tag">{item.warranty}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
