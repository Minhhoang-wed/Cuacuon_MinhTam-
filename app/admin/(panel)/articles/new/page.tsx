import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminArticleForm } from "@/components/admin/admin-article-form";

export default function NewArticlePage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <Link href="/admin/articles" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách bài viết</span>
          </Link>
          <h1>Viết bài tin tức & cẩm nang mới</h1>
          <p>Nhập tiêu đề, chuyên mục, nội dung bài viết và tải ảnh bìa minh họa.</p>
        </div>
      </header>

      <AdminArticleForm />
    </>
  );
}
