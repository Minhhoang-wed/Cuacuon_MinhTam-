-- Migration: Analytics & Tracking System
-- Description: Real-time website analytics — page views, events, daily aggregates, content stats

-- ══════════════════════════════════════════════════════
-- 1. RAW PAGE VIEWS
-- ══════════════════════════════════════════════════════
create table if not exists public.analytics_page_views (
  id           uuid primary key default gen_random_uuid(),
  visitor_id   text not null,
  session_id   text not null,
  page_path    text not null,
  page_title   text,
  referrer     text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  device_type  text not null default 'desktop'
                 check (device_type in ('desktop','mobile','tablet')),
  browser      text,
  os           text,
  country      text default 'VN',
  city         text,
  duration_ms  integer not null default 0,
  scroll_depth integer not null default 0
                 check (scroll_depth >= 0 and scroll_depth <= 100),
  is_bounce    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_apv_created      on public.analytics_page_views(created_at desc);
create index if not exists idx_apv_path         on public.analytics_page_views(page_path);
create index if not exists idx_apv_visitor      on public.analytics_page_views(visitor_id);
create index if not exists idx_apv_session      on public.analytics_page_views(session_id);
create index if not exists idx_apv_session_path on public.analytics_page_views(session_id, page_path);

-- ══════════════════════════════════════════════════════
-- 2. CLICK & CUSTOM EVENTS
-- ══════════════════════════════════════════════════════
create table if not exists public.analytics_events (
  id           uuid primary key default gen_random_uuid(),
  visitor_id   text not null,
  session_id   text not null,
  event_type   text not null,
  event_target text,
  event_data   jsonb not null default '{}',
  page_path    text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_ae_created      on public.analytics_events(created_at desc);
create index if not exists idx_ae_type         on public.analytics_events(event_type);
create index if not exists idx_ae_target       on public.analytics_events(event_target);
create index if not exists idx_ae_type_created on public.analytics_events(event_type, created_at desc);

-- ══════════════════════════════════════════════════════
-- 3. DAILY AGGREGATED STATS
-- ══════════════════════════════════════════════════════
create table if not exists public.analytics_daily_stats (
  id                uuid primary key default gen_random_uuid(),
  stat_date         date not null unique,
  total_views       integer not null default 0,
  unique_visitors   integer not null default 0,
  total_sessions    integer not null default 0,
  avg_duration_ms   integer not null default 0,
  avg_scroll_depth  integer not null default 0,
  bounce_rate       numeric(5,2) not null default 0,
  top_pages         jsonb not null default '[]',
  top_referrers     jsonb not null default '[]',
  device_breakdown  jsonb not null default '{}',
  hourly_views      jsonb not null default '[]',
  cta_clicks        jsonb not null default '{}',
  created_at        timestamptz not null default now()
);

-- ══════════════════════════════════════════════════════
-- 4. CONTENT-LEVEL STATS (product / article / service)
-- ══════════════════════════════════════════════════════
create table if not exists public.analytics_content_stats (
  id             uuid primary key default gen_random_uuid(),
  content_type   text not null check (content_type in ('product','article','service')),
  content_id     text not null,
  content_title  text,
  stat_date      date not null,
  views          integer not null default 0,
  unique_views   integer not null default 0,
  clicks         integer not null default 0,
  avg_duration   integer not null default 0,
  avg_scroll     integer not null default 0,
  created_at     timestamptz not null default now(),
  unique(content_type, content_id, stat_date)
);

create index if not exists idx_acs_type_date on public.analytics_content_stats(content_type, stat_date desc);
create index if not exists idx_acs_content   on public.analytics_content_stats(content_id);

-- ══════════════════════════════════════════════════════
-- 5. ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════
alter table public.analytics_page_views   enable row level security;
alter table public.analytics_events       enable row level security;
alter table public.analytics_daily_stats  enable row level security;
alter table public.analytics_content_stats enable row level security;

-- Anonymous visitors can INSERT and UPDATE tracking data (for duration/scroll)
create policy "anon_insert_page_views"
  on public.analytics_page_views for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_page_views"
  on public.analytics_page_views for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon_insert_events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

-- Only admins can READ analytics data
create policy "admin_read_page_views"
  on public.analytics_page_views for select
  to authenticated
  using (public.is_admin());

create policy "admin_read_events"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin());

create policy "admin_manage_daily_stats"
  on public.analytics_daily_stats for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_manage_content_stats"
  on public.analytics_content_stats for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ══════════════════════════════════════════════════════
-- 6. AGGREGATION FUNCTION (called by pg_cron every hour)
-- ══════════════════════════════════════════════════════
create or replace function public.aggregate_daily_analytics(target_date date default current_date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_top_pages    jsonb;
  v_top_refs     jsonb;
  v_hourly       jsonb;
  v_cta          jsonb;
begin
  -- Top 10 pages
  select coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb) into v_top_pages
  from (
    select page_path as path, count(*) as views, count(distinct visitor_id) as uniq
    from analytics_page_views where created_at::date = target_date
    group by page_path order by views desc limit 10
  ) t;

  -- Top 10 referrers
  select coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb) into v_top_refs
  from (
    select coalesce(nullif(referrer,''), 'Direct') as source, count(*) as cnt
    from analytics_page_views where created_at::date = target_date
    group by source order by cnt desc limit 10
  ) t;

  -- Hourly distribution (24 elements)
  select coalesce(jsonb_agg(coalesce(hv.cnt, 0) order by h.h), '[]'::jsonb) into v_hourly
  from generate_series(0, 23) h(h)
  left join (
    select extract(hour from created_at)::int as hr, count(*) as cnt
    from analytics_page_views where created_at::date = target_date
    group by hr
  ) hv on hv.hr = h.h;

  -- CTA click breakdown
  select coalesce(jsonb_object_agg(event_target, cnt), '{}'::jsonb) into v_cta
  from (
    select coalesce(event_target, 'other') as event_target, count(*) as cnt
    from analytics_events
    where created_at::date = target_date and event_type = 'cta_click'
    group by event_target
  ) t;

  -- Upsert daily row
  insert into analytics_daily_stats (
    stat_date, total_views, unique_visitors, total_sessions,
    avg_duration_ms, avg_scroll_depth, bounce_rate,
    top_pages, top_referrers, device_breakdown, hourly_views, cta_clicks
  )
  select
    target_date,
    count(*),
    count(distinct visitor_id),
    count(distinct session_id),
    coalesce(avg(duration_ms)::int, 0),
    coalesce(avg(scroll_depth)::int, 0),
    round(
      count(*) filter (where is_bounce = true)::numeric
      / nullif(count(distinct session_id), 0) * 100, 2
    ),
    v_top_pages,
    v_top_refs,
    jsonb_build_object(
      'desktop', count(*) filter (where device_type = 'desktop'),
      'mobile',  count(*) filter (where device_type = 'mobile'),
      'tablet',  count(*) filter (where device_type = 'tablet')
    ),
    v_hourly,
    v_cta
  from analytics_page_views
  where created_at::date = target_date
  on conflict (stat_date) do update set
    total_views      = excluded.total_views,
    unique_visitors  = excluded.unique_visitors,
    total_sessions   = excluded.total_sessions,
    avg_duration_ms  = excluded.avg_duration_ms,
    avg_scroll_depth = excluded.avg_scroll_depth,
    bounce_rate      = excluded.bounce_rate,
    top_pages        = excluded.top_pages,
    top_referrers    = excluded.top_referrers,
    device_breakdown = excluded.device_breakdown,
    hourly_views     = excluded.hourly_views,
    cta_clicks       = excluded.cta_clicks;

  -- Aggregate content-level stats
  insert into analytics_content_stats (content_type, content_id, content_title, stat_date, views, unique_views, clicks, avg_duration, avg_scroll)
  select
    case
      when e.event_type = 'product_view' then 'product'
      when e.event_type = 'article_view' then 'article'
      when e.event_type = 'service_view' then 'service'
    end,
    e.event_target,
    (e.event_data->>'title')::text,
    target_date,
    count(*),
    count(distinct e.visitor_id),
    0,
    0,
    0
  from analytics_events e
  where e.created_at::date = target_date
    and e.event_type in ('product_view','article_view','service_view')
    and e.event_target is not null
  group by e.event_type, e.event_target, e.event_data->>'title'
  on conflict (content_type, content_id, stat_date) do update set
    views       = excluded.views,
    unique_views = excluded.unique_views,
    content_title = coalesce(excluded.content_title, analytics_content_stats.content_title);
end;
$$;

-- ══════════════════════════════════════════════════════
-- 7. CLEANUP FUNCTION (raw data older than 90 days)
-- ══════════════════════════════════════════════════════
create or replace function public.cleanup_old_analytics()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from analytics_page_views  where created_at < now() - interval '90 days';
  delete from analytics_events      where created_at < now() - interval '90 days';
end;
$$;

-- ══════════════════════════════════════════════════════
-- 8. ENABLE SUPABASE REALTIME
-- ══════════════════════════════════════════════════════
alter publication supabase_realtime add table analytics_page_views;
alter publication supabase_realtime add table analytics_events;

-- ══════════════════════════════════════════════════════
-- 9. pg_cron SCHEDULES (run in Supabase SQL Editor manually)
-- NOTE: Uncomment and run these in Supabase Dashboard > SQL Editor
-- ══════════════════════════════════════════════════════
-- SELECT cron.schedule('aggregate-analytics-hourly', '5 * * * *', 'SELECT public.aggregate_daily_analytics()');
-- SELECT cron.schedule('cleanup-old-analytics', '0 3 * * *', 'SELECT public.cleanup_old_analytics()');
