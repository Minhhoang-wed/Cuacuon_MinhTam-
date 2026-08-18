import type { MetadataRoute } from "next";
import { articles, projects, services } from "@/data/content";
import { getCategories, getProducts, getSiteSettings } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, products, categories] = await Promise.all([getSiteSettings(), getProducts(), getCategories()]);
  const base = site.baseUrl.replace(/\/$/, "");
  const staticRoutes = ["", "/ve-chung-toi", "/dich-vu", "/san-pham", "/du-an", "/tin-tuc", "/lien-he"];
  const staticEntries = [...staticRoutes, ...services.map((x) => `/dich-vu/${x.slug}`), ...projects.map((x) => `/du-an/${x.slug}`), ...articles.map((x) => `/tin-tuc/${x.slug}`)].map((route) => ({ url: `${base}${route}` }));
  const categoryEntries = categories.map((category) => ({ url: `${base}/danh-muc/${category.slug}`, ...(category.updatedAt ? { lastModified: new Date(category.updatedAt) } : {}) }));
  const productEntries = products.map((product) => ({ url: `${base}/san-pham/${product.slug}`, ...(product.updatedAt ? { lastModified: new Date(product.updatedAt) } : {}) }));
  return [...staticEntries, ...categoryEntries, ...productEntries];
}
