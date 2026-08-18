-- Migration: Completed Projects Schema
-- Description: Creates projects and project_images tables with RLS and triggers

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  location text not null default 'TP.HCM',
  category text not null default 'Nhà phố',
  summary text not null,
  description text,
  result text default 'Hoàn tất bàn giao đúng tiến độ, vận hành êm ái.',
  accent text default '#10b981',
  is_featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(project_id, storage_path)
);

create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_featured on public.projects(is_featured);
create index if not exists idx_project_images_project on public.project_images(project_id);

-- RLS Policies
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

-- Public can view published projects
create policy "Allow public read published projects"
  on public.projects
  for select
  using (status = 'published');

create policy "Allow public read project images"
  on public.project_images
  for select
  using (true);

-- Authenticated admins have full access
create policy "Allow admin full access projects"
  on public.projects
  for all
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

create policy "Allow admin full access project images"
  on public.project_images
  for all
  using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
