import { Building2, CheckCircle2, Edit3, MapPin, Plus, Star } from "lucide-react";
import Link from "next/link";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { deleteProject } from "@/lib/admin-actions";
import { getAdminProjects } from "@/lib/admin-data";
import { publicAssetUrl } from "@/lib/supabase-rest";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; saved?: string }>;
}) {
  const [projects, query] = await Promise.all([getAdminProjects(), searchParams]);

  return (
    <>
      {query.deleted && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Đã xóa vĩnh viễn dự án và toàn bộ hình ảnh liên quan.</span>
        </div>
      )}

      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Thông tin dự án đã được cập nhật thành công lên website.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <span>Công trình thực tế</span>
          <h1>Dự án đã hoàn thành ({projects.length})</h1>
          <p>Quản lý các công trình, hình ảnh bàn giao thực tế và feedback khách hàng.</p>
        </div>
        <Link href="/admin/projects/new" className="button button-primary">
          <Plus size={18} />
          <span>Thêm dự án mới</span>
        </Link>
      </header>

      <section className="admin-panel">
        {projects.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên công trình</th>
                  <th>Loại hình</th>
                  <th>Địa điểm</th>
                  <th>Trạng thái</th>
                  <th>Nổi bật</th>
                  <th style={{ textAlign: "right" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {project.images?.[0] ? (
                          <img
                            src={publicAssetUrl(project.images[0].storage_path) || ""}
                            alt={project.name}
                            style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#f1f5f9" }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexShrink: 0 }}>
                            <Building2 size={20} />
                          </div>
                        )}
                        <div>
                          <Link href={`/admin/projects/${project.id}`} style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                            {project.name}
                          </Link>
                          <small style={{ display: "block", color: "#64748b" }}>/{project.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{project.category}</span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#475569", fontSize: 13.5 }}>
                        <MapPin size={14} color="#64748b" /> {project.location}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${project.status}`}>
                        {project.status === "published"
                          ? "Hiển thị"
                          : project.status === "draft"
                          ? "Bản nháp"
                          : "Lưu trữ"}
                      </span>
                    </td>
                    <td>
                      {project.is_featured ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#d97706", fontSize: 13, fontWeight: 600 }}>
                          <Star size={14} fill="#d97706" /> Nổi bật
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/projects/${project.id}`} aria-label={`Sửa ${project.name}`} title="Chỉnh sửa dự án">
                          <Edit3 size={16} />
                        </Link>
                        <form action={deleteProject} style={{ margin: 0 }}>
                          <input type="hidden" name="id" value={project.id} />
                          <DeleteProjectButton projectName={project.name} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state admin-empty">
            <Building2 size={44} />
            <h2>Chưa có dự án nào được tạo</h2>
            <p>Hãy thêm dự án đầu tiên để hiển thị hồ sơ năng lực và hình ảnh thực tế trên website.</p>
            <Link href="/admin/projects/new" className="button button-primary" style={{ marginTop: 16 }}>
              <Plus size={18} />
              <span>Thêm dự án đầu tiên</span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
