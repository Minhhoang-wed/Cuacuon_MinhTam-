export type SupabaseConfig = { url: string; key: string };

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

type SupabaseFetchInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

export async function supabaseFetch<T>(path: string, init: SupabaseFetchInit = {}, accessToken?: string): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) throw new Error("SUPABASE_NOT_CONFIGURED");

  const headers = new Headers(init.headers);
  headers.set("apikey", config.key);
  headers.set("Authorization", `Bearer ${accessToken || config.key}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${config.url}${path}`, { ...init, headers });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`SUPABASE_${response.status}: ${detail.slice(0, 500)}`);
  }
  if (response.status === 204 || response.headers.get("content-length") === "0") return undefined as T;
  return response.json() as Promise<T>;
}

export function publicAssetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const config = getSupabaseConfig();
  return config ? `${config.url}/storage/v1/object/public/product-media/${path.replace(/^\//, "")}` : null;
}
