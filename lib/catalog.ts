import { siteConfig } from "@/data/site";
import { services as staticServices, articles as staticArticles, Service, Article } from "@/data/content";
import { directStores, serviceAreaPoints, servicePriceCategories } from "@/data/public-home";
import { getSupabaseConfig, publicAssetUrl, supabaseFetch } from "@/lib/supabase-rest";

export type PriceMode = "exact" | "from" | "contact" | "hidden";
export type CatalogCategory = { id: string; name: string; slug: string; description: string; imagePath?: string | null; sortOrder: number; updatedAt?: string | null };
export type CatalogImage = { id: string; storagePath: string; altText: string; sortOrder: number; isPrimary: boolean; url: string | null };
export type CatalogSpec = { id: string; name: string; value: string; groupName: string; sortOrder: number };
export type CatalogProduct = {
  id: string; slug: string; name: string; category: CatalogCategory; shortDescription: string; description: string;
  priceMode: PriceMode; priceAmount: number | null; priceLabel: string | null; currency: string; warranty: string;
  featured: boolean; status: "draft" | "published" | "archived"; seoTitle: string | null; seoDescription: string | null;
  accent: string; updatedAt?: string | null; images: CatalogImage[]; specs: CatalogSpec[];
};

export type CatalogService = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  price: string;
  duration: string;
  warranty: string;
  imageUrl?: string | null;
  symptoms: string[];
  process: string[];
  accent: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt?: string | null;
};

export type CatalogStoreBranch = {
  id: string;
  branchName: string;
  address: string;
  hotline: string;
  note: string;
  badge: string;
  sortOrder: number;
  isActive: boolean;
};

export type CatalogServiceDistrict = {
  id: string;
  districtName: string;
  addressLandmark: string;
  responseTime: string;
  note: string;
  isHotspot: boolean;
  sortOrder: number;
  isActive: boolean;
};

export type CatalogServicePriceItem = {
  id: string;
  categoryName: string;
  itemName: string;
  price: string;
  warranty: string;
  sortOrder: number;
  isActive: boolean;
};

export type CatalogServicePriceCategory = {
  categoryTitle: string;
  items: Array<{
    id?: string;
    name: string;
    price: string;
    warranty: string;
  }>;
};

export type CatalogArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  imageUrl: string | null;
  readTime: string;
  author: string;
  isFeatured: boolean;
  status: "draft" | "published" | "archived";
  sortOrder: number;
  publishedAt: string;
};

export type ManagedSiteConfig = {
  name: string;
  shortName: string;
  description: string;
  hotline: string;
  hotlineHref: string;
  zaloHref: string;
  email: string;
  address: string;
  hours: string;
  mapsHref: string;
  serviceArea: string;
  baseUrl: string;
  facebookHref: string;
  messengerHref: string;
  seoTitleTemplate?: string;
  seoKeywords?: string;
  seoCanonicalBase?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
  robotsIndex?: "index" | "noindex";
  robotsFollow?: "follow" | "nofollow";
  structuredBusinessName?: string;
  structuredPhone?: string;
  structuredAddressLocality?: string;
  structuredAddressRegion?: string;
  structuredPriceRange?: string;
};
export type HomepageContent = { heroEyebrow: string; heroTitle: string; heroEmphasis: string; heroDescription: string; heroCtaLabel: string; introTitle: string; introText: string };

function parseAmount(value: string) { const digits = value.replace(/\D/g, ""); return digits ? Number(digits) : null; }
function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function mapCategory(row: DbCategory): CatalogCategory { return { id: row.id, name: row.name, slug: row.slug, description: row.description || "", imagePath: row.image_path, sortOrder: row.sort_order || 0, updatedAt: row.updated_at }; }
function mapProduct(row: DbProduct): CatalogProduct {
  return { id: row.id, slug: row.slug, name: row.name, category: mapCategory(row.category), shortDescription: row.short_description || "", description: row.description || "", priceMode: row.price_mode, priceAmount: row.price_amount === null ? null : Number(row.price_amount), priceLabel: row.price_label, currency: row.currency || "VND", warranty: row.warranty || "Liên hệ", featured: row.is_featured, status: row.status, seoTitle: row.seo_title, seoDescription: row.seo_description, accent: row.accent || "#b9f5dc", updatedAt: row.updated_at, images: (row.images || []).sort((a,b) => a.sort_order-b.sort_order).map((image) => ({ id: image.id, storagePath: image.storage_path, altText: image.alt_text || row.name, sortOrder: image.sort_order, isPrimary: image.is_primary, url: publicAssetUrl(image.storage_path) })), specs: (row.specs || []).sort((a,b) => a.sort_order-b.sort_order).map((spec) => ({ id: spec.id, name: spec.spec_name, value: spec.spec_value, groupName: spec.group_name || "Thông số chung", sortOrder: spec.sort_order })) };
}

