-- Migration: Service Areas (Branches & Districts) and Service Pricing
-- Description: Adds tables, RLS policies and seed data for Store Branches, Service Districts, and Service Price Categories

-- 1. Update services table: ensure image_url column exists
alter table if exists public.services add column if not exists image_url text;

-- 2. STORE BRANCHES TABLE (Chi nhánh cửa hàng trực tiếp)
create table if not exists public.store_branches (
  id uuid primary key default gen_random_uuid(),
  branch_name text not null,
  address text not null,
  hotline text not null default '0327.359.368',
  note text default 'Cửa hàng trưng bày & Trung tâm kỹ thuật',
  badge text default 'Cửa hàng trực tiếp',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_store_branches_active on public.store_branches(is_active);
create index if not exists idx_store_branches_sort on public.store_branches(sort_order);

-- 3. SERVICE DISTRICTS TABLE (Quận huyện kỹ thuật túc trực)
create table if not exists public.service_districts (
  id uuid primary key default gen_random_uuid(),
  district_name text not null,
  address_landmark text not null,
  response_time text not null default 'Có mặt sau 15 – 25 phút',
  note text,
  is_hotspot boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_service_districts_active on public.service_districts(is_active);
create index if not exists idx_service_districts_sort on public.service_districts(sort_order);

-- 4. SERVICE PRICING ITEMS TABLE (Bảng báo giá chi tiết từng danh mục)
create table if not exists public.service_price_items (
  id uuid primary key default gen_random_uuid(),
  category_name text not null, -- VD: "1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn"
  item_name text not null,     -- VD: "Sửa cửa cuốn bị kẹt nan, xổ lô nhẹ"
  price text not null,         -- VD: "300.000 – 800.000 VNĐ"
  warranty text not null default '3 – 6 tháng',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_service_price_category on public.service_price_items(category_name);
create index if not exists idx_service_price_sort on public.service_price_items(sort_order);

-- 5. RLS POLICIES
alter table public.store_branches enable row level security;
alter table public.service_districts enable row level security;
alter table public.service_price_items enable row level security;

-- Public read access
create policy "Public read store_branches" on public.store_branches for select using (true);
create policy "Public read service_districts" on public.service_districts for select using (true);
create policy "Public read service_price_items" on public.service_price_items for select using (true);

-- Admin full access
create policy "Admin insert store_branches" on public.store_branches for insert
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
create policy "Admin update store_branches" on public.store_branches for update
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
create policy "Admin delete store_branches" on public.store_branches for delete
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

create policy "Admin insert service_districts" on public.service_districts for insert
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
create policy "Admin update service_districts" on public.service_districts for update
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
create policy "Admin delete service_districts" on public.service_districts for delete
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

create policy "Admin insert service_price_items" on public.service_price_items for insert
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
create policy "Admin update service_price_items" on public.service_price_items for update
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
create policy "Admin delete service_price_items" on public.service_price_items for delete
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

-- 6. SEED DATA: 6 Standard Services matching Customer Page
insert into public.services (name, slug, summary, price, duration, warranty, image_url, symptoms, process, sort_order, is_active)
values
  (
    'Sửa cửa cuốn bị kẹt',
    'sua-cua-cuon-bi-ket',
    'Xử lý cửa kẹt nan, xổ lô, lệch ray, không lên xuống được an toàn, nhanh chóng.',
    '300.000 – 800.000đ',
    '20 - 45 phút',
    '3 – 6 tháng',
    '/services/sua-cua-bi-ket.png',
    '["Cửa dừng giữa chừng không lên xuống được", "Nan cửa bị kẹt, xô nan hoặc bung ray", "Cửa kêu to và kẹt cứng khi đóng mở"]'::jsonb,
    '["Tiếp nhận thông tin và định vị sự cố", "Kỹ thuật viên đến hiện trường trong 15-30 phút", "Nắn chỉnh nan, tra dầu mỡ và căn chỉnh ray", "Vận hành thử nghiệm và bàn giao"]'::jsonb,
    1,
    true
  ),
  (
    'Sửa motor cửa cuốn',
    'sua-motor-cua-cuon',
    'Sửa motor kẹt cơ, hỏng tụ, cháy cuộn dây, thay vỉ mạch hành trình chính hãng.',
    '350.000 – 800.000đ',
    '30 - 60 phút',
    '3 – 6 tháng',
    '/services/sua-motor.png',
    '["Motor phát tiếng kêu bất thường nhưng cửa không chạy", "Motor nóng nhanh, yếu tải không kéo được cửa", "Hỏng bộ điều khiển từ xa hoặc rơ-le"]'::jsonb,
    '["Kiểm tra cuộn dây, tụ điện và vỉ mạch", "Thay thế linh kiện chính hãng tại chỗ", "Căn chỉnh lại hành trình ngắt an toàn", "Bàn giao bảo hành 3-6 tháng"]'::jsonb,
    2,
    true
  ),
  (
    'Sửa remote & hộp nhận',
    'sua-remote-hop-nhan',
    'Khắc phục remote chập chờn, làm thêm remote mã gạt/nhảy, đổi mã khóa an toàn.',
    '150.000 – 550.000đ',
    '15 - 30 phút',
    '6 – 12 tháng',
    '/services/sua-remote.png',
    '["Remote bấm đèn sáng nhưng cửa không nhận lệnh", "Khoảng cách bắt sóng bị ngắn đi đáng kể", "Cần làm thêm chìa remote dự phòng"]'::jsonb,
    '["Đo tần số sóng điều khiển", "Cài đặt đồng bộ hộp nhận và tay remote mới", "Reset mã khóa cũ đảm bảo an ninh tuyệt đối", "Kiểm tra tầm bắt sóng và bàn giao"]'::jsonb,
    3,
    true
  ),
  (
    'Thay nan & lò xo cửa',
    'thay-nan-lo-xo-cua',
    'Gỡ xô nan, nắn phẳng nan móp gãy, thay bộ lò xo trợ lực kéo tay cao cấp.',
    '800.000 – 1.500.000đ',
    '45 - 90 phút',
    '6 – 12 tháng',
    '/services/thay-nan.png',
    '["Nan cửa bị đứt gãy khớp nối", "Lò xo cửa kéo tay bị đứt hoặc nhão", "Cửa kéo nặng bất thường, dễ tuột rơi"]'::jsonb,
    '["Tháo dỡ phần nan hỏng an toàn", "Thay thế nan cùng kích thước hoặc thay lò xo mới", "Cân chỉnh lực đàn hồi đồng đều hai bên", "Nghiệm thu đóng mở êm ái"]'::jsonb,
    4,
    true
  ),
  (
    'Sửa ray & chỉnh hành trình',
    'sua-ray-chinh-hanh-trinh',
    'Căn chỉnh, thay mới ray dẫn hướng bị lệch, móp, tra dầu mỡ bảo dưỡng trơn tru.',
    '400.000 – 900.000đ',
    '30 - 60 phút',
    '3 – 6 tháng',
    '/services/sua-ray.png',
    '["Ray dẫn hướng bị bung mối hàn, cong vênh", "Cửa đóng không chạm sàn hoặc mở vọt lên trên", "Nan cửa cọ sát vào ray phát tiếng rít chói tai"]'::jsonb,
    '["Gia cố và nắn chỉnh ray dẫn hướng", "Cài đặt lại công tắc hành trình rơ-le", "Tra mỡ bôi trơn chuyên dụng chịu nhiệt", "Chạy thử nhiều chu kỳ hoàn tất"]'::jsonb,
    5,
    true
  ),
  (
    'Sửa bình lưu điện (UPS)',
    'sua-binh-luu-dien-ups',
    'Sửa UPS lỗi không sạc, thay cặp ắc quy mới, thay bộ UPS chính hãng giá tốt.',
    '350.000 – 1.200.000đ',
    '30 - 45 phút',
    '6 – 24 tháng',
    '/services/binh-luu-dien.png',
    '["Mất điện không điều khiển mở cửa được", "Bình lưu điện kêu bíp liên tục hoặc báo đèn đỏ", "Ắc quy bị chai, phồng nạp không vào điện"]'::jsonb,
    '["Đo kiểm tra dung lượng cặp bình ắc quy", "Thay thế ắc quy chuyên dụng hoặc sửa mạch sạc", "Test cắt điện lưới vận hành thử đóng/mở", "Dán tem bảo hành và hướng dẫn bảo dưỡng"]'::jsonb,
    6,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  price = excluded.price,
  duration = excluded.duration,
  warranty = excluded.warranty,
  image_url = excluded.image_url,
  symptoms = excluded.symptoms,
  process = excluded.process,
  sort_order = excluded.sort_order;

-- 7. SEED DATA: Store Branches
insert into public.store_branches (branch_name, address, hotline, note, badge, sort_order, is_active)
values
  (
    'Cơ sở 1 (Trụ sở Quận 10)',
    '361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM',
    '0327.359.368',
    'Cửa hàng trưng bày & Trung tâm kỹ thuật',
    'Cửa hàng trực tiếp',
    1,
    true
  ),
  (
    'Cơ sở 2 (Chi nhánh Quận 6)',
    '617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM',
    '0327.359.368',
    'Cửa hàng trưng bày & Điểm trực kỹ thuật',
    'Cửa hàng trực tiếp',
    2,
    true
  );

-- 8. SEED DATA: Service Districts
insert into public.service_districts (district_name, address_landmark, response_time, note, is_hotspot, sort_order, is_active)
values
  ('Quận 1', '128 Nguyễn Trãi, P. Bến Thành, Quận 1', 'Có mặt sau 15 – 20 phút', 'Trạm kỹ thuật trung tâm', true, 1, true),
  ('Quận 2', '42 Trần Não, P. An Khánh, TP. Thủ Đức (Q.2 cũ)', 'Có mặt sau 15 – 25 phút', 'Trạm kỹ thuật khu Đông', false, 2, true),
  ('Quận 3', '215 Lý Chính Thắng, P. Võ Thị Sáu, Quận 3', 'Có mặt sau 15 – 20 phút', 'Trạm trực kỹ thuật', true, 3, true),
  ('Quận 4', '88 Hoàng Diệu, Phường 12, Quận 4', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật', false, 4, true),
  ('Quận 5', '156 Trần Hưng Đạo, Phường 7, Quận 5', 'Có mặt sau 15 – 20 phút', 'Trạm trực kỹ thuật Chợ Lớn', true, 5, true),
  ('Quận 6', '617 Phạm Văn Chí, P. Bình Tiên, Quận 6', 'Có mặt ngay sau 10 – 15 phút', 'Showroom trưng bày & Cơ sở trực tiếp', true, 6, true),
  ('Quận 7', '75 Nguyễn Thị Thập, P. Tân Phong, Quận 7', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật Nam Sài Gòn', false, 7, true),
  ('Quận 8', '324 Phạm Thế Hiển, Phường 3, Quận 8', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật', false, 8, true),
  ('Quận 9', '112 Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức (Q.9 cũ)', 'Có mặt sau 15 – 30 phút', 'Trạm trực kỹ thuật', false, 9, true),
  ('Quận 10', '361 Lý Thường Kiệt, P. Tân Hòa, Quận 10', 'Có mặt ngay sau 10 – 15 phút', 'Trụ sở chính & Showroom trưng bày', true, 10, true),
  ('Quận 11', '192 Lạc Long Quân, Phường 3, Quận 11', 'Có mặt sau 15 – 20 phút', 'Trạm trực kỹ thuật', true, 11, true),
  ('Quận 12', '184 Nguyễn Ảnh Thủ, P. Hiệp Thành, Quận 12', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật Q.12', false, 12, true),
  ('Quận Bình Thạnh', '268 Bạch Đằng, Phường 24, Q. Bình Thạnh', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật', true, 13, true),
  ('Quận Gò Vấp', '248 Quang Trung, Phường 10, Q. Gò Vấp', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật Gò Vấp', true, 14, true),
  ('Quận Tân Bình', '340 Trường Chinh, Phường 13, Q. Tân Bình', 'Có mặt sau 15 – 20 phút', 'Trạm trực kỹ thuật Tân Bình', true, 15, true),
  ('Quận Tân Phú', '165 Lũy Bán Bích, P. Tân Thới Hòa, Q. Tân Phú', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật Tân Phú', true, 16, true),
  ('Quận Phú Nhuận', '52 Phan Đăng Lưu, Phường 5, Q. Phú Nhuận', 'Có mặt sau 15 – 20 phút', 'Trạm trực kỹ thuật', true, 17, true),
  ('Quận Bình Tân', '458 Tên Lửa, P. Bình Trị Đông B, Q. Bình Tân', 'Có mặt sau 15 – 25 phút', 'Trạm trực kỹ thuật Bình Tân', true, 18, true),
  ('TP. Thủ Đức', '85 Kha Vạn Cân, P. Linh Trung, TP. Thủ Đức', 'Có mặt sau 15 – 30 phút', 'Trạm trực kỹ thuật Thủ Đức', false, 19, true),
  ('Huyện Hóc Môn', '12/4 Bà Điểm 4, Hóc Môn', 'Có mặt sau 20 – 35 phút', 'Đội kỹ thuật lưu động', false, 20, true),
  ('Huyện Bình Chánh', 'A8/12 Quốc Lộ 50, Bình Chánh', 'Có mặt sau 20 – 35 phút', 'Đội kỹ thuật lưu động', false, 21, true),
  ('Huyện Nhà Bè', '350 Huỳnh Tấn Phát, Thị trấn Nhà Bè', 'Có mặt sau 25 – 40 phút', 'Đội kỹ thuật lưu động', false, 22, true),
  ('Huyện Củ Chi', '180 Tỉnh Lộ 8, TT. Củ Chi', 'Có mặt sau 30 – 45 phút', 'Đội kỹ thuật lưu động', false, 23, true);

-- 9. SEED DATA: Service Pricing Items
insert into public.service_price_items (category_name, item_name, price, warranty, sort_order, is_active)
values
  -- Nhóm 1: Sửa chữa cơ bản & cứu hộ cửa cuốn
  ('1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn', 'Sửa cửa cuốn bị kẹt nan, xổ lô nhẹ', '300.000 – 800.000 VNĐ', '3 – 6 tháng', 1, true),
  ('1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn', 'Gỡ xô nan, nắn phẳng nan bị kẹt nặng', '800.000 – 1.500.000 VNĐ', '6 tháng', 2, true),
  ('1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn', 'Sửa ray cửa bị lệch, cong vênh, chỉnh hành trình', '400.000 – 900.000 VNĐ', '3 – 6 tháng', 3, true),
  ('1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn', 'Thay lò xo cửa cuốn kéo tay (theo bộ)', '800.000 – 1.900.000 VNĐ', '6 – 12 tháng', 4, true),
  ('1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn', 'Bảo dưỡng, vệ sinh, tra dầu mỡ toàn bộ cửa', '200.000 – 600.000 VNĐ', 'Kiểm tra định kỳ', 5, true),

  -- Nhóm 2: Sửa chữa & thay mới Motor
  ('2. Bảng giá sửa chữa & thay mới Motor', 'Sửa motor bị kẹt cơ, hỏng tụ, cháy cuộn dây', '350.000 – 800.000 VNĐ', '3 – 6 tháng', 1, true),
  ('2. Bảng giá sửa chữa & thay mới Motor', 'Thay tụ điện motor cửa cuốn', '300.000 – 500.000 VNĐ', '6 tháng', 2, true),
  ('2. Bảng giá sửa chữa & thay mới Motor', 'Thay vỉ mạch/hành trình motor', '495.000 – 1.200.000 VNĐ', '6 – 12 tháng', 3, true),
  ('2. Bảng giá sửa chữa & thay mới Motor', 'Thay mới motor cửa cuốn chính hãng (Austdoor, YH, Mitadoor...)', '1.500.000 – 3.500.000 VNĐ', '12 – 24 tháng', 4, true),
  ('2. Bảng giá sửa chữa & thay mới Motor', 'Motor tải trọng lớn hoặc nhập khẩu cao cấp', 'Từ 4.600.000 VNĐ', '12 – 24 tháng', 5, true),

  -- Nhóm 3: Remote & Hộp nhận tín hiệu
  ('3. Bảng giá Remote & Hộp nhận tín hiệu', 'Sửa remote lỗi mạch, lỗi mã phát sóng', '150.000 – 300.000 VNĐ', '3 – 6 tháng', 1, true),
  ('3. Bảng giá Remote & Hộp nhận tín hiệu', 'Làm thêm remote mã gạt thông dụng', '300.000 – 550.000 VNĐ', '6 – 12 tháng', 2, true),
  ('3. Bảng giá Remote & Hộp nhận tín hiệu', 'Làm thêm remote mã nhảy (ARC) chống sao chép', '400.000 – 650.000 VNĐ', '6 – 12 tháng', 3, true),
  ('3. Bảng giá Remote & Hộp nhận tín hiệu', 'Thay mới bộ hộp nhận + 2 remote điều khiển', '600.000 – 1.850.000 VNĐ', '12 tháng', 4, true),
  ('3. Bảng giá Remote & Hộp nhận tín hiệu', 'Reset, đổi mã khóa an toàn cửa cuốn', '200.000 – 350.000 VNĐ', 'Hỗ trợ tận nơi', 5, true),

  -- Nhóm 4: Bộ lưu điện (UPS)
  ('4. Bảng giá sửa chữa Bộ lưu điện (UPS)', 'Sửa UPS lỗi không sạc, lỗi mạch nguồn', '350.000 – 900.000 VNĐ', '3 – 6 tháng', 1, true),
  ('4. Bảng giá sửa chữa Bộ lưu điện (UPS)', 'Thay ắc quy bộ lưu điện (01 cặp 2 bình chất lượng cao)', '800.000 – 1.200.000 VNĐ', '6 tháng', 2, true),
  ('4. Bảng giá sửa chữa Bộ lưu điện (UPS)', 'Thay mới bộ lưu điện UPS chính hãng (900W – 1200W)', '2.200.000 – 2.900.000 VNĐ', '12 – 24 tháng', 3, true);
