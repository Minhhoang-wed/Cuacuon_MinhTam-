import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { getAdminCategories, getAdminProduct } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase-rest";
export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) { const id = (await params).id; const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]); if (!product) notFound(); const saved = (await searchParams).saved; return <>{saved && <div className="admin-success">Đã lưu sản phẩm thành công.</div>}<header className="admin-page-header compact"><div><Link href="/admin/products" className="back-link"><ArrowLeft /> Sản phẩm</Link><h1>{product.name}</h1></div>{product.status === "published" && <Link href={`/san-pham/${product.slug}`} target="_blank" className="button button-ghost">Xem trang <ExternalLink /></Link>}</header><AdminProductForm product={product} categories={categories} demo={!isSupabaseConfigured()} /></>; }