type DbCategory = { id: string; name: string; slug: string; description: string | null; image_path: string | null; sort_order: number; updated_at: string | null };
type DbImage = { id: string; storage_path: string; alt_text: string | null; sort_order: number; is_primary: boolean };
type DbSpec = { id: string; spec_name: string; spec_value: string; group_name: string | null; sort_order: number };
type DbProduct = { id: string; slug: string; name: string; short_description: string | null; description: string | null; price_mode: PriceMode; price_amount: number | string | null; price_label: string | null; currency: string; warranty: string | null; is_featured: boolean; status: "draft" | "published" | "archived"; seo_title: string | null; seo_description: string | null; accent: string | null; updated_at: string | null; category: DbCategory; images: DbImage[]; specs: DbSpec[] };
const productSelect = "id,slug,name,short_description,description,price_mode,price_amount,price_label,currency,warranty,is_featured,status,seo_title,seo_description,accent,updated_at,category:categories(id,name,slug,description,image_path,sort_order,updated_at),images:product_images(id,storage_path,alt_text,sort_order,is_primary),specs:product_specs(id,spec_name,spec_value,group_name,sort_order)";

export function formatPrice(product: Pick<CatalogProduct, "priceMode" | "priceAmount" | "priceLabel" | "currency">) {
  if (product.priceMode === "hidden") return "";
  if (product.priceMode === "contact") return product.priceLabel || "Liên hệ";
  const formatted = product.priceAmount ? new Intl.NumberFormat("vi-VN").format(product.priceAmount) + (product.currency === "VND" ? "đ" : ` ${product.currency}`) : product.priceLabel || "Liên hệ";
  return product.priceMode === "from" ? `Từ ${formatted}` : formatted;
}

export async function getCategories(): Promise<CatalogCategory[]> {
  if (!getSupabaseConfig()) return [];
  try { const rows = await supabaseFetch<DbCategory[]>("/rest/v1/categories?select=id,name,slug,description,image_path,sort_order,updated_at&is_active=eq.true&order=sort_order.asc", { next: { revalidate: 300, tags: ["categories"] } }); return rows.map(mapCategory); }
  catch (error) { console.error("Không thể tải danh mục từ Supabase", error); return []; }
}

