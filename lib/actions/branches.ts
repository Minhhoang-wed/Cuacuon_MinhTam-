"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { optional, value } from "./helpers";

export async function saveStoreBranch(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const branch_name = value(form, "branch_name");
  const address = value(form, "address");
  const hotline = value(form, "hotline") || "0327.359.368";
  const note = optional(form, "note") || "Cửa hàng trưng bày & Trung tâm kỹ thuật";
  const badge = optional(form, "badge") || "Cửa hàng trực tiếp";
  const sort_order = Number(value(form, "sort_order") || 0);
  const is_active = form.get("is_active") === "true" || form.get("is_active") === "on";

  if (branch_name.length < 2 || address.length < 3) throw new Error("Cần nhập tên chi nhánh và địa chỉ.");

  const payload = {
    branch_name,
    address,
    hotline,
    note,
    badge,
    sort_order,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/store_branches?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    await supabaseFetch("/rest/v1/store_branches", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  }

  revalidateTag("store-branches", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?branch_saved=1");
}

export async function deleteStoreBranch(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã chi nhánh cần xóa.");

  await supabaseFetch(`/rest/v1/store_branches?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  revalidateTag("store-branches", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?branch_deleted=1");
}

export async function saveServiceDistrict(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  const district_name = value(form, "district_name");
  const address_landmark = value(form, "address_landmark");
  const response_time = value(form, "response_time") || "Có mặt sau 15 – 25 phút";
  const note = optional(form, "note") || "Trạm trực kỹ thuật";
  const is_hotspot = form.get("is_hotspot") === "true" || form.get("is_hotspot") === "on";
  const sort_order = Number(value(form, "sort_order") || 0);
  const is_active = form.get("is_active") === "true" || form.get("is_active") === "on";

  if (district_name.length < 2 || address_landmark.length < 2) throw new Error("Cần nhập tên quận huyện và địa chỉ điểm chốt.");

  const payload = {
    district_name,
    address_landmark,
    response_time,
    note,
    is_hotspot,
    sort_order,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (id && !id.startsWith("local-") && !id.startsWith("static-")) {
    await supabaseFetch(`/rest/v1/service_districts?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  } else {
    await supabaseFetch("/rest/v1/service_districts", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    }, token);
  }

  revalidateTag("service-districts", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?district_saved=1");
}

export async function deleteServiceDistrict(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const id = value(form, "id");
  if (!id) throw new Error("Thiếu mã quận huyện cần xóa.");

  await supabaseFetch(`/rest/v1/service_districts?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  }, token);

  revalidateTag("service-districts", "max");
  revalidatePath("/khu-vuc-phuc-vu");
  revalidatePath("/admin/service-areas");
  redirect("/admin/service-areas?district_deleted=1");
}
