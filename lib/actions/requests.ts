"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { optional, value } from "./helpers";

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

  await supabaseFetch(
    `/rest/v1/service_requests?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    },
    token
  );

  revalidatePath("/admin/requests");
  revalidatePath("/admin/dashboard");
  redirect("/admin/requests?deleted=1");
}