export async function getProducts(filters: { category?: string; search?: string; featured?: boolean } = {}): Promise<CatalogProduct[]> {
  if (!getSupabaseConfig()) return [];
  try {
    let path = `/rest/v1/products?select=${encodeURIComponent(productSelect)}&status=eq.published&order=is_featured.desc,sort_order.asc,created_at.desc`;
    if (filters.featured) path += "&is_featured=eq.true";
    if (filters.search) path += `&or=(name.ilike.*${encodeURIComponent(filters.search)}*,short_description.ilike.*${encodeURIComponent(filters.search)}*)`;
    const rows = await supabaseFetch<DbProduct[]>(path, { next: { revalidate: 300, tags: ["products"] } });
    const mapped = rows.map(mapProduct);
    return filters.category ? mapped.filter((product) => product.category.slug === filters.category) : mapped;
  } catch (error) { console.error("Không thể tải sản phẩm từ Supabase", error); return []; }
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  if (!getSupabaseConfig()) return null;
  try {
    const rows = await supabaseFetch<DbProduct[]>(
      `/rest/v1/products?select=${encodeURIComponent(
        productSelect
      )}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
      { next: { revalidate: 300, tags: ["products", `product-${slug}`] } }
    );
    return rows[0] ? mapProduct(rows[0]) : null;
  } catch {
    return null;
  }
}

export type CatalogProject = {
  id: string;
  name: string;
  slug: string;
  location: string;
  category: string;
  summary: string;
  description: string;
  result: string;
  accent: string;
  isFeatured: boolean;
  status: "draft" | "published" | "archived";
  sortOrder: number;
  updatedAt?: string | null;
  images: CatalogImage[];
};

type DbProject = {
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
  status: "draft" | "published" | "archived";
  sort_order: number;
  updated_at: string | null;
  images: DbImage[];
};

const projectSelect =
  "id,name,slug,location,category,summary,description,result,accent,is_featured,status,sort_order,updated_at,images:project_images(id,storage_path,alt_text,sort_order,is_primary)";

function mapProject(row: DbProject): CatalogProject {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location || "TP.HCM",
    category: row.category || "Nhà phố",
    summary: row.summary || "",
    description: row.description || "",
    result: row.result || "Hoàn tất bàn giao đúng tiến độ, vận hành êm ái.",
    accent: row.accent || "#10b981",
    isFeatured: row.is_featured,
    status: row.status,
    sortOrder: row.sort_order || 0,
    updatedAt: row.updated_at,
    images: (row.images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        id: image.id,
        storagePath: image.storage_path,
        altText: image.alt_text || row.name,
        sortOrder: image.sort_order,
        isPrimary: image.is_primary,
        url: publicAssetUrl(image.storage_path),
      })),
  };
}

export async function getProjects(
  filters: { featured?: boolean; search?: string; category?: string } = {}
): Promise<CatalogProject[]> {
  if (!getSupabaseConfig()) return [];
  try {
    let path = `/rest/v1/projects?select=${encodeURIComponent(
      projectSelect
    )}&status=eq.published&order=is_featured.desc,sort_order.asc,created_at.desc`;
    if (filters.featured) path += "&is_featured=eq.true";
    if (filters.category) path += `&category=eq.${encodeURIComponent(filters.category)}`;
    if (filters.search) {
      path += `&or=(name.ilike.*${encodeURIComponent(
        filters.search
      )}*,summary.ilike.*${encodeURIComponent(filters.search)}*,location.ilike.*${encodeURIComponent(
        filters.search
      )}*)`;
    }
    const rows = await supabaseFetch<DbProject[]>(path, {
      next: { revalidate: 300, tags: ["projects"] },
    });
    return rows.map(mapProject);
  } catch (error) {
    console.error("Không thể tải danh sách dự án từ Supabase", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<CatalogProject | null> {
  if (!getSupabaseConfig()) return null;
  try {
    const rows = await supabaseFetch<DbProject[]>(
      `/rest/v1/projects?select=${encodeURIComponent(
        projectSelect
      )}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
      { next: { revalidate: 300, tags: ["projects", `project-${slug}`] } }
    );
    return rows[0] ? mapProject(rows[0]) : null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// SERVICES (DỊCH VỤ)
// -------------------------------------------------------------
type DbService = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string | null;
  price: string;
  duration: string;
  warranty: string;
  image_url: string | null;
  symptoms: string[] | string;
  process: string[] | string;
  accent: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at?: string | null;
};

function mapService(row: DbService): CatalogService {
  const parseList = (val: string[] | string | null | undefined): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed; } catch {}
      return val.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };
  const imageUrl = row.image_url
    ? (row.image_url.startsWith("/") || row.image_url.startsWith("http")
        ? row.image_url
        : publicAssetUrl(row.image_url))
    : null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary || "",
    description: row.description || "",
    price: row.price || "Khảo sát báo giá",
    duration: row.duration || "30 - 60 phút",
    warranty: row.warranty || "12 tháng",
    imageUrl,
    symptoms: parseList(row.symptoms),
    process: parseList(row.process),
    accent: row.accent || "#10b981",
    sortOrder: row.sort_order || 0,
    isActive: row.is_active,
    updatedAt: row.updated_at || null,
  };
}

export async function getServices(): Promise<CatalogService[]> {
  if (!getSupabaseConfig()) {
    return staticServices.map((s, idx) => ({
      id: `static-${idx}`,
      slug: s.slug,
      name: s.name,
      summary: s.summary,
      description: "",
      price: s.price,
      duration: s.duration,
      warranty: s.warranty,
      imageUrl: s.imageUrl || null,
      symptoms: s.symptoms,
      process: s.process,
      accent: "#10b981",
      sortOrder: idx,
      isActive: true,
    }));
  }
  try {
    const rows = await supabaseFetch<DbService[]>(
      "/rest/v1/services?select=*&is_active=eq.true&order=sort_order.asc,created_at.asc",
      { next: { revalidate: 300, tags: ["services"] } }
    );
    if (rows && rows.length > 0) return rows.map(mapService);
  } catch (error) {
    console.error("Lỗi khi tải dịch vụ từ Supabase:", error);
  }
  return staticServices.map((s, idx) => ({
    id: `static-${idx}`,
    slug: s.slug,
    name: s.name,
    summary: s.summary,
    description: "",
    price: s.price,
    duration: s.duration,
    warranty: s.warranty,
    imageUrl: s.imageUrl || null,
    symptoms: s.symptoms,
    process: s.process,
    accent: "#10b981",
    sortOrder: idx,
    isActive: true,
  }));
}

