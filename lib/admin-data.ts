import { getAdminAccessToken } from "@/lib/admin-auth";
import { getCategories, getHomepageContent, getProducts, getSiteSettings, getServices as getPublicServices, getArticles as getPublicArticles, getStoreBranches as getPublicStoreBranches, getServiceDistricts as getPublicServiceDistricts, getServicePricing as getPublicServicePricing } from "@/lib/catalog";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";
import type {
  AdminCategoryRow,
  AdminImageRow,
  AdminSpecRow,
  AdminProductRow,
  MediaRow,
  AdminProjectRow,
  AdminServiceRow,
  AdminStoreBranchRow,
  AdminServiceDistrictRow,
  AdminServicePriceItemRow,
  AdminArticleRow,
  AdminServiceRequestRow,
  AdminOverview,
} from "@/types/admin";

export type {
  AdminCategoryRow,
  AdminImageRow,
  AdminSpecRow,
  AdminProductRow,
  MediaRow,
  AdminProjectRow,
  AdminServiceRow,
  AdminStoreBranchRow,
  AdminServiceDistrictRow,
  AdminServicePriceItemRow,
  AdminArticleRow,
  AdminServiceRequestRow,
  AdminOverview,
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
  const pub = await getPublicServices();
  const fallback = pub.map((s, idx) => ({
    id: `local-${idx}`,
    name: s.name,
    slug: s.slug,
    summary: s.summary,
    description: null,
    price: s.price,
    duration: s.duration,
    warranty: s.warranty,
    image_url: s.imageUrl || null,
    symptoms: s.symptoms,
    process: s.process,
    accent: "#10b981",
    sort_order: idx,
    is_active: true,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }));

  if (!getSupabaseConfig()) return fallback;
  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<AdminServiceRow[]>("/rest/v1/services?select=*&order=sort_order.asc,created_at.desc", { cache: "no-store" }, token);
    if (rows && rows.length > 0) return rows;
  } catch (error) {
    console.warn("Chưa tải được bảng services từ Supabase, dùng dữ liệu mặc định:", error);
  }
  return fallback;
}

export async function getAdminService(id: string): Promise<AdminServiceRow | null> {
  const all = await getAdminServices();
  const fallback = all.find((s) => s.id === id) || null;
  if (!getSupabaseConfig() || id.startsWith("local-") || id.startsWith("static-")) {
    return fallback;
  }
  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<AdminServiceRow[]>(`/rest/v1/services?id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
    return rows[0] || fallback;
  } catch (error) {
    console.warn("Lỗi khi tải chi tiết dịch vụ:", error);
    return fallback;
  }
}

export async function getAdminStoreBranches(): Promise<AdminStoreBranchRow[]> {
  const pub = await getPublicStoreBranches();
  const fallback = pub.map((b, idx) => ({
    id: b.id || `local-branch-${idx}`,
    branch_name: b.branchName,
    address: b.address,
    hotline: b.hotline,
    note: b.note,
    badge: b.badge,
    sort_order: b.sortOrder,
    is_active: b.isActive,
  }));

  if (!getSupabaseConfig()) return fallback;
  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<AdminStoreBranchRow[]>("/rest/v1/store_branches?select=*&order=sort_order.asc,created_at.asc", { cache: "no-store" }, token);
    if (rows && rows.length > 0) return rows;
  } catch (error) {
    console.warn("Chưa có bảng store_branches trong Supabase, dùng dữ liệu mặc định.");
  }
  return fallback;
}

export async function getAdminStoreBranch(id: string): Promise<AdminStoreBranchRow | null> {
  const all = await getAdminStoreBranches();
  const fallback = all.find((b) => b.id === id) || null;
  if (!getSupabaseConfig() || id.startsWith("local-") || id.startsWith("static-")) {
    return fallback;
  }
  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<AdminStoreBranchRow[]>(`/rest/v1/store_branches?id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
    return rows[0] || fallback;
  } catch (error) {
    console.warn("Lỗi khi tải chi nhánh:", error);
    return fallback;
  }
}

