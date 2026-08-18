import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { getAdminCategories, getAdminProduct } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const id = (await params).id;
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]);
  if (!product) notFound();
  const saved = (await searchParams).saved;

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã lưu và cập nhật thông tin sản phẩm thành công.</span>
        </div>
      )}

      <header className="admin-page-header compact">
        <div>
          <Link href="/admin/products" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách sản phẩm</span>
          </Link>
          <h1>{product.name}</h1>
        </div>

        {product.status === "published" && (
          <Link href={`/san-pham/${product.slug}`} target="_blank" className="button button-ghost">
            <ExternalLink size={16} />
            <span>Xem trang sản phẩm</span>
          </Link>
        )}
      </header>

      <AdminProductForm
        product={product}
        categories={categories}
        demo={!isSupabaseConfigured()}
      />
    </>
  );
}

