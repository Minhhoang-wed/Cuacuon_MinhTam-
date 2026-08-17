"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";

function value(form: FormData, key: string) { return String(form.get(key) || "").trim(); }
function optional(form: FormData, key: string) { const item = value(form, key); return item || null; }
function slugify(input: string) { return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function numberOrNull(input: string) { if (!input) return null; const parsed = Number(input.replace(/[^0-9.]/g, "")); return Number.isFinite(parsed) ? parsed : null; }
function adminHeaders(token: string, contentType = "application/json") { const config = getSupabaseConfig()!; return { apikey: config.key, Authorization: `Bearer ${token}`, "Content-Type": contentType }; }

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

export async function saveProduct(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const id = value(form, "id"); const name = value(form, "name"); const categoryId = value(form, "category_id");
  if (name.length < 2 || !categoryId) throw new Error("Cần tên và danh mục sản phẩm.");
  const payload = { category_id: categoryId, name, slug: slugify(value(form, "slug") || name), short_description: optional(form, "short_description"), description: optional(form, "description"), price_mode: value(form, "price_mode") || "contact", price_amount: numberOrNull(value(form, "price_amount")), price_label: optional(form, "price_label"), currency: "VND", warranty: optional(form, "warranty"), is_featured: form.get("is_featured") === "on", status: value(form, "status") || "draft", sort_order: Number(value(form, "sort_order") || 0), seo_title: optional(form, "seo_title"), seo_description: optional(form, "seo_description"), accent: value(form, "accent") || "#b9f5dc", updated_at: new Date().toISOString() };
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
  await supabaseFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "archived", is_featured: false, updated_at: new Date().toISOString() }) }, token);
  refreshCatalog(); revalidatePath("/admin/products");
}

export async function deleteProductImage(productId: string, id: string, path: string) {
  await requireAdmin(); const token = await getAdminAccessToken();
  await supabaseFetch(`/rest/v1/product_images?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token); await deleteObject(path, token);
  refreshCatalog(); revalidatePath(`/admin/products/${productId}`);
}

export async function uploadMedia(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 10);
  for (const file of files) { const path = await uploadObject(file, "library", token); await supabaseFetch("/rest/v1/media_assets", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ storage_path: path, file_name: file.name, alt_text: optional(form, "alt_text"), mime_type: file.type, size_bytes: file.size }) }, token); }
  revalidatePath("/admin/media"); redirect("/admin/media?uploaded=1");
}

export async function deleteMedia(form: FormData) {
  await requireAdmin(); const token = await getAdminAccessToken(); const id = value(form, "id"); const path = value(form, "path");
  await supabaseFetch(`/rest/v1/media_assets?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }, token); await deleteObject(path, token); revalidatePath("/admin/media");
}

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
