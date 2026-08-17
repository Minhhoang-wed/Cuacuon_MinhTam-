# Cửa Cuốn An Tâm 24H

Website giới thiệu dịch vụ và sản phẩm cửa cuốn, kết hợp khu quản trị nội dung dành cho doanh nghiệp. Giao diện public tập trung tạo liên hệ qua hotline, Zalo, Maps và form yêu cầu sửa chữa; khu Admin quản lý catalog, ảnh và nội dung chính mà không cần sửa source.

## Phạm vi đã hoàn thành

- Trang chủ, dịch vụ, sản phẩm, danh mục, dự án, tin tức và liên hệ.
- Tìm kiếm/lọc sản phẩm, trang chi tiết, thông số và sản phẩm liên quan.
- Form yêu cầu sửa chữa gồm họ tên, điện thoại, địa chỉ, tình trạng, thời gian mong muốn và tối đa 4 ảnh.
- Admin Login và CMS cho sản phẩm, danh mục, thông số, thư viện ảnh, nội dung trang chủ và thông tin doanh nghiệp.
- Dữ liệu catalog dùng Supabase; có dữ liệu demo dự phòng khi chưa cấu hình Supabase.
- Phân quyền bằng Supabase Auth, bảng `admin_users`, Row Level Security và chính sách Storage.
- SEO metadata, LocalBusiness JSON-LD, sitemap động và robots.
- Giao diện responsive, thanh hotline/Zalo nổi bật trên điện thoại.

## Công nghệ

- Next.js 16.2.11 App Router + React 19
- TypeScript strict
- Tailwind CSS 4.3 + CSS component styles
- Supabase Auth, Postgres, REST API và Storage
- API Route nhận form multipart và ảnh

Yêu cầu Node.js **20.9 trở lên**. Khuyến nghị dùng pnpm.

## Chạy nhanh ở chế độ demo

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Mở `http://localhost:3000`. Không có cấu hình Supabase, website vẫn hiển thị dữ liệu mẫu và khu Admin chạy ở chế độ xem trước, không ghi dữ liệu.

Kiểm tra trước khi bàn giao:

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Kết nối Supabase

1. Tạo một Supabase project.
2. Mở SQL Editor và chạy `supabase/migrations/202608170001_catalog_cms.sql`.
3. Trong Authentication, tạo user cho quản trị viên bằng email và mật khẩu mạnh.
4. Mở `supabase/ADMIN_SETUP.sql`, thay email mẫu bằng email vừa tạo rồi chạy script.
5. Lấy Project URL và Publishable key trong Supabase, sau đó khai báo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=https://ten-mien-that.vn
```

Sau khi khởi động lại website, truy cập `/admin/login`. Script migration đã bật RLS: khách chỉ đọc nội dung đang công khai; user có trong `admin_users` mới được tạo, sửa, ẩn hoặc xóa nội dung.

Không đưa secret key hoặc service-role key vào mã nguồn hay biến bắt đầu bằng `NEXT_PUBLIC_`.

## Sử dụng Admin CMS

- `/admin/dashboard`: tổng quan nhanh.
- `/admin/products`: danh sách, tạo và sửa sản phẩm; quản lý thông số và ảnh.
- `/admin/categories`: tạo, đổi tên, sắp xếp và ẩn danh mục.
- `/admin/media`: tải ảnh vào thư viện và xóa ảnh không còn dùng.
- `/admin/homepage`: chỉnh tiêu đề, mô tả và các số liệu nổi bật trên trang chủ.
- `/admin/settings`: chỉnh thương hiệu, hotline, Zalo, email, địa chỉ, Maps và SEO mặc định.

Hướng dẫn thao tác chi tiết nằm tại `docs/ADMIN_GUIDE.md`.

## Cấu hình form yêu cầu sửa chữa

Form gửi `multipart/form-data` tới `/api/requests`. Server kiểm tra trường bắt buộc, số điện thoại, tối đa 4 ảnh JPG/PNG/WebP, tối đa 5 MB mỗi ảnh và honeypot cơ bản.

Để nhận dữ liệu thật, cấu hình:

```env
SERVICE_REQUEST_WEBHOOK_URL=https://webhook-cua-doanh-nghiep.example
SERVICE_REQUEST_WEBHOOK_TOKEN=token-tuy-chon
```

API chuyển tiếp nội dung và ảnh tới endpoint nội bộ, Make, n8n hoặc Zapier. Trong production, nếu chưa có webhook thì API trả lỗi rõ ràng và hướng khách gọi hotline; ở local, form chạy demo và không chuyển dữ liệu ra ngoài.

Webhook nên dùng HTTPS, xác thực token, giới hạn dung lượng, kiểm tra MIME, hạn chế log dữ liệu cá nhân và có chính sách lưu/xóa ảnh.

## Cấu trúc nội dung

```text
app/                         Trang public, Admin và API
components/                  Thành phần giao diện dùng lại
data/                        Nội dung mẫu dự phòng
lib/catalog.ts               Lớp đọc dữ liệu public
lib/admin-actions.ts         Các thao tác CMS phía server
supabase/migrations/         Database, RLS, Storage và dữ liệu mẫu
public/                      Tài sản tĩnh
docs/ADMIN_GUIDE.md          Hướng dẫn quản trị
```

Các trang dịch vụ, dự án và tin tức hiện vẫn lấy dữ liệu từ `data/content.ts`. Catalog sản phẩm, thông tin doanh nghiệp và nội dung nổi bật trang chủ đã được chuyển sang CMS.

## Triển khai

### Vercel

1. Đưa source lên GitHub/GitLab/Bitbucket.
2. Import project vào Vercel.
3. Khai báo đầy đủ biến môi trường production.
4. Deploy, đăng nhập Admin, thử cập nhật một sản phẩm và gửi một yêu cầu nội bộ.

### Server Node.js

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Thiết lập HTTPS, reverse proxy, biến môi trường, sao lưu Supabase và giám sát tiến trình.

## Dữ liệu khách hàng cần cung cấp

- Tên thương hiệu, logo, hotline, Zalo, email, địa chỉ và liên kết Google Maps.
- Khu vực phục vụ, giờ tiếp nhận và cam kết thời gian phản hồi.
- Danh sách dịch vụ, giá tham khảo và chính sách bảo hành.
- Danh mục sản phẩm, model, thông số, giá và ảnh có quyền sử dụng.
- Ảnh/case study dự án thật, bài viết và quyền sử dụng hình ảnh.
- Nội dung pháp lý: chính sách bảo mật, điều khoản dịch vụ và chính sách hủy lịch.
- Domain, hosting, Analytics, Search Console và kênh nhận form.
- Danh sách email được cấp quyền quản trị.

## Giả định và giới hạn

- Nội dung, thông tin liên hệ và ảnh hiện tại là dữ liệu demo, cần xác nhận trước khi chạy thật.
- CMS chưa quản lý dịch vụ, dự án và tin tức; các mục này được tổ chức trong source để mở rộng ở giai đoạn sau.
- Chưa bao gồm tài khoản khách hàng, CRM/POS/ERP, điều phối kỹ thuật viên, SMS/Zalo API và báo cáo nâng cao.
- Website mẫu chỉ được dùng để tham khảo cách tổ chức thông tin. Giao diện, câu chữ và cấu trúc mã của dự án này được xây dựng riêng.
