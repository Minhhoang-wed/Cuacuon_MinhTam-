import type { Metadata, Viewport } from "next";
import "@cloudimage/360-view/css";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> { const site = await getSiteSettings(); return { metadataBase: new URL(site.baseUrl), title: { default: `${site.name} | Sửa cửa cuốn TP.HCM`, template: `%s | ${site.shortName}` }, description: site.description, keywords: ["sửa cửa cuốn", "sửa cửa cuốn TP.HCM", "cửa cuốn", "motor cửa cuốn", "phụ kiện cửa cuốn"], alternates: { canonical: "/" }, openGraph: { type: "website", locale: "vi_VN", siteName: site.name, title: site.name, description: site.description, images: [{ url: "/og.png", width: 1732, height: 909, alt: `${site.name} - tiếp nhận yêu cầu 24/7` }] }, twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/og.png"] } }; }

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b2a3c" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <SiteShell site={site}>{children}</SiteShell>
      </body>
    </html>
  );
}
