"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { deleteObject, optional, slugify, uploadObject, value } from "./helpers";

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
    await supabaseFetch(`/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    const rows = await supabaseFetch<Array<{ id: string }>>("/rest/v1/projects?select=id", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    }, token);
    projectId = rows[0].id;
  }

  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 6);
  for (const [index, file] of files.entries()) {
    const path = await uploadObject(file, `projects/${projectId}`, token);
    await supabaseFetch("/rest/v1/project_images", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        project_id: projectId,
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

  const rows = await supabaseFetch<Array<{ slug: string; images: Array<{ storage_path: string }> }>>(
    `/rest/v1/projects?select=slug,images:project_images(storage_path)&id=eq.${encodeURIComponent(id)}&limit=1`,
    { cache: "no-store" },
    token
  );
  const project = rows[0];
  if (!project) redirect("/admin/projects");

  await supabaseFetch(`/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  for (const image of project.images || []) {
    await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(image.storage_path)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    }, token);
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
  await supabaseFetch(`/rest/v1/project_images?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);
  await supabaseFetch(`/rest/v1/media_assets?storage_path=eq.${encodeURIComponent(path)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);
  await deleteObject(path, token);
  revalidateTag("projects", "max");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/du-an`);
}
