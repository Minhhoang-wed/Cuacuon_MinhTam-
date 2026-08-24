"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { optional, slugify, uploadObject, value } from "./helpers";

export async function saveService(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const name = value(form, "name");
  if (name.length < 2) throw new Error("Cần nhập tên dịch vụ.");

  const symptoms = value(form, "symptoms").split("\n").map((s) => s.trim()).filter(Boolean);
  const process = value(form, "process").split("\n").map((s) => s.trim()).filter(Boolean);

  let imageUrl = optional(form, "image_url");
  const isCleared = form.get("clear_image") === "true";
  if (isCleared) {
    imageUrl = null;
  }

  const imageFile = form.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const path = await uploadObject(imageFile, "services", token);
    imageUrl = path;
    try {
      await supabaseFetch("/rest/v1/media_assets", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          storage_path: path,
          file_name: imageFile.name,
          alt_text: name,
          mime_type: imageFile.type,
          size_bytes: imageFile.size,
        }),
      }, token);
    } catch {}
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
    await supabaseFetch(`/rest/v1/services?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/services?select=id", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    }, token);
    serviceId = rows[0]?.id || "";
  }

  revalidateTag("services", "max");
  revalidatePath("/");
  revalidatePath("/dich-vu");
  revalidatePath(`/dich-vu/${payload.slug}`);
  revalidatePath("/admin/services");
  revalidatePath("/admin/media");
  redirect(`/admin/services?saved=1`);
}

export async function deleteService(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã dịch vụ cần xóa.");

  await supabaseFetch(`/rest/v1/services?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  revalidateTag("services", "max");
  revalidatePath("/");
  revalidatePath("/dich-vu");
  revalidatePath("/admin/services");
  redirect("/admin/services?deleted=1");
}

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
    await supabaseFetch(`/rest/v1/service_price_items?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    await supabaseFetch("/rest/v1/service_price_items", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
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

  await supabaseFetch(`/rest/v1/service_price_items?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  revalidateTag("service-pricing", "max");
  revalidatePath("/dich-vu");
  revalidatePath("/admin/services");
  redirect("/admin/services?pricing_deleted=1");
}
