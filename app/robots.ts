import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/catalog";

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSettings();
  const baseUrl = (site.seoCanonicalBase || site.baseUrl).replace(/\/$/, "");
  const isNoIndex = site.robotsIndex === "noindex";

  return {
    rules: {
      userAgent: "*",
      allow: isNoIndex ? [] : ["/"],
      disallow: isNoIndex ? ["/"] : ["/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
