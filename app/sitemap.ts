import type { MetadataRoute } from "next";
import { articles, projects, services } from "@/data/content";
import { getCategories, getProducts, getSiteSettings } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, products, categories] = await Promise.all([getSiteSettings(), getProducts(), getCategories()]);
  const base = site.baseUrl.replace(/\/$/, "");
  const staticRoutes = ["", "/ve-chung-toi", "/dich-vu", "/san-pham", "/du-an", "/tin-tuc", "/lien-he"];
  const dynamic = [...services.map((x) => `/dich-vu/${x.slug}`), ...categories.map((x) => `/danh-muc/${x.slug}`), ...products.map((x) => `/san-pham/${x.slug}`), ...projects.map((x) => `/du-an/${x.slug}`), ...articles.map((x) => `/tin-tuc/${x.slug}`)];
  return [...staticRoutes, ...dynamic].map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route ? "monthly" : "weekly", priority: route ? 0.7 : 1 }));
}
