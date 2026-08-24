"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { value } from "./helpers";

export async function saveAboutContent(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const fields = [
    "hero_title",
    "hero_description",
    "hero_image",
    "philosophy_kicker",
    "philosophy_title",
    "philosophy_text_1",
    "philosophy_text_2",
    "values_heading",
    "value_1_title",
    "value_1_text",
    "value_2_title",
    "value_2_text",
    "value_3_title",
    "value_3_text",
    "process_heading",
    "process_step_1",
    "process_step_2",
    "process_step_3",
    "process_step_4",
    "process_step_5",
  ];
  const payload: Record<string, string> = { id: "main", updated_at: new Date().toISOString() };
  fields.forEach((field) => (payload[field] = value(form, field)));

  try {
    await supabaseFetch(
      "/rest/v1/about_content?on_conflict=id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload),
      },
      token
    );
  } catch (error) {
    console.error("Lỗi khi lưu about_content:", error);
  }

  revalidateTag("about-content", "max");
  revalidatePath("/", "layout");
  revalidatePath("/ve-chung-toi");
  revalidatePath("/admin/about");
  redirect("/admin/about?saved=1");
}
