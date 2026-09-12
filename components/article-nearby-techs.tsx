"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";

interface ArticleNearbyTechsProps {
  hotline?: string;
  zaloUrl?: string;
  className?: string;
  articleTitle?: string;
  articleSlug?: string;
}

/**
 * Unified Sticky Nearby Technicians Bar ("Đang có 5 thợ trực gần bạn (cách 2km)")
 * Displayed on both Desktop & Mobile. Follows screen when scrolling.
 * Features Zalo button styled with homepage blue (#0f5fd7) and white text.
 */
export function ArticleNearbyTechs({
  hotline = "0327 359 368",
  zaloUrl = "https://zalo.me/0327359368",
  className = "",
}: ArticleNearbyTechsProps) {
  const cleanPhone = hotline.replace(/[^\d]/g, "");

  return (
    <div
      className={`nearby-techs-sticky-bar ${className}`.trim()}
      role="region"
      aria-label="Thợ trực gần bạn"
    >
      <div className="nearby-bar-inner">
        {/* Left: Live radar dot + text matching user's illustration */}
        <div className="nearby-bar-info">
          <span className="nearby-bar-dot" aria-hidden="true">
            <span className="nearby-bar-ring"></span>
          </span>
          <span className="nearby-bar-text">
            Đang có <strong>5 thợ trực</strong>{" "}
            <span className="nearby-bar-near">gần bạn </span>
            <span className="nearby-bar-dist">
              (cách <strong>2km</strong>)
            </span>
          </span>
        </div>

        {/* Right: Quick Action Buttons (Gọi thợ & Zalo) */}
        <div className="nearby-bar-actions">
          <a
            href={`tel:${cleanPhone}`}
            className="nearby-bar-call-btn"
            title={`Gọi thợ trực tiếp (${hotline})`}
          >
            <Phone size={14} className="nearby-bar-phone-icon" />
            <span className="nearby-call-label-desktop">
              Gọi thợ: <b>{hotline}</b>
            </span>
            <span className="nearby-call-label-mobile">Gọi thợ</span>
          </a>

          {zaloUrl && (
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nearby-bar-zalo-btn"
              title="Chat Zalo hỗ trợ"
            >
              <MessageCircle size={14} />
              <span className="nearby-zalo-label-desktop">Zalo tư vấn</span>
              <span className="nearby-zalo-label-mobile">Zalo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Backwards-compatibility export for any previous mobile imports
export const ArticleNearbyTechsMobile = ArticleNearbyTechs;
