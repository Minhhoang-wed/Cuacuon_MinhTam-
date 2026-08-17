import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { RequestForm } from "@/components/request-form";
import { getSiteSettings } from "@/lib/catalog";

export const metadata: Metadata = { title: "Liên hệ & đặt lịch sửa chữa", description: "Gửi yêu cầu sửa cửa cuốn với họ tên, điện thoại, địa chỉ, tình trạng, thời gian và ảnh lỗi." };

export default async function ContactPage() {
  const site = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="Liên hệ nhanh" title="Một yêu cầu rõ ràng giúp xử lý nhanh hơn." description="Nếu tình trạng có nguy cơ rơi cửa, chập điện hoặc kẹt người, hãy gọi hotline và giữ khoảng cách an toàn." />
      <section className="section" id="dat-lich">
        <div className="container contact-grid">
          <div className="contact-aside">
            <span className="kicker">Kênh liên hệ</span><h2>Chọn cách thuận tiện nhất.</h2><p>Form là kênh ghi nhận ban đầu. Lịch chỉ được xác nhận sau khi nhân sự gọi lại hoặc nhắn Zalo.</p>
            <div className="contact-cards">
              <a href={site.hotlineHref}><Phone /><span><small>Hotline 24/7</small><b>{site.hotline}</b></span></a>
              <a href={site.zaloHref} target="_blank" rel="noreferrer"><MessageCircle /><span><small>Gửi ảnh nhanh</small><b>Chat qua Zalo</b></span></a>
              <a href={site.mapsHref} target="_blank" rel="noreferrer"><MapPin /><span><small>Địa chỉ</small><b>{site.address}</b></span></a>
              <a href={`mailto:${site.email}`}><Mail /><span><small>Email</small><b>{site.email}</b></span></a>
            </div>
            <div className="response-note"><Clock3 /><p><b>Phản hồi dự kiến 5–10 phút</b><br />Trong giờ cao điểm hoặc thời tiết xấu, thời gian có thể lâu hơn.</p></div>
          </div>
          <RequestForm />
        </div>
      </section>
    </>
  );
}
