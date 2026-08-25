"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { publicAssetUrl, supabaseFetch } from "@/lib/supabase-rest";
import { uploadObject, value } from "./helpers";

export async function saveSettings(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  
  // 1. Cập nhật bảng site_settings với các cột hợp lệ
  const siteFields = [
    "company_name",
    "short_name",
    "site_description",
    "hotline",
    "zalo_url",
    "email",
    "maps_url",
    "business_hours",
    "service_area",
  ];
  const payload: Record<string, string> = { id: "main", updated_at: new Date().toISOString() };
  siteFields.forEach((field) => (payload[field] = value(form, field)));

  const branch1Address = value(form, "branch_1_address");
  const branch1Name = value(form, "branch_1_name");
  const branch2Address = value(form, "branch_2_address");
  const branch2Name = value(form, "branch_2_name");

  if (branch1Address) {
    payload.address = branch1Address;
  }

  try {
    await supabaseFetch(
      "/rest/v1/site_settings?on_conflict=id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload),
      },
      token
    );
  } catch (error) {
    console.error("Lỗi khi lưu site_settings:", error);
  }

  // 2. Cập nhật Cơ sở 1 và Cơ sở 2 vào bảng store_branches
  try {
    const existingBranches = await supabaseFetch<Array<{ id: string; sort_order: number }>>(
      "/rest/v1/store_branches?select=id,sort_order&order=sort_order.asc&limit=2",
      { cache: "no-store" },
      token
    ).catch(() => []);

    const b1Id = existingBranches[0]?.id;
    const b2Id = existingBranches[1]?.id;

    if (branch1Name || branch1Address) {
      const b1Data = {
        branch_name: branch1Name || "Cơ sở 1 (Trụ sở Quận 10)",
        address: branch1Address || "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM",
        hotline: payload.hotline || "0327.359.368",
        badge: "Cơ sở 1",
        sort_order: 0,
        is_active: true,
        updated_at: new Date().toISOString(),
      };
      if (b1Id) {
        await supabaseFetch(`/rest/v1/store_branches?id=eq.${encodeURIComponent(b1Id)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(b1Data),
        }, token);
      } else {
        await supabaseFetch("/rest/v1/store_branches", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(b1Data),
        }, token);
      }
    }

    if (branch2Name || branch2Address) {
      const b2Data = {
        branch_name: branch2Name || "Cơ sở 2 (Chi nhánh Quận 6)",
        address: branch2Address || "617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM",
        hotline: payload.hotline || "0327.359.368",
        badge: "Cơ sở 2",
        sort_order: 1,
        is_active: true,
        updated_at: new Date().toISOString(),
      };
      if (b2Id) {
        await supabaseFetch(`/rest/v1/store_branches?id=eq.${encodeURIComponent(b2Id)}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(b2Data),
        }, token);
      } else {
        await supabaseFetch("/rest/v1/store_branches", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(b2Data),
        }, token);
      }
    }
  } catch (branchError) {
    console.error("Lỗi khi cập nhật store_branches:", branchError);
  }

  revalidateTag("site-settings", "max");
  revalidateTag("store-branches", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/service-areas");
  redirect("/admin/settings?saved=1");
}

export async function saveSeoSettings(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();

  let ogImageUrl = value(form, "og_image_url") || "/og.png";

  const ogImageFile = form.get("og_image_file");
  if (ogImageFile instanceof File && ogImageFile.size > 0) {
    try {
      const path = await uploadObject(ogImageFile, "library", token);
      const publicUrl = publicAssetUrl(path);
      if (publicUrl) {
        ogImageUrl = publicUrl;
      }
    } catch (err) {
      console.error("Lỗi upload ảnh Social Thumbnail:", err);
    }
  }

  const siteName = value(form, "seo_site_name") || "Cửa Cuốn Minh Tâm 24H";
  const desc = value(form, "seo_default_description") || "";
  const keywords = value(form, "seo_keywords") || "";
  const canonicalBase = value(form, "seo_canonical_base") || "";
  const robotsIndex = value(form, "robots_index") || "index";

  const payload: Record<string, string> = {
    id: "main",
    updated_at: new Date().toISOString(),
    seo_site_name: siteName,
    seo_default_description: desc,
    seo_keywords: keywords,
    seo_canonical_base: canonicalBase,
    seo_title_template: `%s | ${siteName}`,
    og_title: siteName,
    og_description: desc,
    og_image_url: ogImageUrl,
    twitter_title: siteName,
    twitter_description: desc,
    twitter_image_url: ogImageUrl,
    robots_index: robotsIndex,
    robots_follow: "follow",
  };

  try {
    await supabaseFetch(
      "/rest/v1/site_settings?on_conflict=id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload),
      },
      token
    );
  } catch (error) {
    console.error("Lỗi khi lưu cấu hình SEO:", error);
  }

  revalidateTag("site-settings", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");
  redirect("/admin/seo?saved=1");
}

export async function saveHomepage(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const fields = [
    "hero_eyebrow",
    "hero_title",
    "hero_emphasis",
    "hero_description",
    "hero_cta_label",
    "intro_title",
    "intro_text",
  ];
  const payload: Record<string, string> = { id: "main", updated_at: new Date().toISOString() };
  fields.forEach((field) => (payload[field] = value(form, field)));

  await supabaseFetch(
    "/rest/v1/homepage_content?on_conflict=id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(payload),
    },
    token
  );

  revalidateTag("homepage", "max");
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?saved=1");
}
