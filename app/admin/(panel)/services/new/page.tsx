import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminServiceForm } from "@/components/admin/admin-service-form";

export default function NewServicePage() {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <Link href="/admin/services" className="back-link">
            <ArrowLeft size={16} />
            <span>Quay lại danh sách dịch vụ</span>
          </Link>
          <h1>Thêm gói dịch vụ kỹ thuật mới</h1>
          <p>Nhập thông tin dịch vụ, bảng giá tham khảo, dấu hiệu hư hỏng và quy trình xử lý.</p>
        </div>
      </header>

      <AdminServiceForm />
    </>
  );
}
