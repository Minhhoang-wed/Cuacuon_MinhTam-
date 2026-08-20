-- Migration: Services, Articles & Service Requests Schema
-- Description: Adds tables, RLS policies and seed data for Services, Articles, and Customer Service Requests

-- 1. SERVICES TABLE
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  summary text not null,
  description text,
  price text not null default 'Khảo sát báo giá',
  duration text not null default '30 - 60 phút',
  warranty text not null default '12 tháng',
  symptoms jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  accent text default '#10b981',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists idx_services_active on public.services(is_active);
create index if not exists idx_services_sort on public.services(sort_order);

-- 2. ARTICLES TABLE (Tin tức / Cẩm nang)
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Cẩm nang sử dụng',
  excerpt text not null,
  content jsonb not null default '[]'::jsonb,
  image_url text,
  read_time text not null default '3 phút',
  author text default 'Kỹ Thuật Viên An Tâm',
  is_featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists idx_articles_status on public.articles(status);
create index if not exists idx_articles_category on public.articles(category);
create index if not exists idx_articles_featured on public.articles(is_featured);

-- 3. SERVICE REQUESTS TABLE (Đơn yêu cầu / Leads CRM)
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text not null unique,
  name text not null,
  phone text not null,
  address text not null,
  issue text not null,
  preferred_time text not null,
  preferred_date text,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_service_requests_status on public.service_requests(status);
create index if not exists idx_service_requests_created on public.service_requests(created_at desc);

-- RLS POLICIES
alter table public.services enable row level security;
alter table public.articles enable row level security;
alter table public.service_requests enable row level security;

-- Public can view active services & published articles
create policy "Allow public read active services"
  on public.services for select using (is_active = true);

create policy "Allow public read published articles"
  on public.articles for select using (status = 'published');

-- Public can insert service requests (form on website)
create policy "Allow public insert service requests"
  on public.service_requests for insert with check (true);

-- Admin has full access to all three tables
create policy "Allow admin full access services"
  on public.services for all
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

create policy "Allow admin full access articles"
  on public.articles for all
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

create policy "Allow admin full access service_requests"
  on public.service_requests for all
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

