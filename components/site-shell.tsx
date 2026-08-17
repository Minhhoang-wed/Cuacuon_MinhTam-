"use client";

import { usePathname } from "next/navigation";
import { MobileActions } from "@/components/mobile-actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ManagedSiteConfig } from "@/lib/catalog";

export function SiteShell({ children, site }: { children: React.ReactNode; site: ManagedSiteConfig }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return <div className="public-site"><a className="skip-link" href="#main-content">Bỏ qua điều hướng</a><SiteHeader site={site} /><main id="main-content">{children}</main><SiteFooter site={site} /><MobileActions site={site} /></div>;
}
