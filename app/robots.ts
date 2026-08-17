import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/catalog";
export default async function robots(): Promise<MetadataRoute.Robots> { const site = await getSiteSettings(); return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }, sitemap: `${site.baseUrl.replace(/\/$/, "")}/sitemap.xml` }; }