-- SEED DATA: Services
insert into public.services (name, slug, summary, price, duration, warranty, symptoms, process, sort_order, is_active)
values
  (
    'Sửa chữa cửa cuốn khẩn cấp 24/7',
    'sua-chua-cua-cuon-khan-cap-24-7',
    'Khắc phục sự cố kẹt nan, đứt lá, rơi cửa, không nhận remote hoặc motor dừng giữa chừng. Kỹ thuật viên có mặt sau 15 - 30 phút.',
    'Từ 250.000đ',
    '20 - 45 phút',
    '6 - 12 tháng',
    '["Cửa dừng giữa chừng không lên xuống được", "Nan cửa bị kẹt, xô nan hoặc bung ray", "Motor phát tiếng kêu bất thường nhưng cửa không chạy", "Mất điện không mở được cửa hoặc đứt xích kéo tay"]'::jsonb,
    '["Tiếp nhận thông tin và định vị sự cố qua điện thoại", "Kỹ thuật viên đến hiện trường trong 15-30 phút", "Kiểm tra toàn diện, báo giá minh bạch trước khi làm", "Tiến hành sửa chữa, thay thế linh kiện chính hãng", "Vận hành thử nghiệm và bàn giao phiếu bảo hành"]'::jsonb,
    1,
    true
  ),
  (
    'Bảo trì, bảo dưỡng định kỳ hệ thống cửa cuốn',
    'bao-tri-bao-duong-dinh-ky',
    'Vệ sinh tra dầu mỡ ray dẫn hướng, căn chỉnh lò xo, kiểm tra độ an toàn motor và bình lưu điện, tăng tuổi thọ thiết bị gấp đôi.',
    'Từ 200.000đ',
    '30 - 60 phút',
    'Bảo trì 3 tháng',
    '["Cửa phát tiếng kêu cọt kẹt lớn khi đóng mở", "Cửa chạy bị giật, rung lắc không êm ái", "Bình lưu điện nhanh hết pin hoặc không nạp điện", "Hệ thống đã sử dụng trên 1 năm chưa được kiểm tra"]'::jsonb,
    '["Kiểm tra tổng quan ray dẫn hướng và nan cửa", "Tra mỡ chịu nhiệt vào các khớp nối và trục quay", "Căn chỉnh độ căng lò xo và hành trình ngắt motor", "Đo kiểm dòng điện bình lưu và mạch điều khiển", "Tư vấn cách vận hành an toàn và ghi nhật ký bảo trì"]'::jsonb,
    2,
    true
  ),
  (
    'Lắp đặt & thay thế motor cửa cuốn chính hãng',
    'lap-dat-thay-the-motor-cua-cuon',
    'Cung cấp và lắp đặt các dòng motor xích kéo, motor ống từ Đài Loan, Đức: YH, JG, Titadoor, Austdoor sức nâng từ 300kg - 1000kg.',
    'Từ 2.200.000đ',
    '1 - 2 giờ',
    '24 tháng',
    '["Motor bị cháy cuộn dây, chập mạch điện", "Motor yếu không kéo nổi tải trọng cửa", "Hỏng bộ điều khiển từ xa hoặc rơ-le đảo chiều", "Nâng cấp từ cửa kéo tay lên cửa tự động"]'::jsonb,
    '["Khảo sát tải trọng cửa để chọn công suất motor phù hợp", "Tháo gỡ motor cũ an toàn (nếu có)", "Gá lắp mặt bích, motor và kết nối xích truyền động", "Cài đặt tay điều khiển và cảm biến tự dừng", "Bàn giao kèm tem bảo hành chính hãng"]'::jsonb,
    3,
    true
  ),
  (
    'Cứu hộ & lắp đặt bình lưu điện cửa cuốn (UPS)',
    'cuu-ho-lap-dat-binh-luu-dien-ups',
    'Lắp đặt bộ lưu điện chuyên dụng giúp đóng mở cửa từ 24h - 48h khi mất điện lưới. Thay thế ắc quy bình lưu điện cũ giá ưu đãi.',
    'Từ 1.850.000đ',
    '30 - 45 phút',
    '12 - 24 tháng',
    '["Mất điện không điều khiển được cửa cuốn", "Bình lưu điện kêu bíp liên tục hoặc báo đèn đỏ", "Ắc quy bị chai, phồng không tích được điện", "Chưa trang bị bộ lưu điện cho cửa cuốn chính"]'::jsonb,
    '["Kiểm tra công suất tiêu thụ của motor hiện tại", "Lựa chọn dòng UPS có dung lượng ắc quy phù hợp", "Đấu nối song song an toàn qua cầu dao đảo", "Test thực tế đóng/mở nhiều chu kỳ ở chế độ mất điện", "Hướng dẫn quy trình xả/nạp định kỳ để kéo dài tuổi thọ"]'::jsonb,
    4,
    true
  )
on conflict (slug) do nothing;

