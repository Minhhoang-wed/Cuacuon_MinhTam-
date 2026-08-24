"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { optional, refreshCatalog, slugify, uploadObject, value } from "./helpers";

export async function saveCategory(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const name = value(form, "name");
  if (name.length < 2) throw new Error("Tên danh mục quá ngắn.");

  let imagePath = optional(form, "image_path");
  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    const path = await uploadObject(file, "categories", token);
    imagePath = path;
    try {
      await supabaseFetch("/rest/v1/media_assets", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          storage_path: path,
          file_name: file.name,
          alt_text: name,
          mime_type: file.type,
          size_bytes: file.size,
        }),
      }, token);
    } catch {}
  }

  const payload = {
    name,
    slug: slugify(value(form, "slug") || name),
    description: optional(form, "description"),
    image_path: imagePath,
    sort_order: Number(value(form, "sort_order") || 0),
    is_active: form.get("is_active") === "true" || form.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabaseFetch(`/rest/v1/categories?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    await supabaseFetch("/rest/v1/categories", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  }

  refreshCatalog();
  revalidatePath("/admin/categories");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  await supabaseFetch(`/rest/v1/categories?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);
  refreshCatalog();
  revalidatePath("/admin/categories");
}
