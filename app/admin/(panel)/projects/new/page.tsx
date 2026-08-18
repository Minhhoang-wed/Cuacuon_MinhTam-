import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminProjectForm } from "@/components/admin/admin-project-form";

export default async function AdminNewProjectPage() {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/projects" className="back-site" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#64748b", textDecoration: "none" }}>
          <ArrowLeft size={16} />
          <span>Quay lại danh sách dự án</span>
        </Link>
      </div>

      <header className="admin-page-header">
        <div>
          <span>Thêm mới</span>
          <h1>Tạo dự án công trình mới</h1>
          <p>Nhập thông tin công trình, giải pháp thi công và tải lên ảnh thực tế sau bàn giao.</p>
        </div>
      </header>

      <AdminProjectForm />
    </>
  );
}
