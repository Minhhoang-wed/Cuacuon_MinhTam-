-- 1. Tạo người dùng bằng Supabase Dashboard > Authentication > Users.
-- 2. Thay email bên dưới bằng email vừa tạo và chạy câu lệnh này trong SQL Editor.

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'admin@example.com'
on conflict (user_id) do update set email = excluded.email;
