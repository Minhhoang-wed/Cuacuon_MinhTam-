"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

// ── Fingerprint: lightweight hash from browser properties ──
async function getFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "server";
  try {
    const raw = [
      navigator.userAgent,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.language,
      navigator.platform,
    ].join("|");

    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "guest-" + Math.random().toString(36).slice(2, 10);
  }
}

// ── Session ID (per-tab, resets on close) ──
function getSessionId(): string {
  if (typeof window === "undefined") return "session";
  let sid = sessionStorage.getItem("_at_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_at_sid", sid);
  }
  return sid;
}

// ── Parse UTM params ──
function getUTMParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

// ── Send tracking data ──
function sendTrack(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    // Send via fetch with keepalive first for fast immediate delivery, fallback to beacon
    if (typeof fetch !== "undefined") {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } else if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    }
  } catch {
    // silent
  }
}

/**
 * AnalyticsTracker — invisible component mounted in SiteShell.
 * Automatically tracks page views, scroll depth, time on page, and CTA clicks.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const fpRef = useRef<string>("");
  const sidRef = useRef<string>("");
  const currentPathRef = useRef<string>("");
  const entryTimeRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0);
  const hasInteractedRef = useRef<boolean>(false);
  const visitedPathsRef = useRef<Set<string>>(new Set());

  // ── Track Page View on Route Change ──
  useEffect(() => {
    // Don't track admin pages
    if (!pathname || pathname.startsWith("/admin")) return;

    let isMounted = true;

    async function initTrack() {
      if (!fpRef.current) fpRef.current = await getFingerprint();
      if (!sidRef.current) sidRef.current = getSessionId();

      if (!isMounted) return;

      // If switching from previous page, send duration update
      if (currentPathRef.current && currentPathRef.current !== pathname) {
        const duration = Date.now() - entryTimeRef.current;
        sendTrack({
          type: "update",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: currentPathRef.current,
          duration_ms: duration,
          scroll_depth: maxScrollRef.current,
          is_bounce: !hasInteractedRef.current && visitedPathsRef.current.size <= 1,
        });
      }

      // Record new page view
      currentPathRef.current = pathname;
      entryTimeRef.current = Date.now();
      maxScrollRef.current = 0;
      hasInteractedRef.current = visitedPathsRef.current.size > 0;
      visitedPathsRef.current.add(pathname);

      const utm = getUTMParams();

      sendTrack({
        type: "page_view",
        visitor_id: fpRef.current,
        session_id: sidRef.current,
        page_path: pathname,
        page_title: typeof document !== "undefined" ? document.title : "",
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        ...utm,
        _hp: "",
      });
    }

    initTrack();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // ── Scroll & Interaction Tracking ──
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const depth = Math.round((scrollTop / scrollHeight) * 100);
      if (depth > maxScrollRef.current) {
        maxScrollRef.current = depth;
      }
      if (depth > 50) hasInteractedRef.current = true;
    }
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    hasInteractedRef.current = true;

    if (link) {
      const href = link.getAttribute("href") || "";

      // Phone click
      if (href.startsWith("tel:")) {
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "cta_click",
          event_target: "hotline",
          event_data: { href },
        });
        return;
      }

      // Zalo click
      if (href.includes("zalo.me")) {
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "cta_click",
          event_target: "zalo",
          event_data: { href },
        });
        return;
      }

      // Messenger click
      if (href.includes("m.me") || href.includes("messenger")) {
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "cta_click",
          event_target: "messenger",
          event_data: { href },
        });
        return;
      }

      // Facebook click
      if (href.includes("facebook.com")) {
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "cta_click",
          event_target: "facebook",
          event_data: { href },
        });
        return;
      }

      // Content item click
      if (href.startsWith("/san-pham/") && href.split("/").length > 2) {
        const slug = href.split("/").pop();
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "product_view",
          event_target: slug || href,
          event_data: { title: link.textContent?.trim().slice(0, 200) },
        });
      } else if (href.startsWith("/tin-tuc/") || href.startsWith("/meo-kien-thuc/")) {
        const slug = href.split("/").pop();
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "article_view",
          event_target: slug || href,
          event_data: { title: link.textContent?.trim().slice(0, 200) },
        });
      } else if (href.startsWith("/dich-vu/")) {
        const slug = href.split("/").pop();
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "service_view",
          event_target: slug || href,
          event_data: { title: link.textContent?.trim().slice(0, 200) },
        });
      }
    }

    // Form submit button
    const button = target.closest("button[type='submit'], .request-form button");
    if (button) {
      sendTrack({
        type: "event",
        visitor_id: fpRef.current,
        session_id: sidRef.current,
        page_path: window.location.pathname,
        event_type: "cta_click",
        event_target: "form_submit",
        event_data: { button_text: button.textContent?.trim().slice(0, 100) },
      });
    }
  }, []);

  const handleUnload = useCallback(() => {
    if (currentPathRef.current) {
      const duration = Date.now() - entryTimeRef.current;
      sendTrack({
        type: "update",
        visitor_id: fpRef.current,
        session_id: sidRef.current,
        page_path: currentPathRef.current,
        duration_ms: duration,
        scroll_depth: maxScrollRef.current,
        is_bounce: !hasInteractedRef.current && visitedPathsRef.current.size <= 1,
      });
    }
  }, []);

  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;
    const throttledScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScroll, 200);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("beforeunload", handleUnload);

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handleUnload();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(scrollTimer);
    };
  }, [handleScroll, handleClick, handleUnload]);

  return null;
}
