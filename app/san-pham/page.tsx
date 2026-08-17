import type { Metadata } from "next";
import { ArrowRight, Search, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { DoorVisual } from "@/components/door-visual";
import { PageHero } from "@/components/page-hero";
import { formatPrice, getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Sản phẩm & phụ kiện", description: "Danh mục motor, bộ lưu điện, điều khiển, cảm biến và phụ kiện cửa cuốn." };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const filters = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts({ category: filters.category, search: filters.q })]);
  return <><PageHero eyebrow="Product Catalog" title="Chọn thiết bị vừa tải, đúng nhu cầu." description="Tra cứu theo danh mục hoặc tên sản phẩm. Thông số và giá được quản trị tập trung trong CMS." />
    <section className="catalog-tools"><div className="container"><form className="catalog-search" action="/san-pham"><Search /><input name="q" defaultValue={filters.q} placeholder="Tìm motor, remote, bộ lưu điện..." aria-label="Tìm sản phẩm" />{filters.category && <input type="hidden" name="category" value={filters.category} />}<button className="button button-dark">Tìm kiếm</button></form><div className="category-row"><Link className={!filters.category ? "selected" : ""} href="/san-pham">Tất cả</Link>{categories.map((category) => <Link className={filters.category === category.slug ? "selected" : ""} href={`/san-pham?category=${category.slug}`} key={category.id}>{category.name}</Link>)}{(filters.q || filters.category) && <Link href="/san-pham" className="clear-filter"><X /> Xóa lọc</Link>}</div></div></section>
    <section className="section"><div className="container">{products.length ? <div className="product-grid">{products.map((product) => <article className="product-card" key={product.id}><DoorVisual label={product.category.name} kind="product" accent={product.accent} imageUrl={product.images[0]?.url} imageAlt={product.images[0]?.altText || product.name} /><div className="product-card-body"><span className="product-category">{product.category.name}</span><h2>{product.name}</h2><p>{product.shortDescription}</p><div className="product-footer"><span><ShieldCheck /> {product.warranty}</span><b>{formatPrice(product)}</b></div><Link href={`/san-pham/${product.slug}`} className="text-link">Thông số chi tiết <ArrowRight size={17} /></Link></div></article>)}</div> : <div className="empty-state"><Search /><h2>Chưa tìm thấy sản phẩm phù hợp</h2><p>Thử từ khóa khác hoặc xem toàn bộ danh mục.</p><Link href="/san-pham" className="button button-dark">Xem tất cả sản phẩm</Link></div>}</div></section><CtaBand compact /></>;
}