export async function getServiceBySlug(slug: string): Promise<CatalogService | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) || null;
}

// -------------------------------------------------------------
// SERVICE PRICING (BẢNG BÁO GIÁ DỊCH VỤ)
// -------------------------------------------------------------
type DbServicePriceItem = {
  id: string;
  category_name: string;
  item_name: string;
  price: string;
  warranty: string;
  sort_order: number;
  is_active: boolean;
};

export async function getServicePricing(): Promise<CatalogServicePriceCategory[]> {
  if (!getSupabaseConfig()) {
    return servicePriceCategories as unknown as CatalogServicePriceCategory[];
  }
  try {
    const rows = await supabaseFetch<DbServicePriceItem[]>(
      "/rest/v1/service_price_items?select=*&is_active=eq.true&order=sort_order.asc,created_at.asc",
      { next: { revalidate: 300, tags: ["service-pricing"] } }
    );
    if (rows && rows.length > 0) {
      const grouped: Record<string, Array<{ id?: string; name: string; price: string; warranty: string }>> = {};
      for (const row of rows) {
        if (!grouped[row.category_name]) grouped[row.category_name] = [];
        grouped[row.category_name].push({
          id: row.id,
          name: row.item_name,
          price: row.price,
          warranty: row.warranty,
        });
      }
      return Object.entries(grouped).map(([categoryTitle, items]) => ({
        categoryTitle,
        items,
      }));
    }
  } catch (error) {
    console.error("Lỗi khi tải bảng giá dịch vụ từ Supabase:", error);
  }
  return servicePriceCategories as unknown as CatalogServicePriceCategory[];
}

// -------------------------------------------------------------
// STORE BRANCHES (CỬA HÀNG TRỰC TIẾP)
// -------------------------------------------------------------
type DbStoreBranch = {
  id: string;
  branch_name: string;
  address: string;
  hotline: string;
  note: string | null;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function getStoreBranches(): Promise<CatalogStoreBranch[]> {
  if (!getSupabaseConfig()) {
    return directStores.map((store, idx) => ({
      id: `static-branch-${idx}`,
      branchName: store.branch,
      address: store.address,
      hotline: store.hotline,
      note: store.note,
      badge: "Cửa hàng trực tiếp",
      sortOrder: idx + 1,
      isActive: true,
    }));
  }
  try {
    const rows = await supabaseFetch<DbStoreBranch[]>(
      "/rest/v1/store_branches?select=*&is_active=eq.true&order=sort_order.asc,created_at.asc",
      { next: { revalidate: 300, tags: ["store-branches"] } }
    );
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        branchName: r.branch_name,
        address: r.address,
        hotline: r.hotline || "0327.359.368",
        note: r.note || "",
        badge: r.badge || "Cửa hàng trực tiếp",
        sortOrder: r.sort_order || 0,
        isActive: r.is_active,
      }));
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách chi nhánh từ Supabase:", error);
  }
  return directStores.map((store, idx) => ({
    id: `static-branch-${idx}`,
    branchName: store.branch,
    address: store.address,
    hotline: store.hotline,
    note: store.note,
    badge: "Cửa hàng trực tiếp",
    sortOrder: idx + 1,
    isActive: true,
  }));
}

// -------------------------------------------------------------
// SERVICE DISTRICTS (QUẬN HUYỆN TÚC TRỰC)
// -------------------------------------------------------------
type DbServiceDistrict = {
  id: string;
  district_name: string;
  address_landmark: string;
  response_time: string;
  note: string | null;
  is_hotspot: boolean;
  sort_order: number;
  is_active: boolean;
};