export async function getAdminServiceDistricts(): Promise<AdminServiceDistrictRow[]> {
  const pub = await getPublicServiceDistricts();
  const fallback = pub.map((d, idx) => ({
    id: d.id || `local-district-${idx}`,
    district_name: d.districtName,
    address_landmark: d.addressLandmark,
    response_time: d.responseTime,
    note: d.note,
    is_hotspot: d.isHotspot,
    sort_order: d.sortOrder,
    is_active: d.isActive,
  }));

  if (!getSupabaseConfig()) return fallback;
  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<AdminServiceDistrictRow[]>("/rest/v1/service_districts?select=*&order=sort_order.asc,created_at.asc", { cache: "no-store" }, token);
    if (rows && rows.length > 0) return rows;
  } catch (error) {
    console.warn("Chưa có bảng service_districts trong Supabase, dùng dữ liệu mặc định.");
  }
  return fallback;
}

export async function getAdminServicePriceItems(): Promise<AdminServicePriceItemRow[]> {
  const pub = await getPublicServicePricing();
  const fallback: AdminServicePriceItemRow[] = [];
  let idx = 0;
  for (const cat of pub) {
    for (const item of cat.items) {
      fallback.push({
        id: item.id || `local-price-${idx++}`,
        category_name: cat.categoryTitle,
        item_name: item.name,
        price: item.price,
        warranty: item.warranty,
        sort_order: idx,
        is_active: true,
      });
    }
  }

  if (!getSupabaseConfig()) return fallback;
  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<AdminServicePriceItemRow[]>("/rest/v1/service_price_items?select=*&order=category_name.asc,sort_order.asc", { cache: "no-store" }, token);
    if (rows && rows.length > 0) return rows;
  } catch (error) {
    console.warn("Chưa có bảng service_price_items trong Supabase, dùng dữ liệu mặc định.");
  }
  return fallback;
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
export async function getAdminSettings() {
  if (!getSupabaseConfig()) {
    const x = await getSiteSettings();
    return {
      company_name: x.name,
      short_name: x.shortName,
      site_description: x.description,
      hotline: x.hotline,
      zalo_url: x.zaloHref,
      email: x.email,
      address: x.address,
      branch_1_name: x.branch1Name || "Cơ sở 1 (Trụ sở Quận 10)",
      branch_1_address: x.branch1Address || "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM",
      branch_2_name: x.branch2Name || "Cơ sở 2 (Chi nhánh Quận 6)",
      branch_2_address: x.branch2Address || "617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM",
      facebook_url: x.facebookHref,
      messenger_url: x.messengerHref,
      maps_url: x.mapsHref,
      business_hours: x.hours,
      service_area: x.serviceArea,
    };
  }
  const token = await getAdminAccessToken();
  const rows = await supabaseFetch<Array<Record<string, string | null>>>(
    "/rest/v1/site_settings?id=eq.main&select=*&limit=1",
    { cache: "no-store" },
    token
  );
  const row = rows[0] || {};
  const rawHotline = row.hotline || "";
  const hotline = (rawHotline && !rawHotline.includes("0909") && !rawHotline.includes("0901")) ? rawHotline : "0327 359 368";
  const rawZalo = row.zalo_url || "";
  const zalo_url = (rawZalo && !rawZalo.includes("0909") && !rawZalo.includes("0901")) ? rawZalo : "https://zalo.me/0327359368";
  return {
    ...row,
    hotline,
    zalo_url,
    branch_1_name: row.branch_1_name || "Cơ sở 1 (Trụ sở Quận 10)",
    branch_1_address: row.branch_1_address || row.address || "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM",
    branch_2_name: row.branch_2_name || "Cơ sở 2 (Chi nhánh Quận 6)",
    branch_2_address: row.branch_2_address || "617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM",
  };
}
export async function getAdminHomepage() { if (!getSupabaseConfig()) { const x = await getHomepageContent(); return { hero_eyebrow: x.heroEyebrow, hero_title: x.heroTitle, hero_emphasis: x.heroEmphasis, hero_description: x.heroDescription, hero_cta_label: x.heroCtaLabel, intro_title: x.introTitle, intro_text: x.introText }; } const token = await getAdminAccessToken(); const rows = await supabaseFetch<Array<Record<string,string | null>>>("/rest/v1/homepage_content?id=eq.main&select=*&limit=1", { cache: "no-store" }, token); return rows[0] || {}; }

