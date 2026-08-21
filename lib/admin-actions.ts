"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";

function value(form: FormData, key: string) { return String(form.get(key) || "").trim(); }
function optional(form: FormData, key: string) { const item = value(form, key); return item || null; }
function slugify(input: string) { return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function numberOrNull(input: string) { if (!input) return null; const parsed = Number(input.replace(/\D/g, "")); return Number.isFinite(parsed) ? parsed : null; }

async function uploadObject(file: File, folder: string, token: string) {
  const config = getSupabaseConfig(); if (!config) throw new Error("Supabase chưa được cấu hình.");
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]); if (!allowed.has(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Ảnh phải là JPG, PNG hoặc WebP và không quá 5MB.");
  const safe = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}-${safe}`;
  const response = await fetch(`${config.url}/storage/v1/object/product-media/${path}`, { method: "POST", headers: { apikey: config.key, Authorization: `Bearer ${token}`, "Content-Type": file.type, "x-upsert": "false" }, body: await file.arrayBuffer() });
  if (!response.ok) throw new Error(`Upload thất bại: ${(await response.text()).slice(0, 200)}`);
  return path;
}

async function deleteObject(path: string, token: string) {
  const config = getSupabaseConfig(); if (!config) return;
  await fetch(`${config.url}/storage/v1/object/product-media/${path}`, { method: "DELETE", headers: { apikey: config.key, Authorization: `Bearer ${token}` } });
}

function refreshCatalog() {
  revalidateTag("products", "max"); revalidateTag("categories", "max"); revalidatePath("/"); revalidatePath("/san-pham");
}

// ----------------------------------------------------------------------
// CATEGORIES
// ----------------------------------------------------------------------
export async function saveCategory(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken();
  const id = value(form, "id"); const name = value(form, "name"); if (name.length < 2) throw new Error("Tên danh mục quá ngắn.");
  const payload = { name, slug: slugify(value(form, "slug") || name), description: optional(form, "description"), sort_order: Number(value(form, "sort_order") || 0), is_active: form.get("is_active") === "on", updated_at: new Date().toISOString() };
  if (id) await supabaseFetch(`/rest/v1/categories?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  else await supabaseFetch("/rest/v1/categories", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  refreshCatalog(); revalidatePath("/admin/categories"); redirect("/admin/categories?saved=1");
}

export async function deleteCategory(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const id = value(form, "id");
  await supabaseFetch(`/rest/v1/categories?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  refreshCatalog(); revalidatePath("/admin/categories");
}

// ----------------------------------------------------------------------
// PRODUCTS
// ----------------------------------------------------------------------
export async function saveProduct(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const id = value(form, "id"); const name = value(form, "name"); const categoryId = value(form, "category_id");
  if (name.length < 2 || !categoryId) throw new Error("Cần tên và danh mục sản phẩm.");
  const payload = { category_id: categoryId, name, slug: slugify(value(form, "slug") || name), short_description: optional(form, "short_description"), description: optional(form, "description"), price_mode: value(form, "price_mode") || "contact", price_amount: numberOrNull(value(form, "price_amount")), price_label: optional(form, "price_label"), currency: "VND", warranty: optional(form, "warranty"), is_featured: form.get("is_featured") === "true" || form.get("is_featured") === "on", status: value(form, "status") || "draft", sort_order: Number(value(form, "sort_order") || 0), seo_title: optional(form, "seo_title"), seo_description: optional(form, "seo_description"), accent: value(form, "accent") || "#b9f5dc", updated_at: new Date().toISOString() };
  let productId = id;
  if (id) await supabaseFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  else { const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/products?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) }, token); productId = rows[0].id; }

  const specLines = value(form, "specs").split("\n").map((line) => line.trim()).filter(Boolean);
  await supabaseFetch(`/rest/v1/product_specs?product_id=eq.${encodeURIComponent(productId)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  if (specLines.length) {
    const specs = specLines.map((line, index) => { const [namePart, ...rest] = line.split("|"); return { product_id: productId, spec_name: namePart.trim() || "Thông số", spec_value: rest.join("|").trim() || namePart.trim(), group_name: "Thông số chung", sort_order: index }; });
    await supabaseFetch("/rest/v1/product_specs", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(specs) }, token);
  }

  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 6);
  for (const [index, file] of files.entries()) {
    const path = await uploadObject(file, `products/${productId}`, token);
    await supabaseFetch("/rest/v1/product_images", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ product_id: productId, storage_path: path, alt_text: name, sort_order: index, is_primary: index === 0 && form.get("has_images") !== "yes" }) }, token);
    await supabaseFetch("/rest/v1/media_assets", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ storage_path: path, file_name: file.name, alt_text: name, mime_type: file.type, size_bytes: file.size }) }, token);
  }
  refreshCatalog(); revalidatePath("/admin/products"); revalidatePath(`/san-pham/${payload.slug}`); redirect(`/admin/products/${productId}?saved=1`);
}

