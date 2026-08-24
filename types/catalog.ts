export type PriceMode = "exact" | "from" | "contact" | "hidden";

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imagePath?: string | null;
  sortOrder: number;
  updatedAt?: string | null;
};

export type CatalogImage = {
  id: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  url: string | null;
};

export type CatalogSpec = {
  id: string;
  name: string;
  value: string;
  groupName: string;
  sortOrder: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: CatalogCategory;
  shortDescription: string;
  description: string;
  priceMode: PriceMode;
  priceAmount: number | null;
  priceLabel: string | null;
  currency: string;
  warranty: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
  seoTitle: string | null;
  seoDescription: string | null;
  accent: string;
  updatedAt?: string | null;
  images: CatalogImage[];
  specs: CatalogSpec[];
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

export type HomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroEmphasis: string;
  heroDescription: string;
  heroCtaLabel: string;
  introTitle: string;
  introText: string;
};
