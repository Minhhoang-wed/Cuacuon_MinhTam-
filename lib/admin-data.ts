import { getAdminAccessToken } from "@/lib/admin-auth";
import { getCategories, getHomepageContent, getProducts, getSiteSettings, getServices as getPublicServices, getArticles as getPublicArticles } from "@/lib/catalog";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";

export type AdminCategoryRow = { id: string; name: string; slug: string; description: string | null; image_path: string | null; sort_order: number; is_active: boolean };
export type AdminImageRow = { id: string; storage_path: string; alt_text: string | null; sort_order: number; is_primary: boolean };
export type AdminSpecRow = { id: string; spec_name: string; spec_value: string; group_name: string | null; sort_order: number };
export type AdminProductRow = { id: string; category_id: string; name: string; slug: string; short_description: string | null; description: string | null; price_mode: string; price_amount: number | null; price_label: string | null; currency: string; warranty: string | null; is_featured: boolean; status: string; sort_order: number; seo_title: string | null; seo_description: string | null; accent: string | null; updated_at: string; category?: { name: string; slug: string }; images?: AdminImageRow[]; specs?: AdminSpecRow[] };
export type MediaRow = { id: string; storage_path: string; file_name: string; alt_text: string | null; mime_type: string; size_bytes: number; created_at: string };

export type AdminProjectRow = {
  id: string;
  name: string;
  slug: string;
  location: string;
  category: string;
  summary: string;
  description: string | null;
  result: string | null;
  accent: string | null;
  is_featured: boolean;
  status: string;
  sort_order: number;
  updated_at: string;
  images?: AdminImageRow[];
};

export type AdminServiceRow = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string | null;
  price: string;
  duration: string;
  warranty: string;
  symptoms: string[];
  process: string[];
  accent: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;
};

export type AdminArticleRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string[];
  image_url: string | null;
  read_time: string;
  author: string;
  is_featured: boolean;
  status: string;
  sort_order: number;
  published_at: string;
  updated_at: string;
  created_at: string;
};

