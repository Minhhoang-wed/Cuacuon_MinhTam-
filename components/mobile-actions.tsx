import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function MobileActions({ site }: { site: ManagedSiteConfig }) {
  return (
    <div className="mobile-actions" aria-label="Liên hệ nhanh">
      <a href={site.hotlineHref}><Phone size={20} /><span>Gọi ngay</span></a>
      <a href={site.zaloHref} target="_blank" rel="noreferrer"><MessageCircle size={20} /><span>Zalo</span></a>
      <Link href="/lien-he#dat-lich"><CalendarCheck size={20} /><span>Đặt lịch</span></Link>
    </div>
  );
}
