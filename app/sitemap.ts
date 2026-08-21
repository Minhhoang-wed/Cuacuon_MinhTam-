import type { MetadataRoute } from "next";
import {
  getArticles,
  getCategories,
  getProducts,
  getProjects,
  getServices,
  getSiteSettings,
} from "@/lib/catalog";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, products, categories, projects, services, articles] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getCategories(),
    getProjects(),
    getServices(),
    getArticles(),
  ]);

  const base = (site.seoCanonicalBase || site.baseUrl).replace(/\/$/, "");

  // Main landing pages
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}`, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/dich-vu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/sua-cua-cuon`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/khu-vuc-phuc-vu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/san-pham`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/meo-kien-thuc`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/du-an`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tin-tuc`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ve-chung-toi`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic Service Detail Pages
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/dich-vu/${s.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
    ...(s.updatedAt ? { lastModified: new Date(s.updatedAt) } : {}),
  }));

  // Dynamic Category Pages
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/danh-muc/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    ...(cat.updatedAt ? { lastModified: new Date(cat.updatedAt) } : {}),
  }));

  // Dynamic Product Pages
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/san-pham/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
    ...(product.updatedAt ? { lastModified: new Date(product.updatedAt) } : {}),
  }));

  // Dynamic Project Pages
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/du-an/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    ...(project.updatedAt ? { lastModified: new Date(project.updatedAt) } : {}),
  }));

  // Dynamic Article Pages
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/tin-tuc/${article.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...categoryEntries,
    ...productEntries,
    ...projectEntries,
    ...articleEntries,
  ];
}