export type AdminServiceRequestRow = {
  id: string;
  request_code: string;
  name: string;
  phone: string;
  address: string;
  issue: string;
  preferred_time: string;
  preferred_date: string | null;
  images: string[];
  status: "new" | "contacted" | "in_progress" | "completed" | "cancelled";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminCategories() { if (!getSupabaseConfig()) return (await getCategories()).map((x) => ({ id: x.id, name: x.name, slug: x.slug, description: x.description, image_path: x.imagePath || null, sort_order: x.sortOrder, is_active: true })); const token = await getAdminAccessToken(); return supabaseFetch<AdminCategoryRow[]>("/rest/v1/categories?select=*&order=sort_order.asc,created_at.desc", { cache: "no-store" }, token); }
export async function getAdminProducts() { if (!getSupabaseConfig()) return (await getProducts()).map((x) => ({ id: x.id, category_id: x.category.id, name: x.name, slug: x.slug, short_description: x.shortDescription, description: x.description, price_mode: x.priceMode, price_amount: x.priceAmount, price_label: x.priceLabel, currency: x.currency, warranty: x.warranty, is_featured: x.featured, status: x.status, sort_order: 0, seo_title: x.seoTitle, seo_description: x.seoDescription, accent: x.accent, updated_at: new Date().toISOString(), category: { name: x.category.name, slug: x.category.slug }, images: x.images.map((i) => ({ id: i.id, storage_path: i.storagePath, alt_text: i.altText, sort_order: i.sortOrder, is_primary: i.isPrimary })), specs: x.specs.map((s) => ({ id: s.id, spec_name: s.name, spec_value: s.value, group_name: s.groupName, sort_order: s.sortOrder })) })); const token = await getAdminAccessToken(); return supabaseFetch<AdminProductRow[]>("/rest/v1/products?select=id,category_id,name,slug,short_description,price_mode,price_amount,price_label,currency,warranty,is_featured,status,sort_order,seo_title,seo_description,accent,updated_at,category:categories(name,slug)&order=updated_at.desc", { cache: "no-store" }, token); }
export async function getAdminProduct(id: string) { if (!getSupabaseConfig()) return (await getAdminProducts()).find((item) => item.id === id) || null; const token = await getAdminAccessToken(); const rows = await supabaseFetch<AdminProductRow[]>(`/rest/v1/products?select=*,category:categories(name,slug),images:product_images(*),specs:product_specs(*)&id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token); return rows[0] || null; }

export async function getAdminProjects(): Promise<AdminProjectRow[]> {
  if (!getSupabaseConfig()) return [];
  const token = await getAdminAccessToken();
  try {
    return await supabaseFetch<AdminProjectRow[]>(
      "/rest/v1/projects?select=*,images:project_images(id,storage_path,alt_text,sort_order,is_primary)&order=updated_at.desc",
      { cache: "no-store" },
      token
    );
  } catch (error) {
    console.error("Lỗi khi tải danh sách dự án từ Supabase:", error);
    return [];
  }
}

export async function getAdminProject(id: string): Promise<AdminProjectRow | null> {
  if (!getSupabaseConfig()) return null;
  const token = await getAdminAccessToken();
  try {
    const rows = await supabaseFetch<AdminProjectRow[]>(
      `/rest/v1/projects?select=*,images:project_images(id,storage_path,alt_text,sort_order,is_primary)&id=eq.${encodeURIComponent(
        id
      )}&limit=1`,
      { cache: "no-store" },
      token
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Lỗi khi tải thông tin dự án từ Supabase:", error);
    return null;
  }
}

export async function getAdminServices(): Promise<AdminServiceRow[]> {
  if (!getSupabaseConfig()) {
    const pub = await getPublicServices();
    return pub.map((s, idx) => ({
      id: `local-${idx}`,
      name: s.name,
      slug: s.slug,
      summary: s.summary,
      description: null,
      price: s.price,
      duration: s.duration,
      warranty: s.warranty,
      symptoms: s.symptoms,
      process: s.process,
      accent: "#10b981",
      sort_order: idx,
      is_active: true,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));
  }
  const token = await getAdminAccessToken();
  try {
    return await supabaseFetch<AdminServiceRow[]>("/rest/v1/services?select=*&order=sort_order.asc,created_at.desc", { cache: "no-store" }, token);
  } catch (error) {
    console.error("Lỗi khi tải dịch vụ:", error);
    return [];
  }
}

export async function getAdminService(id: string): Promise<AdminServiceRow | null> {
  if (!getSupabaseConfig()) {
    const all = await getAdminServices();
    return all.find((s) => s.id === id) || null;
  }
  const token = await getAdminAccessToken();
  try {
    const rows = await supabaseFetch<AdminServiceRow[]>(`/rest/v1/services?id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
    return rows[0] || null;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết dịch vụ:", error);
    return null;
  }
}

export async function getAdminArticles(): Promise<AdminArticleRow[]> {
  if (!getSupabaseConfig()) {
    const pub = await getPublicArticles();
    return pub.map((a, idx) => ({
      id: `local-${idx}`,
      title: a.title,
      slug: a.slug,
      category: a.category,
      excerpt: a.excerpt,
      content: a.content,
      image_url: null,
      read_time: a.readTime,
      author: "Kỹ Thuật Viên An Tâm",
      is_featured: idx === 0,
      status: "published",
      sort_order: idx,
      published_at: a.publishedAt,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));
  }
  const token = await getAdminAccessToken();
  try {
    return await supabaseFetch<AdminArticleRow[]>("/rest/v1/articles?select=*&order=sort_order.asc,created_at.desc", { cache: "no-store" }, token);
  } catch (error) {
    console.error("Lỗi khi tải bài viết:", error);
    return [];
  }
}

export async function getAdminArticle(id: string): Promise<AdminArticleRow | null> {
  if (!getSupabaseConfig()) {
    const all = await getAdminArticles();
    return all.find((a) => a.id === id) || null;
  }
  const token = await getAdminAccessToken();
  try {
    const rows = await supabaseFetch<AdminArticleRow[]>(`/rest/v1/articles?id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
    return rows[0] || null;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết bài viết:", error);
    return null;
  }
}

export async function getAdminServiceRequests(): Promise<AdminServiceRequestRow[]> {
  if (!getSupabaseConfig()) return [];
  const token = await getAdminAccessToken();
  try {
    return await supabaseFetch<AdminServiceRequestRow[]>("/rest/v1/service_requests?select=*&order=created_at.desc", { cache: "no-store" }, token);
  } catch (error) {
    console.error("Lỗi khi tải danh sách yêu cầu dịch vụ:", error);
    return [];
  }
}

export async function getAdminServiceRequest(id: string): Promise<AdminServiceRequestRow | null> {
  if (!getSupabaseConfig()) return null;
  const token = await getAdminAccessToken();
  try {
    const rows = await supabaseFetch<AdminServiceRequestRow[]>(`/rest/v1/service_requests?id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
    return rows[0] || null;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết yêu cầu:", error);
    return null;
  }
}

export async function getAdminMedia() { if (!getSupabaseConfig()) return []; const token = await getAdminAccessToken(); return supabaseFetch<MediaRow[]>("/rest/v1/media_assets?select=*&order=created_at.desc&limit=100", { cache: "no-store" }, token); }
export async function getAdminSettings() { if (!getSupabaseConfig()) { const x = await getSiteSettings(); return { company_name: x.name, short_name: x.shortName, site_description: x.description, hotline: x.hotline, zalo_url: x.zaloHref, email: x.email, address: x.address, facebook_url: x.facebookHref, messenger_url: x.messengerHref, maps_url: x.mapsHref, business_hours: x.hours, service_area: x.serviceArea }; } const token = await getAdminAccessToken(); const rows = await supabaseFetch<Array<Record<string,string | null>>>("/rest/v1/site_settings?id=eq.main&select=*&limit=1", { cache: "no-store" }, token); return rows[0] || {}; }
export async function getAdminHomepage() { if (!getSupabaseConfig()) { const x = await getHomepageContent(); return { hero_eyebrow: x.heroEyebrow, hero_title: x.heroTitle, hero_emphasis: x.heroEmphasis, hero_description: x.heroDescription, hero_cta_label: x.heroCtaLabel, intro_title: x.introTitle, intro_text: x.introText }; } const token = await getAdminAccessToken(); const rows = await supabaseFetch<Array<Record<string,string | null>>>("/rest/v1/homepage_content?id=eq.main&select=*&limit=1", { cache: "no-store" }, token); return rows[0] || {}; }

export async function getAdminOverview() {
  if (!getSupabaseConfig()) {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    return {
      products: products.length,
      published: products.filter((item) => item.status === "published").length,
      drafts: 0,
      categories: categories.length,
      projects: 0,
      services: 0,
      articles: 0,
      requests: 0,
      newRequests: 0,
      media: 0,
    };
  }
  const token = await getAdminAccessToken();
  const [products, categories, projects, services, articles, requests, media] = await Promise.all([
    supabaseFetch<Array<{ status: string }>>("/rest/v1/products?select=status", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/categories?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/projects?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/services?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string; status: string }>>("/rest/v1/articles?select=id,status", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string; status: string }>>("/rest/v1/service_requests?select=id,status", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/media_assets?select=id", { cache: "no-store" }, token).catch(() => []),
  ]);
  return {
    products: products.length,
    published: products.filter((item) => item.status === "published").length,
    drafts: products.filter((item) => item.status === "draft").length,
    categories: categories.length,
    projects: projects.length,
    services: services.length,
    articles: articles.length,
    requests: requests.length,
    newRequests: requests.filter((r) => r.status === "new").length,
    media: media.length,
  };
}
