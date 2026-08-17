create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  price_mode text not null default 'contact' check (price_mode in ('exact','from','contact','hidden')),
  price_amount numeric(14,2) check (price_amount is null or price_amount >= 0),
  price_label text,
  currency text not null default 'VND',
  warranty text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  accent text default '#b9f5dc',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(product_id, storage_path)
);

create unique index if not exists product_images_one_primary_idx on public.product_images(product_id) where is_primary = true;

create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  spec_name text not null,
  spec_value text not null,
  group_name text default 'Thông số chung',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  alt_text text,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 5242880),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main',
  company_name text,
  short_name text,
  site_description text,
  hotline text,
  zalo_url text,
  email text,
  address text,
  facebook_url text,
  messenger_url text,
  maps_url text,
  business_hours text,
  service_area text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 'main')
);

create table if not exists public.homepage_content (
  id text primary key default 'main',
  hero_eyebrow text,
  hero_title text,
  hero_emphasis text,
  hero_description text,
  hero_cta_label text,
  intro_title text,
  intro_text text,
  updated_at timestamptz not null default now(),
  constraint homepage_content_singleton check (id = 'main')
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_status_featured_idx on public.products(status, is_featured, sort_order);
create index if not exists product_images_product_idx on public.product_images(product_id, sort_order);
create index if not exists product_specs_product_idx on public.product_specs(product_id, sort_order);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_specs enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_content enable row level security;

create policy "admin can read own membership" on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy "public reads active categories" on public.categories for select to anon, authenticated using (is_active or public.is_admin());
create policy "admin manages categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published products" on public.products for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "admin manages products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published product images" on public.product_images for select to anon, authenticated using (exists(select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin())));
create policy "admin manages product images" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published product specs" on public.product_specs for select to anon, authenticated using (exists(select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin())));
create policy "admin manages product specs" on public.product_specs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads media metadata" on public.media_assets for select to anon, authenticated using (true);
create policy "admin manages media metadata" on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin manages site settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads homepage" on public.homepage_content for select to anon, authenticated using (true);
create policy "admin manages homepage" on public.homepage_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads product media" on storage.objects for select to anon, authenticated using (bucket_id = 'product-media');
create policy "admin uploads product media" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and public.is_admin());
create policy "admin updates product media" on storage.objects for update to authenticated using (bucket_id = 'product-media' and public.is_admin()) with check (bucket_id = 'product-media' and public.is_admin());
create policy "admin deletes product media" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and public.is_admin());

insert into public.site_settings (id, company_name, short_name, site_description, hotline, zalo_url, email, address, facebook_url, messenger_url, maps_url, business_hours, service_area)
values ('main', 'Cửa Cuốn An Tâm 24H', 'AN TÂM 24H', 'Dịch vụ sửa chữa, bảo trì và lắp đặt cửa cuốn tận nơi tại TP.HCM.', '0909 123 456', 'https://zalo.me/0909123456', 'hello@cuacuonantam.vn', '123 Đường Minh Họa, TP. Hồ Chí Minh', 'https://facebook.com/', 'https://m.me/', 'https://maps.google.com/?q=Ho+Chi+Minh+City', 'Tiếp nhận 24/7', 'TP. Hồ Chí Minh và khu vực lân cận')
on conflict (id) do nothing;

insert into public.homepage_content (id, hero_eyebrow, hero_title, hero_emphasis, hero_description, hero_cta_label, intro_title, intro_text)
values ('main', 'Cứu hộ cửa cuốn · Tiếp nhận 24/7', 'Cửa gặp sự cố?', 'Đừng để cả ngày bị kẹt lại.', 'Đặt lịch trong 60 giây. Kỹ thuật viên liên hệ xác nhận tình trạng, thời gian và báo giá tham khảo trước khi đến.', 'Gửi yêu cầu', 'Đúng thiết bị mới bền lâu.', 'Thiết bị được lựa chọn theo tải cửa và nhu cầu sử dụng thực tế.')
on conflict (id) do nothing;

insert into public.categories (name, slug, description, sort_order) values
('Motor cửa cuốn', 'motor-cua-cuon', 'Motor phù hợp nhiều tải cửa gia đình và cửa hàng.', 1),
('Bộ lưu điện', 'bo-luu-dien', 'Thiết bị duy trì vận hành cửa khi mất điện.', 2),
('Bộ điều khiển', 'bo-dieu-khien', 'Hộp nhận và thiết bị điều khiển cửa cuốn.', 3),
('Tay điều khiển', 'tay-dieu-khien', 'Remote cửa cuốn tương thích nhiều hệ điều khiển.', 4),
('An toàn', 'an-toan', 'Cảm biến và phụ kiện tăng an toàn khi vận hành.', 5),
('Thân cửa', 'than-cua', 'Nan và vật liệu thân cửa theo kích thước.', 6)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, short_description, description, price_mode, price_label, warranty, is_featured, status, sort_order, accent)
select c.id, seed.name, seed.slug, seed.summary, seed.summary, seed.price_mode, seed.price_label, seed.warranty, seed.featured, 'published', seed.sort_order, seed.accent
from (values
  ('motor-cua-cuon','Motor AMT 500','motor-amt-500','Motor tải trung cho nhà phố, vận hành ổn định và có xích kéo tay.','contact','Liên hệ','24 tháng',true,1,'#b9f5dc'),
  ('bo-luu-dien','UPS Safe 1000','ups-safe-1000','Duy trì vận hành cửa cuốn khi mất điện, phù hợp cửa gia đình.','exact','3.200.000đ','12 tháng',true,2,'#d9f99d'),
  ('bo-dieu-khien','Hộp nhận AMT Smart','hop-nhan-amt-smart','Bộ nhận tín hiệu ổn định, hỗ trợ khóa mã và cài nhiều remote.','exact','1.450.000đ','12 tháng',true,3,'#ffdfd5'),
  ('tay-dieu-khien','Remote AMT Mini','remote-amt-mini','Thiết kế nhỏ gọn, phím bấm rõ và tương thích nhiều hộp nhận.','exact','350.000đ','6 tháng',false,4,'#dce9ff'),
  ('an-toan','Cảm biến đảo chiều','cam-bien-dao-chieu','Phát hiện vật cản để hỗ trợ dừng hoặc đảo chiều cửa khi đóng.','contact','Liên hệ','12 tháng',false,5,'#f3e2ff'),
  ('than-cua','Nan nhôm AMT A50','nan-nhom-amt-a50','Nan nhôm hai lớp có khe thoáng, phù hợp nhà phố và cửa hàng.','contact','Theo kích thước','Theo hợp đồng',false,6,'#e5e7eb')
) as seed(category_slug,name,slug,summary,price_mode,price_label,warranty,featured,sort_order,accent)
join public.categories c on c.slug = seed.category_slug
on conflict (slug) do nothing;
