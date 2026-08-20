import type { ManagedSiteConfig } from "@/lib/catalog";

export function MobileActions({ site }: { site: ManagedSiteConfig }) {
  return (
    <div className="floating-zalo-wrap" aria-label="Liên hệ Zalo">
      <a
        href={site.zaloHref}
        target="_blank"
        rel="noreferrer"
        className="floating-zalo-btn"
        aria-label="Nhắn tin Zalo tư vấn miễn phí"
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

