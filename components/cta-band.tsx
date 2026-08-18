import { MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { getSiteSettings } from "@/lib/catalog";

export async function CtaBand({ compact = false }: { compact?: boolean }) {
  const site = await getSiteSettings();
  return (
    <section className={`cta-band ${compact ? "compact" : ""}`}>
      <div className="container cta-band-inner">
        <div>
          <span>HỖ TRỢ NHANH 24/7</span>
          <h2>Cần tư vấn hoặc báo giá cửa cuốn chính hãng?</h2>
          <p>Gửi ảnh hiện trạng hoặc kích thước qua Zalo để nhận báo giá chi tiết trong 2-5 phút.</p>
        </div>
        <div className="cta-band-actions">
          <a
            href={site.zaloHref}
            target="_blank"
            rel="noreferrer"
            className="button button-gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <MessageCircle size={18} /> Chat Zalo Nhận Báo Giá
          </a>
          <a
            href={site.hotlineHref}
            className="button-outline-light"
          >
            <Phone size={17} /> Hotline: {site.hotline}
          </a>
        </div>
      </div>
    </section>
  );
}


