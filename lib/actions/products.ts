"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { deleteObject, numberOrNull, optional, refreshCatalog, slugify, uploadObject, value } from "./helpers";

export async function saveProduct(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const name = value(form, "name");
  const categoryId = value(form, "category_id");
  if (name.length < 2 || !categoryId) throw new Error("Cần tên và danh mục sản phẩm.");

  const payload = {
    category_id: categoryId,
    name,
    slug: slugify(value(form, "slug") || name),
    short_description: optional(form, "short_description"),
    description: optional(form, "description"),
    price_mode: value(form, "price_mode") || "contact",
    price_amount: numberOrNull(value(form, "price_amount")),
    price_label: optional(form, "price_label"),
    currency: "VND",
    warranty: optional(form, "warranty"),
    is_featured: form.get("is_featured") === "true" || form.get("is_featured") === "on",
    status: value(form, "status") || "draft",
    sort_order: Number(value(form, "sort_order") || 0),
    seo_title: optional(form, "seo_title"),
    seo_description: optional(form, "seo_description"),
    accent: value(form, "accent") || "#b9f5dc",
    updated_at: new Date().toISOString(),
  };

  let productId = id;
  if (id) {
    await supabaseFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/products?select=id", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    }, token);
    productId = rows[0].id;
  }

  const specLines = value(form, "specs").split("\n").map((line) => line.trim()).filter(Boolean);
  await supabaseFetch(`/rest/v1/product_specs?product_id=eq.${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  if (specLines.length) {
    const specs = specLines.map((line, index) => {
      const [namePart, ...rest] = line.split("|");
      return {
        product_id: productId,
        spec_name: namePart.trim() || "Thông số",
        spec_value: rest.join("|").trim() || namePart.trim(),
        group_name: "Thông số chung",
        sort_order: index,
      };
    });
    await supabaseFetch("/rest/v1/product_specs", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(specs),
    }, token);
  }

  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 6);
  for (const [index, file] of files.entries()) {
    const path = await uploadObject(file, `products/${productId}`, token);
    await supabaseFetch("/rest/v1/product_images", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        product_id: productId,
        storage_path: path,
        alt_text: name,
        sort_order: index,
        is_primary: index === 0 && form.get("has_images") !== "yes",
      }),
    }, token);
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
  }

  refreshCatalog();
  revalidatePath("/admin/products");
  revalidatePath(`/san-pham/${payload.slug}`);
  redirect(`/admin/products/${productId}?saved=1`);
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã sản phẩm cần xóa.");

  const rows = await supabaseFetch<Array<{ slug: string; images: Array<{ storage_path: string }> }>>(
    `/rest/v1/products?select=slug,images:product_images(storage_path)&id=eq.${encodeURIComponent(id)}&limit=1`,
    { cache: "no-store" },
    token
  );
  const product = rows[0];
  if (!product) redirect("/admin/products");

  await supabaseFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  for (const image of product.images || []) {
    await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(image.storage_path)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    }, token);
    await deleteObject(image.storage_path, token);
  }

  refreshCatalog();
  revalidatePath("/admin/products");
  revalidatePath("/admin/media");
  revalidatePath(`/san-pham/${product.slug}`);
  redirect("/admin/products?deleted=1");
}

export async function deleteProductImage(productId: string, id: string, path: string) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  await supabaseFetch(`/rest/v1/product_images?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);
  await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(path)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);
  await deleteObject(path, token);
  refreshCatalog();
  revalidatePath(`/admin/products/${productId}`);
}
