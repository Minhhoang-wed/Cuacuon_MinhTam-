import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/catalog";

export async function CtaBand({ compact = false }: { compact?: boolean }) {
  const site = await getSiteSettings();
  return (
    <section className={`cta-band ${compact ? "compact" : ""}`}>
      <div className="container cta-band-inner">
        <div><span>Hỗ trợ nhanh 24/7</span><h2>Cần tư vấn hoặc sửa cửa cuốn gấp?</h2><p>Khảo sát và báo giá miễn phí. Kỹ thuật viên liên hệ xác nhận trước khi đến.</p></div>
        <div className="cta-band-actions">
          <a href={site.hotlineHref} className="button button-gold"><Phone size={18} /> {site.hotline}</a>
          <a href={site.zaloHref} target="_blank" rel="noreferrer" className="button button-outline"><MessageCircle size={18} /> Chat Zalo</a>
          <Link href="/lien-he#dat-lich" className="text-link light">Đặt lịch <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
