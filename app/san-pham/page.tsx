import type { Metadata } from "next";
import { ArrowRight, Search, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { formatPrice, getCategories, getProducts } from "@/lib/catalog";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}): Promise<Metadata> {
  const filters = await searchParams;
  const isFiltered = Boolean(filters.q || filters.category);
  return {
    title: "Sản phẩm & phụ kiện",
    description: "Danh mục motor, bộ lưu điện, điều khiển, cảm biến và phụ kiện cửa cuốn.",
    alternates: { canonical: filters.category && !filters.q ? `/danh-muc/${filters.category}` : "/san-pham" },
    robots: isFiltered ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const filters = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: filters.category, search: filters.q }),
  ]);

  return (
    <>
      <PageHero
        title="Thiết Bị Cửa Cuốn Chuẩn Mực & Bền Bỉ"
        description="Tra cứu theo từng dòng cửa khe thoáng, tấm liền, motor hoặc phụ kiện. Toàn bộ thông số, báo giá và chính sách bảo hành được quản lý minh bạch."
        image="/images/product-hero-banner.jpg"
      />

      <section className="catalog-tools">
        <div className="container">
          <form className="catalog-search" action="/san-pham">
            <Search size={18} />
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Tìm kiếm motor, nan cửa, remote, bộ lưu điện..."
              aria-label="Tìm sản phẩm"
            />
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            <button className="button button-dark" style={{ height: "46px" }}>
              Tìm kiếm
            </button>
          </form>

          <div className="category-row">
            <Link className={!filters.category ? "selected" : ""} href="/san-pham">
              TẤT CẢ
            </Link>
            {categories.map((category) => (
              <Link
                className={filters.category === category.slug ? "selected" : ""}
                href={`/san-pham?category=${category.slug}`}
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
            {(filters.q || filters.category) && (
              <Link href="/san-pham" className="clear-filter">
                <X size={14} /> Xóa lọc
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {products.length ? (
            <div className="lovable-product-grid">
              {products.map((product) => (
                <article className="lovable-product-card" key={product.id}>
                  <Link href={`/san-pham/${product.slug}`} className="lovable-product-card-link">
                    <div className="lovable-product-image">
                      <img
                        src={product.images[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"}
                        alt={product.images[0]?.altText || product.name}
                      />
                      {product.featured && <span>Nổi bật</span>}
                      <i>Chi tiết →</i>
                    </div>
                    <div className="lovable-product-body">
                      <span>{product.category.name}</span>
                      <h3>{product.name}</h3>
                      <p>{product.shortDescription}</p>
                      <div>
                        <b>{formatPrice(product)}</b>
                        <small>{product.warranty}</small>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={36} />
              <h2>Chưa tìm thấy sản phẩm phù hợp</h2>
              <p>Thử tìm kiếm bằng từ khóa khác hoặc xem toàn bộ bộ sưu tập.</p>
              <Link href="/san-pham" className="button button-dark">
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaBand compact />
    </>
  );
}

