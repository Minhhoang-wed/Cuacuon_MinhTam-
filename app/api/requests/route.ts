import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase-rest";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function text(form: FormData, key: string) { const value = form.get(key); return typeof value === "string" ? value.trim() : ""; }
function requestCode() { const date = new Date(); const stamp = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`; return `AT-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; }

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    if (text(form, "company")) return NextResponse.json({ ok: true });

    const name = text(form, "name");
    const phone = text(form, "phone");
    const address = text(form, "address");
    const issue = text(form, "issue");
    const preferredTime = text(form, "preferredTime");
    const preferredDate = text(form, "preferredDate");
    const consent = text(form, "consent");

    if (name.length < 2 || name.length > 80) return NextResponse.json({ ok: false, message: "Vui lòng nhập họ tên hợp lệ." }, { status: 400 });
    if (!/^[0-9+ .()-]{9,16}$/.test(phone)) return NextResponse.json({ ok: false, message: "Vui lòng kiểm tra số điện thoại." }, { status: 400 });
    if (!address || address.length > 220 || issue.length < 10 || issue.length > 1200 || !preferredTime) return NextResponse.json({ ok: false, message: "Vui lòng điền đủ địa chỉ, tình trạng và thời gian mong muốn." }, { status: 400 });
    if (consent !== "yes") return NextResponse.json({ ok: false, message: "Cần đồng ý để doanh nghiệp liên hệ xác nhận." }, { status: 400 });

    const images = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
    if (images.length > MAX_FILES) return NextResponse.json({ ok: false, message: `Chỉ nhận tối đa ${MAX_FILES} ảnh.` }, { status: 400 });
    for (const image of images) {
      if (!allowedTypes.has(image.type) || image.size > MAX_FILE_SIZE) return NextResponse.json({ ok: false, message: "Ảnh phải là JPG, PNG hoặc WebP và không quá 5MB." }, { status: 400 });
    }

    const code = requestCode();

    // 1. Lưu vào cơ sở dữ liệu Supabase nếu đã cấu hình
    const config = getSupabaseConfig();
    if (config) {
      try {
        const uploadedPaths: string[] = [];
        for (const file of images) {
          const safe = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
          const path = `requests/${code}-${crypto.randomUUID().slice(0, 8)}-${safe}`;
          const res = await fetch(`${config.url}/storage/v1/object/product-media/${path}`, {
            method: "POST",
            headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, "Content-Type": file.type, "x-upsert": "false" },
            body: await file.arrayBuffer(),
          });
          if (res.ok) uploadedPaths.push(path);
        }

        await supabaseFetch("/rest/v1/service_requests", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            request_code: code,
            name,
            phone,
            address,
            issue,
            preferred_time: preferredTime,
            preferred_date: preferredDate || null,
            images: uploadedPaths,
            status: "new",
          }),
        });
      } catch (dbError) {
        console.error("Lỗi khi lưu yêu cầu vào Supabase:", dbError);
      }
    }

    // 2. Bắn Webhook nếu có cấu hình
    const webhookUrl = process.env.SERVICE_REQUEST_WEBHOOK_URL;
    if (webhookUrl) {
      const outbound = new FormData();
      Object.entries({ requestCode: code, name, phone, address, issue, preferredTime, preferredDate, receivedAt: new Date().toISOString() }).forEach(([key, value]) => outbound.append(key, value));
      images.forEach((image) => outbound.append("images", image, image.name));
      const headers: HeadersInit = {}; if (process.env.SERVICE_REQUEST_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${process.env.SERVICE_REQUEST_WEBHOOK_TOKEN}`;
      await fetch(webhookUrl, { method: "POST", headers, body: outbound, signal: AbortSignal.timeout(15000) }).catch(() => {});
    }

    return NextResponse.json({ ok: true, requestCode: code, message: " Yêu cầu đã được ghi nhận. Kỹ thuật viên sẽ liên hệ xác nhận trong ít phút." });
  } catch {
    return NextResponse.json({ ok: false, message: "Hệ thống đang bận. Vui lòng gọi hotline để được hỗ trợ." }, { status: 500 });
  }
}
