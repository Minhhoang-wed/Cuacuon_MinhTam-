export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  sort_order: number;
  is_active: boolean;
};

export type AdminImageRow = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type AdminSpecRow = {
  id: string;
  spec_name: string;
  spec_value: string;
  group_name: string | null;
  sort_order: number;
};

export type AdminProductRow = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price_mode: string;
  price_amount: number | null;
  price_label: string | null;
  currency: string;
  warranty: string | null;
  is_featured: boolean;
  status: string;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  accent: string | null;
  updated_at: string;
  category?: { name: string; slug: string };
  images?: AdminImageRow[];
  specs?: AdminSpecRow[];
};

export type MediaRow = {
  id: string;
  storage_path: string;
  file_name: string;
  alt_text: string | null;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

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
  image_url: string | null;
  symptoms: string[];
  process: string[];
  accent: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;
};

export type AdminStoreBranchRow = {
  id: string;
  branch_name: string;
  address: string;
  hotline: string;
  note: string | null;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminServiceDistrictRow = {
  id: string;
  district_name: string;
  address_landmark: string;
  response_time: string;
  note: string | null;
  is_hotspot: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminServicePriceItemRow = {
  id: string;
  category_name: string;
  item_name: string;
  price: string;
  warranty: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
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

export type AdminOverview = {
  products: number;
  published: number;
  drafts: number;
  featured: number;
  categories: number;
  media: number;
  storageMb: number;
  services: number;
  articles: number;
  projects: number;
  branches: number;
  districts: number;
};
