import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { getSiteSettings } from "@/lib/catalog";

export async function CtaBand({ compact = false }: { compact?: boolean }) {
  const site = await getSiteSettings();
  return (
    <section className={`cta-band ${compact ? "compact" : ""}`}>
      <div className="container cta-band-inner">
        <div><span>Cần hỗ trợ ngay?</span><h2>Gửi tình trạng, chúng tôi liên hệ xác nhận.</h2></div>
        <div className="cta-band-actions">
          <a href={site.hotlineHref} className="button button-primary"><Phone size={18} /> {site.hotline}</a>
          <a href={site.zaloHref} target="_blank" rel="noreferrer" className="button button-outline"><MessageCircle size={18} /> Chat Zalo</a>
          <Link href="/lien-he#dat-lich" className="text-link light">Đặt lịch <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
