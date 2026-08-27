"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { optional, slugify, uploadObject, value } from "./helpers";

export async function saveArticle(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const title = value(form, "title");
  if (title.length < 3) throw new Error("Tiêu đề bài viết quá ngắn.");

  const content = value(form, "content").split("\n\n").map((p) => p.trim()).filter(Boolean);

  let imageUrl = optional(form, "image_url");
  const isCleared = form.get("clear_image") === "true";
  if (isCleared) {
    imageUrl = null;
  }

  const coverFile = form.get("image");
  if (coverFile instanceof File && coverFile.size > 0) {
    const path = await uploadObject(coverFile, "articles", token);
    imageUrl = path;
    try {
      await supabaseFetch("/rest/v1/media_assets", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          storage_path: path,
          file_name: coverFile.name,
          alt_text: title,
          mime_type: coverFile.type,
          size_bytes: coverFile.size,
        }),
      }, token);
    } catch {}
  }

  const payload = {
    title,
    slug: slugify(value(form, "slug") || title),
    category: value(form, "category") || "Cẩm nang sử dụng",
    excerpt: value(form, "excerpt") || "",
    content: JSON.stringify(content.length > 0 ? content : [value(form, "content")]),
    image_url: imageUrl,
    read_time: value(form, "read_time") || "3 phút",
    author: value(form, "author") || "Kỹ Thuật Viên Minh Tâm",
    is_featured: form.get("is_featured") === "true" || form.get("is_featured") === "on",
    status: value(form, "status") || "published",
    sort_order: Number(value(form, "sort_order") || 0),
    updated_at: new Date().toISOString(),
  };

  let articleId = id;
  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/articles?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/articles?select=id", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    }, token);
    articleId = rows[0]?.id || "";
  }

  revalidateTag("articles", "max");
  revalidatePath("/");
  revalidatePath("/tin-tuc");
  revalidatePath(`/tin-tuc/${payload.slug}`);
  revalidatePath("/admin/articles");
  revalidatePath("/admin/media");
  redirect(`/admin/articles?saved=1`);
}

export async function deleteArticle(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã bài viết cần xóa.");

  await supabaseFetch(`/rest/v1/articles?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  revalidateTag("articles", "max");
  revalidatePath("/");
  revalidatePath("/tin-tuc");
  revalidatePath("/admin/articles");
  redirect("/admin/articles?deleted=1");
}