-- SEED DATA: Articles
insert into public.articles (title, slug, category, excerpt, content, read_time, author, is_featured, status, sort_order)
values
  (
    'Hướng dẫn xử lý an toàn khi cửa cuốn bị kẹt nan giữa chừng',
    'huong-dan-xu-ly-an-toan-khi-cua-cuon-bi-ket-nan',
    'Cẩm nang an toàn',
    'Kẹt nan là sự cố phổ biến có thể gây đứt lò xo hoặc cháy motor nếu cố bấm remote. Dưới đây là 4 bước xử lý an toàn ngay tại chỗ.',
    '["Khi phát hiện cửa cuốn có tiếng kêu lạ hoặc nan cửa bị xô lệch, điều đầu tiên và quan trọng nhất là bạn cần DỪNG NGAY việc bấm nút đóng/mở trên remote hoặc hộp điều khiển âm tường.", "Việc tiếp tục bấm nút khi nan bị kẹt sẽ làm trục cuốn tiếp tục xoay trong khi thân cửa bị giữ lại, dẫn đến tình trạng đứt lá, cong ray hoặc cháy cuộn đồng của motor.", "Bước 2: Ngắt nguồn điện cấp cho motor để đảm bảo an toàn tuyệt đối, tránh hiện tượng tự động kích hoạt.", "Bước 3: Tuyệt đối không đứng hoặc để người thân đi qua lại phía dưới thân cửa đang trong trạng thái lệch nan.", "Bước 4: Liên hệ ngay kỹ thuật viên chuyên nghiệp để dùng thiết bị chuyên dụng căn chỉnh lại ray và đưa nan cửa về đúng vị trí cân bằng."]'::jsonb,
    '3 phút',
    'Kỹ Thuật Viên An Tâm',
    true,
    'published',
    1
  ),
  (
    'Bao lâu nên bảo dưỡng motor và bình lưu điện cửa cuốn một lần?',
    'bao-lau-nen-bao-duong-motor-va-binh-luu-dien',
    'Kinh nghiệm bảo trì',
    'Khí hậu nóng ẩm tại Việt Nam dễ làm giảm tuổi thọ ắc quy và khô mỡ vòng bi motor. Hãy xem lịch khuyến nghị từ chuyên gia.',
    '["Hệ thống cửa cuốn tự động bao gồm nhiều bộ phận cơ khí và mạch điện tử hoạt động dưới tần suất cao mỗi ngày.", "Đối với motor cửa cuốn: Khuyến nghị tra mỡ chịu nhiệt vào các bánh răng truyền động và kiểm tra chổi than mỗi 6 - 12 tháng/lần tùy thuộc vào tần suất đóng mở nhiều hay ít.", "Đối với bình lưu điện (UPS): Nên thực hiện quy trình xả điện 1 lần mỗi tháng bằng cách rút phích cắm điện nguồn 220V và đóng mở cửa 2-3 lần bằng nguồn bình. Việc này giúp ắc quy không bị chai và tăng tuổi thọ lên tới 3-5 năm.", "Kiểm tra hệ thống đảo chiều tự dừng: Luôn thử đặt vật cản cao khoảng 15cm dưới đáy cửa để kiểm tra cảm biến có tự dừng lại khi chạm vật cản hay không."]'::jsonb,
    '4 phút',
    'Kỹ Thuật Viên An Tâm',
    true,
    'published',
    2
  ),
  (
    'So sánh cửa cuốn khe thoáng nhôm và cửa cuốn tấm liền: Nên chọn loại nào?',
    'so-sanh-cua-cuon-khe-thoang-va-tam-lien',
    'Tư vấn chọn mua',
    'Phân tích chi tiết ưu nhược điểm về độ êm, tính an toàn, thẩm mỹ và chi phí của 2 dòng cửa cuốn phổ biến nhất hiện nay.',
    '["1. Cửa cuốn khe thoáng nhôm: Thân cửa được ghép từ các nan nhôm hợp kim định hình cao cấp 6063-T5, có các ô thoáng điều hòa không khí và ánh sáng. Ưu điểm là vận hành siêu êm nhờ ron giảm chấn, màu sơn tĩnh điện sang trọng, phù hợp cho nhà phố, biệt thự và gara ô tô.", "2. Cửa cuốn tấm liền: Thân cửa dập liền sóng từ thép mạ màu hợp kim nhôm kẽm (Colorbond). Ưu điểm nổi bật là tốc độ đóng mở nhanh gấp 3 lần cửa khe thoáng, trọng lượng nhẹ, có thể dễ dàng chuyển sang kéo tay khi mất điện, chi phí tiết kiệm hơn.", "3. Lời khuyên lựa chọn: Nếu công trình ưu tiên sự thông thoáng, thẩm mỹ hiện đại và giảm tiếng ồn, cửa cuốn khe thoáng là lựa chọn hàng đầu. Nếu bạn cần tiết kiệm chi phí, mặt bằng kinh doanh cần tốc độ mở nhanh, cửa tấm liền là giải pháp tối ưu."]'::jsonb,
    '5 phút',
    'Kỹ Thuật Viên An Tâm',
    false,
    'published',
    3
  )
on conflict (slug) do nothing;