export async function getAdminOverview() {
  if (!getSupabaseConfig()) {
    const [products, categories, services, articles, projects, districts, branches] = await Promise.all([
      getProducts(),
      getCategories(),
      getPublicServices(),
      getPublicArticles(),
      getAdminProjects(),
      getPublicServiceDistricts(),
      getPublicStoreBranches(),
    ]);
    return {
      products: products.length,
      published: products.filter((item: { status: string }) => item.status === "published").length,
      drafts: 0,
      categories: categories.length,
      projects: projects.length,
      services: services.length,
      articles: articles.length,
      requests: 0,
      newRequests: 0,
      districts: districts.length,
      branches: branches.length,
      media: 12,
    };
  }
  const token = await getAdminAccessToken();
  const [products, categories, projects, services, articles, requests, media, districts, branches] = await Promise.all([
    supabaseFetch<Array<{ status: string }>>("/rest/v1/products?select=status", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/categories?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/projects?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/services?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string; status: string }>>("/rest/v1/articles?select=id,status", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string; status: string }>>("/rest/v1/service_requests?select=id,status", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/media_assets?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/service_districts?select=id", { cache: "no-store" }, token).catch(() => []),
    supabaseFetch<Array<{ id: string }>>("/rest/v1/store_branches?select=id", { cache: "no-store" }, token).catch(() => []),
  ]);
  return {
    products: products.length,
    published: products.filter((item: { status: string }) => item.status === "published").length,
    drafts: products.filter((item: { status: string }) => item.status === "draft").length,
    categories: categories.length,
    projects: projects.length,
    services: services.length,
    articles: articles.length,
    requests: requests.length,
    newRequests: requests.filter((r: { status: string }) => r.status === "new").length,
    districts: districts.length,
    branches: branches.length,
    media: media.length,
  };
}

// ----------------------------------------------------------------------
// SEO SETTINGS
// ----------------------------------------------------------------------
export async function getAdminSeoSettings() {
  const s = await getSiteSettings();
  const defaults = {
    seo_title_template: `%s | ${s.shortName}`,
    seo_site_name: s.name,
    seo_default_description: s.description,
    seo_keywords: "sửa cửa cuốn, cửa cuốn TP.HCM, motor cửa cuốn, phụ kiện cửa cuốn",
    seo_canonical_base: s.baseUrl,
    og_title: s.name,
    og_description: s.description,
    og_image_url: `${s.baseUrl}/og.png`,
    og_locale: "vi_VN",
    twitter_card: "summary_large_image",
    twitter_title: s.name,
    twitter_description: s.description,
    twitter_image_url: `${s.baseUrl}/og.png`,
    twitter_site: "",
    robots_index: "index",
    robots_follow: "follow",
    structured_business_name: s.name,
    structured_phone: s.hotline,
    structured_address_locality: "TP. Hồ Chí Minh",
    structured_address_region: "VN-SG",
    structured_price_range: "$$",
  };

  if (!getSupabaseConfig()) return defaults;

  try {
    const token = await getAdminAccessToken();
    const rows = await supabaseFetch<Array<Record<string, string | null>>>(
      "/rest/v1/site_settings?id=eq.main&select=*&limit=1",
      { cache: "no-store" },
      token
    );
    const row = rows[0] || {};
    // Merge: row values override defaults if present
    return Object.fromEntries(
      Object.entries(defaults).map(([k, def]) => [k, row[k] ?? def])
    ) as typeof defaults;
  } catch {
    return defaults;
  }
}