export async function deleteProduct(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã sản phẩm cần xóa.");

  const rows = await supabaseFetch<Array<{ slug: string; images: Array<{ storage_path: string }> }>>(`/rest/v1/products?select=slug,images:product_images(storage_path)&id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
  const product = rows[0];
  if (!product) redirect("/admin/products");

  await supabaseFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  for (const image of product.images || []) {
    await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(image.storage_path)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
    await deleteObject(image.storage_path, token);
  }

  refreshCatalog();
  revalidatePath("/admin/products");
  revalidatePath("/admin/media");
  revalidatePath(`/san-pham/${product.slug}`);
  redirect("/admin/products?deleted=1");
}

export async function deleteProductImage(productId: string, id: string, path: string) {
  await requireAdmin(); const token = await getAdminAccessToken();
  await supabaseFetch(`/rest/v1/product_images?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(path)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  await deleteObject(path, token);
  refreshCatalog(); revalidatePath(`/admin/products/${productId}`);
}

// ----------------------------------------------------------------------
// MEDIA
// ----------------------------------------------------------------------
export async function uploadMedia(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 10);
  for (const file of files) { const path = await uploadObject(file, "library", token); await supabaseFetch("/rest/v1/media_assets", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ storage_path: path, file_name: file.name, alt_text: optional(form, "alt_text"), mime_type: file.type, size_bytes: file.size }) }, token); }
  revalidatePath("/admin/media"); redirect("/admin/media?uploaded=1");
}

