import { MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function MobileActions({ site }: { site: ManagedSiteConfig }) {
  return (
    <div className="mobile-actions" aria-label="Liên hệ nhanh">
      <a href={site.hotlineHref} className="mobile-action-call"><Phone size={20} /><span>Gọi Hotline</span></a>
      <a href={site.zaloHref} target="_blank" rel="noreferrer" className="mobile-action-zalo"><MessageCircle size={20} /><span>Chat Zalo</span></a>
      <Link href="/lien-he"><MapPin size={20} /><span>Liên hệ</span></Link>
    </div>
  );
}