export async function getServiceDistricts(): Promise<CatalogServiceDistrict[]> {
  if (!getSupabaseConfig()) {
    return serviceAreaPoints.map((point, idx) => ({
      id: `static-district-${idx}`,
      districtName: point.district,
      addressLandmark: point.address,
      responseTime: "Có mặt sau 15 – 25 phút",
      note: point.note,
      isHotspot: idx < 6,
      sortOrder: idx + 1,
      isActive: true,
    }));
  }
  try {
    const rows = await supabaseFetch<DbServiceDistrict[]>(
      "/rest/v1/service_districts?select=*&is_active=eq.true&order=sort_order.asc,created_at.asc",
      { next: { revalidate: 300, tags: ["service-districts"] } }
    );
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        districtName: r.district_name,
        addressLandmark: r.address_landmark,
        responseTime: r.response_time || "Có mặt sau 15 – 25 phút",
        note: r.note || "",
        isHotspot: r.is_hotspot,
        sortOrder: r.sort_order || 0,
        isActive: r.is_active,
      }));
    }
  } catch (error) {
    console.error("Lỗi khi tải quận huyện từ Supabase:", error);
  }
  return serviceAreaPoints.map((point, idx) => ({
    id: `static-district-${idx}`,
    districtName: point.district,
    addressLandmark: point.address,
    responseTime: "Có mặt sau 15 – 25 phút",
    note: point.note,
    isHotspot: idx < 6,
    sortOrder: idx + 1,
    isActive: true,
  }));
}

// -------------------------------------------------------------
// ARTICLES (TIN TỨC / BÀI VIẾT)
// -------------------------------------------------------------
type DbArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string[] | string;
  image_url: string | null;
  read_time: string;
  author: string;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  sort_order: number;
  published_at: string;
};

function mapArticle(row: DbArticle): CatalogArticle {
  const parseContent = (val: string[] | string | null | undefined): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try { const parsed = JSON.parse(val); if (Array.isArray(parsed)) return parsed; } catch {}
      return val.split("\n\n").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category || "Tin tức",
    excerpt: row.excerpt || "",
    content: parseContent(row.content),
    imageUrl: row.image_url,
    readTime: row.read_time || "3 phút",
    author: row.author || "Kỹ Thuật Viên An Tâm",
    isFeatured: row.is_featured,
    status: row.status,
    sortOrder: row.sort_order || 0,
    publishedAt: row.published_at ? new Date(row.published_at).toLocaleDateString("vi-VN") : "Gần đây",
  };
}

export async function getArticles(): Promise<CatalogArticle[]> {
  if (!getSupabaseConfig()) {
    return staticArticles.map((a, idx) => ({
      id: `static-${idx}`,
      slug: a.slug,
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      content: a.content,
      imageUrl: null,
      readTime: a.readTime,
      author: "Kỹ Thuật Viên An Tâm",
      isFeatured: idx === 0,
      status: "published",
      sortOrder: idx,
      publishedAt: a.date,
    }));
  }
  try {
    const rows = await supabaseFetch<DbArticle[]>(
      "/rest/v1/articles?select=*&status=eq.published&order=sort_order.asc,published_at.desc",
      { next: { revalidate: 300, tags: ["articles"] } }
    );
    if (rows && rows.length > 0) return rows.map(mapArticle);
  } catch (error) {
    console.error("Lỗi khi tải bài viết từ Supabase:", error);
  }
  return staticArticles.map((a, idx) => ({
    id: `static-${idx}`,
    slug: a.slug,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    content: a.content,
    imageUrl: null,
    readTime: a.readTime,
    author: "Kỹ Thuật Viên An Tâm",
    isFeatured: idx === 0,
    status: "published",
    sortOrder: idx,
    publishedAt: a.date,
  }));
}

export async function getArticleBySlug(slug: string): Promise<CatalogArticle | null> {
  const all = await getArticles();
  return all.find((a) => a.slug === slug) || null;
}

export async function getCategoryBySlug(slug: string) { const categories = await getCategories(); return categories.find((item) => item.slug === slug) || null; }

