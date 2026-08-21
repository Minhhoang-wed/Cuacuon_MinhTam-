import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminArticleForm } from "@/components/admin/admin-article-form";
import { getAdminArticle } from "@/lib/admin-data";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const [article, query] = await Promise.all([getAdminArticle(id), searchParams]);

  if (!article) notFound();

  return (
    <>
      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Bài viết đã được cập nhật thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <Link href="/admin/articles" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách bài viết</span>
          </Link>
          <h1>Chỉnh sửa: {article.title}</h1>
          <p>Cập nhật nội dung, thay ảnh bìa hoặc thay đổi trạng thái xuất bản.</p>
        </div>
      </header>

      <AdminArticleForm article={article} />
    </>
  );
}
