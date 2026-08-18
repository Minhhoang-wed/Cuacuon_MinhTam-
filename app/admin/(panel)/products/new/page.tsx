import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { getAdminCategories } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <header className="admin-page-header compact">
        <div>
          <Link href="/admin/products" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách sản phẩm</span>
          </Link>
          <h1>Thêm sản phẩm mới</h1>
        </div>
      </header>

      <AdminProductForm
        categories={categories}
        demo={!isSupabaseConfigured()}
      />
    </>
  );
}

