import type { MetadataRoute } from "next";
import { articles, services } from "@/data/content";
import { getCategories, getProducts, getProjects, getSiteSettings } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, products, categories, projects] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getCategories(),
    getProjects(),
  ]);
  const base = site.baseUrl.replace(/\/$/, "");

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/san-pham`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/du-an`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/dich-vu`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tin-tuc`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ve-chung-toi`, changeFrequency: "monthly", priority: 0.6 },
    ...services.map((x) => ({ url: `${base}/dich-vu/${x.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((x) => ({ url: `${base}/tin-tuc/${x.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/danh-muc/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    ...(cat.updatedAt ? { lastModified: new Date(cat.updatedAt) } : {}),
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/san-pham/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
    ...(product.updatedAt ? { lastModified: new Date(product.updatedAt) } : {}),
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/du-an/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    ...(project.updatedAt ? { lastModified: new Date(project.updatedAt) } : {}),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...projectEntries];
}
