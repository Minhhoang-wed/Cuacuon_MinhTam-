import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminServiceForm } from "@/components/admin/admin-service-form";
import { getAdminService } from "@/lib/admin-data";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const [service, query] = await Promise.all([getAdminService(id), searchParams]);

  if (!service) notFound();

  return (
    <>
      {query.saved && (
        <div className="admin-success">
          <CheckCircle2 size={18} />
          <span>Dịch vụ đã được cập nhật thành công.</span>
        </div>
      )}

      <header className="admin-page-header">
        <div>
          <Link href="/admin/services" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách dịch vụ</span>
          </Link>
          <h1>Chỉnh sửa: {service.name}</h1>
          <p>Cập nhật bảng giá, bảo hành, các dấu hiệu nhận biết và quy trình xử lý thực tế.</p>
        </div>
      </header>

      <AdminServiceForm service={service} />
    </>
  );
}
