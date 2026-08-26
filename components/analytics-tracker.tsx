"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Fingerprint: lightweight hash from browser properties ──
async function getFingerprint(): Promise<string> {
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
}

// ── Session ID (per-tab, resets on close) ──
function getSessionId(): string {
  let sid = sessionStorage.getItem("_at_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_at_sid", sid);
  }
  return sid;
}

// ── Parse UTM params ──
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

// ── Send tracking data ──
function sendTrack(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  // Prefer sendBeacon (non-blocking, works during unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/track", blob);
  } else {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

/**
 * AnalyticsTracker — invisible component mounted in root layout.
 * Automatically tracks page views, scroll depth, time on page, and CTA clicks.
 * Does NOT render any UI.
 */
export function AnalyticsTracker() {
  const fpRef = useRef<string>("");
  const sidRef = useRef<string>("");
  const pathRef = useRef<string>("");
  const entryTimeRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0);
  const hasInteractedRef = useRef<boolean>(false);
  const trackedPathsRef = useRef<Set<string>>(new Set());

  // ── Track page view ──
  const trackPageView = useCallback(async () => {
    if (!fpRef.current) fpRef.current = await getFingerprint();
    if (!sidRef.current) sidRef.current = getSessionId();

    const path = window.location.pathname;

    // Don't track admin pages
    if (path.startsWith("/admin")) return;

    // Send update for previous page before tracking new one
    if (pathRef.current && pathRef.current !== path) {
      const duration = Date.now() - entryTimeRef.current;
      sendTrack({
        type: "update",
        visitor_id: fpRef.current,
        session_id: sidRef.current,
        page_path: pathRef.current,
        duration_ms: duration,
        scroll_depth: maxScrollRef.current,
        is_bounce: !hasInteractedRef.current && trackedPathsRef.current.size <= 1,
      });
    }

    // Reset for new page
    pathRef.current = path;
    entryTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    hasInteractedRef.current = trackedPathsRef.current.size > 0; // Not a bounce if visited multiple pages
    trackedPathsRef.current.add(path);

    const utm = getUTMParams();

    sendTrack({
      type: "page_view",
      visitor_id: fpRef.current,
      session_id: sidRef.current,
      page_path: path,
      page_title: document.title,
      referrer: document.referrer || null,
      ...utm,
      _hp: "", // Honeypot field (should always be empty)
    });
  }, []);

  // ── Track scroll depth ──
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

  // ── Track CTA clicks ──
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

      // Outbound link
      if (href.startsWith("http") && !href.includes(window.location.hostname)) {
        sendTrack({
          type: "event",
          visitor_id: fpRef.current,
          session_id: sidRef.current,
          page_path: window.location.pathname,
          event_type: "outbound_click",
          event_target: href,
        });
        return;
      }

      // Internal product/article/service page click
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

    // Check for form submission button
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

  // ── Send final update on unload ──
  const handleUnload = useCallback(() => {
    if (pathRef.current) {
      const duration = Date.now() - entryTimeRef.current;
      sendTrack({
        type: "update",
        visitor_id: fpRef.current,
        session_id: sidRef.current,
        page_path: pathRef.current,
        duration_ms: duration,
        scroll_depth: maxScrollRef.current,
        is_bounce: !hasInteractedRef.current && trackedPathsRef.current.size <= 1,
      });
    }
  }, []);

  useEffect(() => {
    // Initial page view
    trackPageView();

    // Scroll tracking (throttled)
    let scrollTimer: ReturnType<typeof setTimeout>;
    const throttledScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScroll, 200);
    };

    // Listen for Next.js client-side navigation
    const observer = new MutationObserver(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== pathRef.current && !currentPath.startsWith("/admin")) {
        trackPageView();
      }
    });

    // Observe URL changes via title changes (Next.js updates <title> on navigation)
    observer.observe(document.querySelector("title") || document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    window.addEventListener("scroll", throttledScroll, { passive: true });
    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("beforeunload", handleUnload);

    // Also use visibilitychange for mobile (tab switch)
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        handleUnload();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", throttledScroll);
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(scrollTimer);
    };
  }, [trackPageView, handleScroll, handleClick, handleUnload]);

  // Render nothing — invisible tracker
  return null;
}
