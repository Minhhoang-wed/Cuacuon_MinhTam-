import { Phone } from "lucide-react";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function MobileActions({ site }: { site: ManagedSiteConfig }) {
  const phoneClean = (site.hotline || "0327359368").replace(/\s+/g, "");

  return (
    <div className="floating-contact-wrap" aria-label="Kênh liên hệ nhanh">
      {/* Nút Gọi Điện thoại tròn */}
      <a
        href={`tel:${phoneClean}`}
        className="floating-contact-btn floating-phone-btn"
        aria-label={`Gọi điện hotline ${site.hotline || "0327 359 368"}`}
        title="Gọi điện hotline ngay"
      >
        <span className="floating-phone-pulse" aria-hidden="true" />
        <span className="floating-phone-icon">
          <Phone size={25} strokeWidth={2.4} />
        </span>
      </a>

      {/* Nút Zalo tròn */}
      <a
        href={site.zaloHref}
        target="_blank"
        rel="noreferrer"
        className="floating-contact-btn floating-zalo-btn"
        aria-label="Nhắn tin Zalo tư vấn miễn phí"
        title="Chat Zalo tư vấn"
      >
        <span className="floating-zalo-pulse" aria-hidden="true" />
        <img
          src="/images/zalo-icon.png"
          alt="Chat Zalo tư vấn"
          className="floating-zalo-img"
        />
      </a>
    </div>
  );
}