export async function getSiteSettings(): Promise<ManagedSiteConfig> {
  const fallback: ManagedSiteConfig = {
    ...siteConfig,
    facebookHref: "https://facebook.com/",
    messengerHref: "https://m.me/",
    seoTitleTemplate: `%s | ${siteConfig.shortName}`,
    seoKeywords: "sửa cửa cuốn, sửa cửa cuốn TP.HCM, cửa cuốn, motor cửa cuốn, phụ kiện cửa cuốn",
    seoCanonicalBase: siteConfig.baseUrl,
    ogTitle: siteConfig.name,
    ogDescription: siteConfig.description,
    ogImageUrl: "/og.png",
    twitterCard: "summary_large_image",
    twitterTitle: siteConfig.name,
    twitterDescription: siteConfig.description,
    twitterImageUrl: "/og.png",
    robotsIndex: "index",
    robotsFollow: "follow",
    structuredBusinessName: siteConfig.name,
    structuredPhone: siteConfig.hotline,
    structuredAddressLocality: "TP. Hồ Chí Minh",
    structuredAddressRegion: "VN-SG",
    structuredPriceRange: "$$",
  };
  if (!getSupabaseConfig()) return fallback;
  try {
    const rows = await supabaseFetch<Array<Record<string, string | null>>>(
      "/rest/v1/site_settings?id=eq.main&select=*&limit=1",
      { next: { revalidate: 300, tags: ["site-settings"] } }
    );
    const row = rows[0];
    if (!row) return fallback;
    const hotline = row.hotline || fallback.hotline;
    return {
      ...fallback,
      name: row.company_name || fallback.name,
      shortName: row.short_name || fallback.shortName,
      description: row.seo_default_description || row.site_description || fallback.description,
      hotline,
      hotlineHref: `tel:${hotline.replace(/\D/g, "")}`,
      zaloHref: row.zalo_url || fallback.zaloHref,
      email: row.email || fallback.email,
      address: row.address || fallback.address,
      hours: row.business_hours || fallback.hours,
      mapsHref: row.maps_url || fallback.mapsHref,
      serviceArea: row.service_area || fallback.serviceArea,
      facebookHref: row.facebook_url || fallback.facebookHref,
      messengerHref: row.messenger_url || fallback.messengerHref,
      seoTitleTemplate: row.seo_title_template || fallback.seoTitleTemplate,
      seoKeywords: row.seo_keywords || fallback.seoKeywords,
      seoCanonicalBase: row.seo_canonical_base || fallback.seoCanonicalBase,
      ogTitle: row.og_title || row.seo_site_name || fallback.ogTitle,
      ogDescription: row.og_description || row.seo_default_description || fallback.ogDescription,
      ogImageUrl: row.og_image_url || fallback.ogImageUrl,
      twitterCard: (row.twitter_card as any) || fallback.twitterCard,
      twitterTitle: row.twitter_title || fallback.twitterTitle,
      twitterDescription: row.twitter_description || fallback.twitterDescription,
      twitterImageUrl: row.twitter_image_url || fallback.twitterImageUrl,
      robotsIndex: (row.robots_index as any) || fallback.robotsIndex,
      robotsFollow: (row.robots_follow as any) || fallback.robotsFollow,
      structuredBusinessName: row.structured_business_name || fallback.structuredBusinessName,
      structuredPhone: row.structured_phone || fallback.structuredPhone,
      structuredAddressLocality: row.structured_address_locality || fallback.structuredAddressLocality,
      structuredAddressRegion: row.structured_address_region || fallback.structuredAddressRegion,
      structuredPriceRange: row.structured_price_range || fallback.structuredPriceRange,
    };
  } catch {
    return fallback;
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const fallback = { heroEyebrow: "Cứu hộ cửa cuốn · Tiếp nhận 24/7", heroTitle: "Cửa gặp sự cố?", heroEmphasis: "Đừng để cả ngày bị kẹt lại.", heroDescription: "Đặt lịch trong 60 giây. Kỹ thuật viên liên hệ xác nhận tình trạng, thời gian và báo giá tham khảo trước khi đến.", heroCtaLabel: "Gửi yêu cầu", introTitle: "Đúng thiết bị mới bền lâu.", introText: "Thiết bị được lựa chọn theo tải cửa và nhu cầu sử dụng thực tế." };
  if (!getSupabaseConfig()) return fallback;
  try { const rows = await supabaseFetch<Array<Record<string,string | null>>>("/rest/v1/homepage_content?id=eq.main&select=*&limit=1", { next: { revalidate: 300, tags: ["homepage"] } }); const row = rows[0]; return row ? { heroEyebrow: row.hero_eyebrow || fallback.heroEyebrow, heroTitle: row.hero_title || fallback.heroTitle, heroEmphasis: row.hero_emphasis || fallback.heroEmphasis, heroDescription: row.hero_description || fallback.heroDescription, heroCtaLabel: row.hero_cta_label || fallback.heroCtaLabel, introTitle: row.intro_title || fallback.introTitle, introText: row.intro_text || fallback.introText } : fallback; }
  catch { return fallback; }
}
