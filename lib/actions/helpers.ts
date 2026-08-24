import { revalidatePath, revalidateTag } from "next/cache";
import { getSupabaseConfig } from "@/lib/supabase-rest";

export function value(form: FormData, key: string): string {
  return String(form.get(key) || "").trim();
}

export function optional(form: FormData, key: string): string | null {
  const item = value(form, key);
  return item || null;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function numberOrNull(input: string): number | null {
  if (!input) return null;
  const parsed = Number(input.replace(/\D/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export async function uploadObject(file: File, folder: string, token: string): Promise<string> {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase chưa được cấu hình.");
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type) || file.size > 5 * 1024 * 1024) {
    throw new Error("Ảnh phải là JPG, PNG hoặc WebP và không quá 5MB.");
  }
  const safe = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}-${safe}`;
  const response = await fetch(`${config.url}/storage/v1/object/product-media/${path}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
  });
  if (!response.ok) throw new Error(`Upload thất bại: ${(await response.text()).slice(0, 200)}`);
  return path;
}

export async function deleteObject(path: string, token: string): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;
  await fetch(`${config.url}/storage/v1/object/product-media/${path}`, {
    method: "DELETE",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${token}`,
    },
  });
}

export function refreshCatalog(): void {
  revalidateTag("products", "max");
  revalidateTag("categories", "max");
  revalidatePath("/");
  revalidatePath("/san-pham");
}
