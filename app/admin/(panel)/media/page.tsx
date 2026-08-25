import { CheckCircle2, Image as ImageIcon, ImagePlus, Trash2 } from "lucide-react";
import { deleteMedia } from "@/lib/admin-actions";
import { getAdminMedia } from "@/lib/admin-data";
import { isSupabaseConfigured, publicAssetUrl } from "@/lib/supabase-rest";
import { MediaUploadForm } from "@/components/admin/media-upload-form";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ uploaded?: string }>;
}) {
  const media = await getAdminMedia();
  const demo = !isSupabaseConfigured();
  const uploaded = (await searchParams).uploaded;

  return (
    <>
      {uploaded && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã tải hình ảnh mới lên thư viện lưu trữ thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Lưu trữ Đám mây (Storage)</span>
          <h1>Thư viện hình ảnh ({media.length})</h1>
          <p>Quản lý toàn bộ kho hình ảnh sản phẩm, ảnh chụp công trình và banner giao diện.</p>
        </div>
      </header>

      {/* Vùng Tải ảnh */}
      <section className="admin-form-card media-upload-card">
        <div>
          <ImagePlus size={32} />
          <h2>Tải ảnh lên kho</h2>
          <p>Hỗ trợ định dạng JPG, PNG, WebP · Dung lượng tối đa 10MB/ảnh · Có thể chọn tối đa 10 ảnh cùng lúc.</p>
        </div>

        <MediaUploadForm demo={demo} />
      </section>

      {/* Lưới hình ảnh */}
      {media.length ? (
        <section className="media-admin-grid">
          {media.map((item) => (
            <article key={item.id}>
              <img
                src={publicAssetUrl(item.storage_path) || ""}
                alt={item.alt_text || item.file_name}
                loading="lazy"
              />
              <div>
                <b title={item.file_name}>{item.file_name}</b>
                <small>
                  {Math.round(item.size_bytes / 1024)} KB · {item.mime_type || "image/jpeg"}
                </small>
                <code title={item.storage_path}>{item.storage_path}</code>

                <form action={deleteMedia} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="path" value={item.storage_path} />
                  <button
                    type="submit"
                    title="Xóa ảnh vĩnh viễn khỏi thư viện"
                  >
                    <Trash2 size={14} />
                    <span>Xóa khỏi kho</span>
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state admin-empty">
          <ImageIcon size={44} />
          <h2>Chưa có hình ảnh trong thư viện</h2>
          <p>Hình ảnh tải lên tại form sản phẩm hoặc khu vực này sẽ được hiển thị và quản lý tập trung tại đây.</p>
        </div>
      )}
    </>
  );
}

