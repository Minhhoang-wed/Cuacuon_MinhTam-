import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminProjectForm } from "@/components/admin/admin-project-form";
import { getAdminProject } from "@/lib/admin-data";

export default async function AdminEditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const project = await getAdminProject(id);

  if (!project) notFound();

  return (
    <>
      {saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Dự án đã được lưu và cập nhật thành công lên website.</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Link href="/admin/projects" className="back-site" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#64748b", textDecoration: "none" }}>
          <ArrowLeft size={16} />
          <span>Quay lại danh sách dự án</span>
        </Link>
        <Link href={`/du-an/${project.slug}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--accent-color)", textDecoration: "none", fontWeight: 600 }}>
          <span>Xem trên website</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <header className="admin-page-header">
        <div>
          <span>Chỉnh sửa công trình</span>
          <h1>{project.name}</h1>
          <p>Cập nhật nội dung, kết quả bàn giao và hình ảnh thực tế cho công trình.</p>
        </div>
      </header>

      <AdminProjectForm project={project} />
    </>
  );
}
