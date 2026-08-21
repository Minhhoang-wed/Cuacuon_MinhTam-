import type { Metadata, Viewport } from "next";
import "@cloudimage/360-view/css";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const canonicalUrl = site.seoCanonicalBase || site.baseUrl;
  const isNoIndex = site.robotsIndex === "noindex";
  const isNoFollow = site.robotsFollow === "nofollow";

  return {
    metadataBase: new URL(canonicalUrl),
    title: {
      default: `${site.name} | Sửa cửa cuốn TP.HCM`,
      template: site.seoTitleTemplate || `%s | ${site.shortName}`,
    },
    description: site.description,
    keywords: site.seoKeywords
      ? site.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : ["sửa cửa cuốn", "sửa cửa cuốn TP.HCM", "cửa cuốn", "motor cửa cuốn", "phụ kiện cửa cuốn"],
    alternates: { canonical: "/" },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
    },
    // Google Search Console verification (replace with your actual verification code)
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    },
    // Local SEO geo meta tags
    other: {
      "geo.region": "VN-SG",
      "geo.placename": site.structuredAddressLocality || "TP. Hồ Chí Minh",
      "geo.position": "10.7769;106.7009",
      "ICBM": "10.7769, 106.7009",
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
      title: site.ogTitle || site.name,
      description: site.ogDescription || site.description,
      images: [
        {
          url: site.ogImageUrl || "/og.png",
          width: 1200,
          height: 630,
          alt: `${site.name} - tiếp nhận yêu cầu 24/7`,
        },
      ],
    },
    twitter: {
      card: site.twitterCard || "summary_large_image",
      title: site.twitterTitle || site.name,
      description: site.twitterDescription || site.description,
      images: [site.twitterImageUrl || site.ogImageUrl || "/og.png"],
    },
  };
}

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
