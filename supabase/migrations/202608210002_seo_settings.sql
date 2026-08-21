-- Migration: 202608210002_seo_settings.sql
-- Description: Add SEO, OpenGraph, Twitter card, Robots, and Schema markup columns to site_settings

alter table public.site_settings
  add column if not exists seo_title_template text default '%s | Minh Tâm Door',
  add column if not exists seo_site_name text default 'Cửa Cuốn Minh Tâm 24H',
  add column if not exists seo_default_description text,
  add column if not exists seo_keywords text default 'sửa cửa cuốn, sửa cửa cuốn TP.HCM, cửa cuốn, motor cửa cuốn, phụ kiện cửa cuốn',
  add column if not exists seo_canonical_base text,
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists og_image_url text default '/og.png',
  add column if not exists og_locale text default 'vi_VN',
  add column if not exists twitter_card text default 'summary_large_image',
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text,
  add column if not exists twitter_site text,
  add column if not exists robots_index text default 'index',
  add column if not exists robots_follow text default 'follow',
  add column if not exists structured_business_name text,
  add column if not exists structured_phone text,
  add column if not exists structured_address_locality text default 'TP. Hồ Chí Minh',
  add column if not exists structured_address_region text default 'VN-SG',
  add column if not exists structured_price_range text default '$$';
