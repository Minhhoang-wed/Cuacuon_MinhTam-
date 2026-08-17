import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { PageHero } from "@/components/page-hero";
import { services } from "@/data/content";

export const metadata: Metadata = { title: "Dịch vụ sửa cửa cuốn", description: "Danh sách dịch vụ sửa chữa, bảo trì cửa cuốn và mức giá tham khảo tại TP.HCM." };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Dịch vụ tận nơi" title="Đúng lỗi. Đúng giải pháp. Đúng phần cần sửa." description="Giá dưới đây mang tính tham khảo. Mọi hạng mục chỉ được thực hiện sau khi khảo sát và có xác nhận của khách hàng." />
      <section className="section">
        <div className="container listing-grid">
          {services.map((service, index) => (
            <article className="listing-card" key={service.slug}>
              <DoorVisual label={`0${index + 1}`} kind="service" accent={index % 2 ? "#d9f99d" : "#b9f5dc"} />
              <div className="listing-card-body">
                <div className="card-meta"><span><Clock3 /> {service.duration}</span><span><ShieldCheck /> {service.warranty}</span></div>
                <h2>{service.name}</h2><p>{service.summary}</p>
                <div className="card-price"><span>Giá tham khảo</span><b>{service.price}</b></div>
                <Link href={`/dich-vu/${service.slug}`} className="text-link">Xem chi tiết <ArrowRight size={17} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-tint">
        <div className="container value-panel">
          <div><span className="kicker">Cam kết phục vụ</span><h2>Không biến một lỗi nhỏ thành hóa đơn lớn.</h2></div>
          <div className="check-stack">
            <span><CheckCircle2 /> Kiểm tra và giải thích nguyên nhân</span>
            <span><CheckCircle2 /> Xác nhận giá trước khi thực hiện</span>
            <span><CheckCircle2 /> Linh kiện thay thế có thông tin bảo hành</span>
            <span><CheckCircle2 /> Chạy thử và bàn giao sau sửa chữa</span>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
