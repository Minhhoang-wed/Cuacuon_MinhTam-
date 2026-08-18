import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getSiteSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Liên hệ & Tư vấn qua Zalo / Hotline",
  description: "Liên hệ nhanh qua Zalo và Hotline để được kỹ thuật viên hỗ trợ báo giá và khảo sát tận nơi.",
  alternates: { canonical: "/lien-he" },
};

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="TƯ VẤN & BÁO GIÁ NHANH"
        title="Liên Hệ Trực Tiếp Với Chúng Tôi"
        description="Gửi hình ảnh hiện trạng hoặc kích thước cửa cuốn qua Zalo để nhận tư vấn và báo giá chi tiết trong 2-5 phút."
        image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1600&q=82"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", alignItems: "start" }}>
            
            {/* Box Zalo Chính */}
            <div style={{
              background: "linear-gradient(135deg, #0068ff 0%, #004ecc 100%)",
              color: "#ffffff",
              padding: "40px 32px",
              borderRadius: "20px",
              boxShadow: "0 12px 36px rgba(0, 104, 255, 0.22)",
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.18)", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
                <Sparkles size={15} /> Kênh nhận báo giá nhanh nhất
              </div>
              <h2 style={{ fontSize: "28px", fontFamily: "var(--font-heading)", color: "#ffffff", marginBottom: "12px", lineHeight: 1.3 }}>
                Gửi ảnh & Yêu cầu qua Zalo
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px" }}>
                Chỉ cần chụp ảnh vị trí lắp đặt hoặc quay video sự cố cửa cuốn gửi qua Zalo, kỹ thuật viên sẽ tư vấn phương án và gửi báo giá chính xác ngay.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "14px" }}>
                  <CheckCircle2 size={18} color="#93c5fd" /> Phản hồi & báo giá chỉ sau 2 - 5 phút
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "14px" }}>
                  <CheckCircle2 size={18} color="#93c5fd" /> Nhận gửi mẫu nan nhôm & catalogue tận nơi
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
                  <CheckCircle2 size={18} color="#93c5fd" /> Tư vấn miễn phí 24/7 (Cả Thứ 7, CN & Ngày lễ)
                </div>
              </div>

              <a
                href={site.zaloHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  height: "52px",
                  background: "#ffffff",
                  color: "#0056cc",
                  fontWeight: 700,
                  fontSize: "16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s ease",
                }}
              >
                <MessageCircle size={20} />
                <span>Mở Zalo Nhận Báo Giá Ngay</span>
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Box Hotline & Địa chỉ */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              padding: "36px 32px",
              borderRadius: "20px",
            }}>
              <span className="kicker" style={{ display: "block", marginBottom: "8px" }}>HỖ TRỢ KHẨN CẤP</span>
              <h2 style={{ fontSize: "24px", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
                Gọi Hotline Trực Tiếp 24/7
              </h2>
              <p style={{ color: "#64748b", fontSize: "14.5px", lineHeight: 1.6, marginBottom: "24px" }}>
                Nếu cửa bị kẹt, hư motor hoặc cần hỗ trợ kỹ thuật gấp, quý khách vui lòng bấm gọi ngay hotline bên dưới.
              </p>

              <a
                href={site.hotlineHref}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "14px",
                  textDecoration: "none",
                  color: "#92400e",
                  marginBottom: "20px",
                }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#f59e0b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <small style={{ display: "block", fontSize: "12px", color: "#b45309", fontWeight: 600 }}>TỔNG ĐÀI TIẾP NHẬN 24/7</small>
                  <b style={{ fontSize: "20px", color: "#78350f" }}>{site.hotline}</b>
                </div>
              </a>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
                <a
                  href={site.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: "var(--text-body)", textDecoration: "none", fontSize: "14px" }}
                >
                  <MapPin size={18} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{site.address}</span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-body)", textDecoration: "none", fontSize: "14px" }}
                >
                  <Mail size={18} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                  <span>{site.email}</span>
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748b", fontSize: "14px" }}>
                  <Clock3 size={18} style={{ flexShrink: 0 }} />
                  <span>{site.hours} — Phục vụ tất cả các quận huyện</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

