import { CheckCircle2, Clock3, Edit3, Newspaper, Plus, Star } from "lucide-react";
import Link from "next/link";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";
import { deleteArticle } from "@/lib/admin-actions";
import { getAdminArticles } from "@/lib/admin-data";
import { publicAssetUrl } from "@/lib/supabase-rest";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; saved?: string }>;
}) {
  const [articles, query] = await Promise.all([getAdminArticles(), searchParams]);

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa bài viết thành công.</span>
        </div>
      )}

      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Bài viết đã được lưu và cập nhật lên website.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Tin tức & Cẩm nang</span>
          <h1>Quản lý bài viết ({articles.length})</h1>
          <p>Soạn thảo, quản lý bài viết hướng dẫn an toàn, bảo trì và tin tức kỹ thuật.</p>
        </div>
        <Link href="/admin/articles/new" className="button button-primary">
          <Plus size={18} />
          <span>Viết bài mới</span>
        </Link>
      </header>

      <section className="admin-panel">
        {articles.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tiêu đề bài viết</th>
                  <th>Chuyên mục</th>
                  <th>Thời lượng đọc</th>
                  <th>Trạng thái</th>
                  <th>Nổi bật</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div className="admin-item-cell">
                        {article.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={publicAssetUrl(article.image_url) || article.image_url}
                            alt={article.title}
                            style={{
                              width: 44,
                              height: 44,
                              objectFit: "cover",
                              borderRadius: 8,
                              flexShrink: 0,
                              background: "#f1f5f9",
                            }}
                          />
                        ) : (
                          <div
                            className="admin-item-icon"
                            style={{
                              background: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe",
                            }}
                          >
                            <Newspaper size={19} />
                          </div>
                        )}
                        <div className="admin-item-info">
                          <Link href={`/admin/articles/${article.id}`} title="Chỉnh sửa bài viết">
                            {article.title}
                          </Link>
                          <small>/{article.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "#f1f5f9",
                          color: "#334155",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          display: "inline-block",
                        }}
                      >
                        {article.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "13.5px", color: "#475569" }}>
                        <Clock3 size={14} color="#64748b" /> {article.read_time}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${article.status}`}>
                        {article.status === "published"
                          ? "Hiển thị"
                          : article.status === "draft"
                          ? "Bản nháp"
                          : "Lưu trữ"}
                      </span>
                    </td>
                    <td>
                      {article.is_featured ? (
                        <span style={{ color: "#d97706", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}>
                          <Star size={14} fill="#d97706" /> Nổi bật
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "13px" }}>—</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          aria-label={`Sửa ${article.title}`}
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <form action={deleteArticle} style={{ margin: 0 }}>
                          <input type="hidden" name="id" value={article.id} />
                          <DeleteArticleButton articleTitle={article.title} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Newspaper size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", margin: "0 0 16px" }}>Chưa có bài viết nào trong cơ sở dữ liệu.</p>
            <Link href="/admin/articles/new" className="button button-primary">
              <Plus size={16} /> Viết bài đầu tiên
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
