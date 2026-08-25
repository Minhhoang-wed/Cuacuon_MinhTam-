# Cửa Cuốn An Tâm 24H - Landing Page & CMS

Website giới thiệu dịch vụ, sản phẩm cửa cuốn kết hợp hệ thống CMS quản trị nội dung linh hoạt cho doanh nghiệp.

---

## 🌟 Tính năng chính

- **Giao diện người dùng (Public):**
  - Giới thiệu dịch vụ sửa chữa, lắp đặt, bảo dưỡng cửa cuốn 24/7.
  - Tra cứu, tìm kiếm và xem chi tiết danh mục / sản phẩm cửa cuốn.
  - Form gửi yêu cầu cứu hộ & sửa chữa nhanh (hỗ trợ đính kèm hình ảnh).
  - Tích hợp nút gọi Hotline, Chat Zalo và chỉ đường Google Maps tối ưu cho mobile.
  - Chuẩn hóa SEO, dynamic sitemap và schema `LocalBusiness`.

- **Hệ thống Quản trị (Admin CMS - `/admin`):**
  - Quản lý danh mục, sản phẩm và thông số kỹ thuật.
  - Thư viện quản lý hình ảnh (Supabase Storage).
  - Tùy chỉnh thông tin liên hệ, hotline, mạng xã hội và banner trang chủ.

---

## 🛠️ Công nghệ sử dụng

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router) + [React](https://react.dev/) 19
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4
- **Backend / Database:** [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage, RLS)
- **Icons:** Lucide React

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- **Node.js:** `>= 20.9` (Khuyến nghị Node 24.x)
- **Package Manager:** `pnpm` (hoặc `npm` / `yarn`)

### 2. Cài đặt

```bash
# Cài đặt dependencies
pnpm install

# Tạo file cấu hình môi trường
cp .env.example .env.local
```

### 3. Chạy môi trường phát triển (Development)

```bash
pnpm dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

> **Lưu ý:** Khi chưa cấu hình Supabase, website sẽ tự động kích hoạt chế độ **Demo** với dữ liệu mẫu có sẵn.

---

## ⚙️ Biến môi trường (`.env.local`)

| Biến | Bắt buộc | Mô tả |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Không | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Không | Publishable key của Supabase |
| `SERVICE_REQUEST_WEBHOOK_URL` | Không | Webhook nhận thông báo form yêu cầu (n8n / Make / Webhook nội bộ) |
| `SERVICE_REQUEST_WEBHOOK_TOKEN` | Không | Secret token xác thực webhook |
| `NEXT_PUBLIC_SITE_URL` | Có | URL domain website (mặc định: `http://localhost:3000`) |

---

## 📜 Các lệnh thông dụng

```bash
# Chạy môi trường dev
pnpm dev

# Kiểm tra TypeScript
pnpm typecheck

# Build bản production
pnpm build

# Chạy bản production đã build
pnpm start
```
