import { MessageCircle, Phone } from "lucide-react";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function MobileActions({ site }: { site: ManagedSiteConfig }) {
  return (
    <div className="mobile-actions" aria-label="Liên hệ nhanh">
      <a href={site.hotlineHref} className="mobile-action-call"><Phone size={20} /><span>Gọi ngay</span></a>
      <a href={site.zaloHref} target="_blank" rel="noreferrer" className="mobile-action-zalo"><MessageCircle size={20} /><span>Zalo tư vấn</span></a>
    </div>
  );
}