export async function deleteMedia(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const id = value(form, "id"); const path = value(form, "path");
  await supabaseFetch(`/rest/v1/product_images?storage_path=eq.${encodeURIComponent(path)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  await supabaseFetch(`/rest/v1/media_assets?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  await deleteObject(path, token); refreshCatalog(); revalidatePath("/admin/media");
}

// ----------------------------------------------------------------------
// SITE SETTINGS & HOMEPAGE
// ----------------------------------------------------------------------
export async function saveSettings(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const fields = ["company_name","short_name","site_description","hotline","zalo_url","email","address","facebook_url","messenger_url","maps_url","business_hours","service_area"];
  const payload: Record<string,string> = { id: "main", updated_at: new Date().toISOString() }; fields.forEach((field) => payload[field] = value(form, field));
  await supabaseFetch("/rest/v1/site_settings?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(payload) }, token);
  revalidateTag("site-settings", "max"); revalidatePath("/", "layout"); revalidatePath("/admin/settings"); redirect("/admin/settings?saved=1");
}

export async function saveHomepage(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const fields = ["hero_eyebrow","hero_title","hero_emphasis","hero_description","hero_cta_label","intro_title","intro_text"];
  const payload: Record<string,string> = { id: "main", updated_at: new Date().toISOString() }; fields.forEach((field) => payload[field] = value(form, field));
  await supabaseFetch("/rest/v1/homepage_content?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(payload) }, token);
  revalidateTag("homepage", "max"); revalidatePath("/"); revalidatePath("/admin/homepage"); redirect("/admin/homepage?saved=1");
}

// ----------------------------------------------------------------------
// PROJECTS
// ----------------------------------------------------------------------
export async function saveProject(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const name = value(form, "name");
  if (name.length < 2) throw new Error("Cần nhập tên dự án.");

  const payload = {
    name,
    slug: slugify(value(form, "slug") || name),
    category: value(form, "category") || "Nhà phố",
    location: value(form, "location") || "TP.HCM",
    summary: value(form, "summary") || "",
    description: optional(form, "description"),
    result: value(form, "result") || "Hoàn tất bàn giao đúng tiến độ, vận hành êm ái.",
    accent: value(form, "accent") || "#10b981",
    is_featured: form.get("is_featured") === "true" || form.get("is_featured") === "on",
    status: value(form, "status") || "published",
    sort_order: Number(value(form, "sort_order") || 0),
    updated_at: new Date().toISOString(),
  };

  let projectId = id;
  if (id) {
    await supabaseFetch(`/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/projects?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) }, token);
    projectId = rows[0].id;
  }

  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 6);
  for (const [index, file] of files.entries()) {
    const path = await uploadObject(file, `projects/${projectId}`, token);
    await supabaseFetch("/rest/v1/project_images", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ project_id: projectId, storage_path: path, alt_text: name, sort_order: index, is_primary: index === 0 && form.get("has_images") !== "yes" }) }, token);
    await supabaseFetch("/rest/v1/media_assets", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ storage_path: path, file_name: file.name, alt_text: name, mime_type: file.type, size_bytes: file.size }) }, token);
  }

  revalidateTag("projects", "max");
  revalidatePath("/");
  revalidatePath("/du-an");
  revalidatePath(`/du-an/${payload.slug}`);
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${projectId}?saved=1`);
}

export async function deleteProject(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã dự án cần xóa.");

  const rows = await supabaseFetch<Array<{ slug: string; images: Array<{ storage_path: string }> }>>(`/rest/v1/projects?select=slug,images:project_images(storage_path)&id=eq.${encodeURIComponent(id)}&limit=1`, { cache: "no-store" }, token);
  const project = rows[0];
  if (!project) redirect("/admin/projects");

  await supabaseFetch(`/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  for (const image of project.images || []) {
    await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(image.storage_path)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
    await deleteObject(image.storage_path, token);
  }

  revalidateTag("projects", "max");
  revalidatePath("/");
  revalidatePath("/du-an");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?deleted=1");
}

export async function deleteProjectImage(projectId: string, id: string, path: string) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  await supabaseFetch(`/rest/v1/project_images?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(path)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  await deleteObject(path, token);
  revalidateTag("projects", "max");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/du-an`);
}

// ----------------------------------------------------------------------
// SERVICES (DỊCH VỤ)
// ----------------------------------------------------------------------
export async function saveService(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const name = value(form, "name");
  if (name.length < 2) throw new Error("Cần nhập tên dịch vụ.");

  const symptoms = value(form, "symptoms").split("\n").map((s) => s.trim()).filter(Boolean);
  const process = value(form, "process").split("\n").map((s) => s.trim()).filter(Boolean);

  let imageUrl = optional(form, "image_url");
  const imageFile = form.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const path = await uploadObject(imageFile, "services", token);
    imageUrl = path;
  }

  const payload = {
    name,
    slug: slugify(value(form, "slug") || name),
    summary: value(form, "summary") || "",
    description: optional(form, "description"),
    price: value(form, "price") || "Khảo sát báo giá",
    duration: value(form, "duration") || "30 - 60 phút",
    warranty: value(form, "warranty") || "12 tháng",
    image_url: imageUrl,
    symptoms: JSON.stringify(symptoms),
    process: JSON.stringify(process),
    accent: value(form, "accent") || "#10b981",
    sort_order: Number(value(form, "sort_order") || 0),
    is_active: form.get("is_active") === "true" || form.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  let serviceId = id;
  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/services?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/services?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) }, token);
    serviceId = rows[0]?.id || "";
  }

  revalidateTag("services", "max");
  revalidatePath("/");
  revalidatePath("/dich-vu");
  revalidatePath(`/dich-vu/${payload.slug}`);
  revalidatePath("/admin/services");
  redirect(`/admin/services?saved=1`);
}

export async function deleteService(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã dịch vụ cần xóa.");

  await supabaseFetch(`/rest/v1/services?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  revalidateTag("services", "max");
  revalidatePath("/");
  revalidatePath("/dich-vu");
  revalidatePath("/admin/services");
  redirect("/admin/services?deleted=1");
}

// ----------------------------------------------------------------------
// SERVICE PRICE ITEMS (BẢNG BÁO GIÁ DỊCH VỤ)
// ----------------------------------------------------------------------
export async function saveServicePriceItem(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const category_name = value(form, "category_name") || "1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn";
  const item_name = value(form, "item_name");
  const price = value(form, "price");
  const warranty = value(form, "warranty") || "3 – 6 tháng";
  const sort_order = Number(value(form, "sort_order") || 0);
  const is_active = form.get("is_active") === "true" || form.get("is_active") === "on";

  if (item_name.length < 2 || !price) throw new Error("Cần nhập tên hạng mục và mức giá.");

  const payload = {
    category_name,
    item_name,
    price,
    warranty,
    sort_order,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/service_price_items?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  } else {
    await supabaseFetch("/rest/v1/service_price_items", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  }

  revalidateTag("service-pricing", "max");
  revalidatePath("/dich-vu");
  revalidatePath("/admin/services");
  redirect("/admin/services?pricing_saved=1");
}

export async function deleteServicePriceItem(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã hạng mục giá cần xóa.");

  await supabaseFetch(`/rest/v1/service_price_items?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  revalidateTag("service-pricing", "max");
  revalidatePath("/dich-vu");
  revalidatePath("/admin/services");
  redirect("/admin/services?pricing_deleted=1");
}

// ----------------------------------------------------------------------
// STORE BRANCHES (CHI NHÁNH CỬA HÀNG)
// ----------------------------------------------------------------------
export async function saveStoreBranch(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const branch_name = value(form, "branch_name");
  const address = value(form, "address");
  const hotline = value(form, "hotline") || "0327.359.368";
  const note = optional(form, "note") || "Cửa hàng trưng bày & Trung tâm kỹ thuật";
  const badge = optional(form, "badge") || "Cửa hàng trực tiếp";
  const sort_order = Number(value(form, "sort_order") || 0);
  const is_active = form.get("is_active") === "true" || form.get("is_active") === "on";

  if (branch_name.length < 2 || address.length < 3) throw new Error("Cần nhập tên chi nhánh và địa chỉ.");

  const payload = {
    branch_name,
    address,
    hotline,
    note,
    badge,
    sort_order,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/store_branches?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  } else {
    await supabaseFetch("/rest/v1/store_branches", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  }

  revalidateTag("store-branches", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?branch_saved=1");
}

export async function deleteStoreBranch(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã chi nhánh cần xóa.");

  await supabaseFetch(`/rest/v1/store_branches?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  revalidateTag("store-branches", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?branch_deleted=1");
}

// ----------------------------------------------------------------------
// SERVICE DISTRICTS (QUẬN HUYỆN TÚC TRỰC)
// ----------------------------------------------------------------------
export async function saveServiceDistrict(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const district_name = value(form, "district_name");
  const address_landmark = value(form, "address_landmark");
  const response_time = value(form, "response_time") || "Có mặt sau 15 – 25 phút";
  const note = optional(form, "note") || "Trạm trực kỹ thuật";
  const is_hotspot = form.get("is_hotspot") === "true" || form.get("is_hotspot") === "on";
  const sort_order = Number(value(form, "sort_order") || 0);
  const is_active = form.get("is_active") === "true" || form.get("is_active") === "on";

  if (district_name.length < 2 || address_landmark.length < 2) throw new Error("Cần nhập tên quận huyện và địa chỉ điểm chốt.");

  const payload = {
    district_name,
    address_landmark,
    response_time,
    note,
    is_hotspot,
    sort_order,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/service_districts?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  } else {
    await supabaseFetch("/rest/v1/service_districts", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  }

  revalidateTag("service-districts", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?district_saved=1");
}

export async function deleteServiceDistrict(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã quận huyện cần xóa.");

  await supabaseFetch(`/rest/v1/service_districts?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  revalidateTag("service-districts", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?district_deleted=1");
}

// ----------------------------------------------------------------------
// ARTICLES (TIN TỨC / BÀI VIẾT)
// ----------------------------------------------------------------------
export async function saveArticle(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const title = value(form, "title");
  if (title.length < 3) throw new Error("Tiêu đề bài viết quá ngắn.");

  const content = value(form, "content").split("\n\n").map((p) => p.trim()).filter(Boolean);

  let imageUrl = optional(form, "image_url");
  const coverFile = form.get("image");
  if (coverFile instanceof File && coverFile.size > 0) {
    const path = await uploadObject(coverFile, "articles", token);
    imageUrl = path;
  }

  const payload = {
    title,
    slug: slugify(value(form, "slug") || title),
    category: value(form, "category") || "Cẩm nang sử dụng",
    excerpt: value(form, "excerpt") || "",
    content: JSON.stringify(content.length > 0 ? content : [value(form, "content")]),
    image_url: imageUrl,
    read_time: value(form, "read_time") || "3 phút",
    author: value(form, "author") || "Kỹ Thuật Viên An Tâm",
    is_featured: form.get("is_featured") === "true" || form.get("is_featured") === "on",
    status: value(form, "status") || "published",
    sort_order: Number(value(form, "sort_order") || 0),
    updated_at: new Date().toISOString(),
  };

  let articleId = id;
  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/articles?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(payload) }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/articles?select=id", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(payload) }, token);
    articleId = rows[0]?.id || "";
  }

  revalidateTag("articles", "max");
  revalidatePath("/");
  revalidatePath("/tin-tuc");
  revalidatePath(`/tin-tuc/${payload.slug}`);
  revalidatePath("/admin/articles");
  redirect(`/admin/articles?saved=1`);
}

export async function deleteArticle(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã bài viết cần xóa.");

  await supabaseFetch(`/rest/v1/articles?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  revalidateTag("articles", "max");
  revalidatePath("/");
  revalidatePath("/tin-tuc");
  revalidatePath("/admin/articles");
  redirect("/admin/articles?deleted=1");
}

// ----------------------------------------------------------------------
// SERVICE REQUESTS (ĐƠN ĐẶT LỊCH / LEADS CRM)
// ----------------------------------------------------------------------
export async function updateServiceRequestStatus(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const status = value(form, "status");
  const admin_notes = optional(form, "admin_notes");

  if (!id) throw new Error("Thiếu mã yêu cầu.");

  await supabaseFetch(
    `/rest/v1/service_requests?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status, admin_notes, updated_at: new Date().toISOString() }),
    },
    token
  );

  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
  revalidatePath("/admin/dashboard");
  redirect(`/admin/requests?saved=1`);
}

export async function deleteServiceRequest(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã yêu cầu cần xóa.");

  await supabaseFetch(`/rest/v1/service_requests?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token);
  revalidatePath("/admin/requests");
  revalidatePath("/admin/dashboard");
  redirect("/admin/requests?deleted=1");
}
