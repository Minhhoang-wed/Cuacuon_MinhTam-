"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccessToken, requireAdmin } from "@/lib/admin-auth";
import { supabaseFetch } from "@/lib/supabase-rest";
import { value } from "./helpers";

export async function saveSettings(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const fields = [
    "company_name",
    "short_name",
    "site_description",
    "hotline",
    "zalo_url",
    "email",
    "address",
    "facebook_url",
    "messenger_url",
    "maps_url",
    "business_hours",
    "service_area",
  ];
  const payload: Record<string, string> = { id: "main", updated_at: new Date().toISOString() };
  fields.forEach((field) => (payload[field] = value(form, field)));

  await supabaseFetch(
    "/rest/v1/site_settings?on_conflict=id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(payload),
    },
    token
  );

  revalidateTag("site-settings", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function saveSeoSettings(form: FormData) {
  await requireAdmin();
  const token = await getAdminAccessToken();
  const fields = [
    "seo_title_template",
    "seo_site_name",
    "seo_default_description",
    "seo_keywords",
    "seo_canonical_base",
    "og_title",
    "og_description",
    "og_image_url",
    "og_locale",
    "twitter_card",
    "twitter_title",
    "twitter_description",
    "twitter_image_url",
    "twitter_site",
    "robots_index",
    "robots_follow",
    "structured_business_name",
    "structured_phone",
    "structured_address_locality",
    "structured_address_region",
    "structured_price_range",
  ];
  const payload: Record<string, string> = { id: "main", updated_at: new Date().toISOString() };
  fields.forEach((field) => (payload[field] = value(form, field)));

  await supabaseFetch(
    "/rest/v1/site_settings?on_conflict=id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(payload),
    },
    token
  );

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
