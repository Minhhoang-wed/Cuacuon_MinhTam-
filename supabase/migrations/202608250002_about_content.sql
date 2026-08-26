-- Migration: About Page Content (Trang Giới thiệu)
-- Description: Adds about_content singleton table and RLS policies

create table if not exists public.about_content (
  id text primary key default 'main',
  hero_title text,
  hero_description text,
  hero_image text,
  philosophy_kicker text,
  philosophy_title text,
  philosophy_text_1 text,
  philosophy_text_2 text,
  image_1_url text,
  image_2_url text,
  values_heading text,
  value_1_title text,
  value_1_text text,
  value_2_title text,
  value_2_text text,
  value_3_title text,
  value_3_text text,
  process_heading text,
  process_step_1 text,
  process_step_2 text,
  process_step_3 text,
  process_step_4 text,
  process_step_5 text,
  updated_at timestamptz not null default now(),
  constraint about_content_singleton check (id = 'main')
);

alter table public.about_content enable row level security;

create policy "Public read about_content" on public.about_content
  for select using (true);

create policy "Admin manage about_content" on public.about_content
  for all using (true);

-- Seed initial data
insert into public.about_content (
  id,
  hero_title,
  hero_description,
  hero_image,
  philosophy_kicker,
  philosophy_title,
  philosophy_text_1,
  philosophy_text_2,
  image_1_url,
  image_2_url,
  values_heading,
  value_1_title,
  value_1_text,
  value_2_title,
  value_2_text,
  value_3_title,
  value_3_text,
  process_heading,
  process_step_1,
  process_step_2,
  process_step_3,
  process_step_4,
  process_step_5
) values (
  'main',
  'Tận tâm trong từng công trình.',
  'Từ một yêu cầu sửa chữa nhỏ đến hệ cửa cho nhà xưởng, chúng tôi luôn bắt đầu bằng khảo sát rõ ràng và kết thúc bằng bàn giao minh bạch.',
  '/images/about-hero-banner.jpg',
  'Triết lý phục vụ',
  'Giải pháp tốt phải an toàn, phù hợp và bền lâu.',
  'Chúng tôi không chỉ xử lý lỗi trước mắt. Mỗi hạng mục đều được xem xét theo tải cửa, tần suất vận hành, điều kiện công trình và nhu cầu thực tế của khách hàng.',
  'Đội ngũ ưu tiên giải thích dễ hiểu, thống nhất chi phí trước khi làm và hướng dẫn sử dụng sau khi bàn giao.',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=82',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=82',
  'Giá trị cốt lõi',
  'Đúng kỹ thuật',
  'Khảo sát hiện trạng, xác định nguyên nhân và lựa chọn giải pháp phù hợp với từng hệ cửa.',
  'Minh bạch',
  'Giải thích hạng mục, báo giá trước khi thực hiện và nêu rõ chính sách bảo hành.',
  'Tận tâm',
  'Thi công gọn gàng, chạy thử đầy đủ và tiếp tục hỗ trợ sau khi công trình hoàn tất.',
  'Rõ ràng từ tiếp nhận đến bảo hành.',
  'Tiếp nhận thông tin và hình ảnh hiện trạng',
  'Khảo sát, tư vấn giải pháp phù hợp',
  'Thống nhất vật tư, chi phí và tiến độ',
  'Thi công, chạy thử và nghiệm thu',
  'Bàn giao hướng dẫn và chính sách bảo hành'
) on conflict (id) do nothing;
