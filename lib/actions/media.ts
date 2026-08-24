"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { deleteObject, optional, refreshCatalog, uploadObject, value } from "./helpers";

export async function uploadMedia(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0).slice(0, 10);
  for (const file of files) {
    const path = await uploadObject(file, "library", token);
    await supabaseFetch(
      "/rest/v1/media_assets",
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          storage_path: path,
          file_name: file.name,
          alt_text: optional(form, "alt_text"),
          mime_type: file.type,
          size_bytes: file.size,
        }),
      },
      token
    );
  }
  revalidatePath("/admin/media");
  redirect("/admin/media?uploaded=1");
}

export async function deleteMedia(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const path = value(form, "path");

  await supabaseFetch(`/rest/v1/product_images?storage_path=eq.${encodeURIComponent(path)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  await supabaseFetch(`/rest/v1/media_assets?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  await deleteObject(path, token);
  refreshCatalog();
  revalidatePath("/admin/media");
}
