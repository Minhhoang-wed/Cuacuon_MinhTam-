"use client";

import { Edit3, MapPin, Phone, Save, Store, X } from "lucide-react";
import { useState } from "react";
import { saveStoreBranch } from "@/lib/admin-actions";
import type { AdminStoreBranchRow } from "@/lib/admin-data";

export function EditBranchModal({ branch }: { branch: AdminStoreBranchRow }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Chỉnh sửa chi nhánh này"
        aria-label={`Sửa chi nhánh ${branch.branch_name}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "31px",
          height: "31px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#475569",
          cursor: "pointer",
          transition: "all .15s",
        }}
      >
        <Edit3 size={15} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Store size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                  Chỉnh sửa chi nhánh cửa hàng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form action={saveStoreBranch} style={{ padding: "20px" }}>
              <input type="hidden" name="id" value={branch.id} />

              <div className="admin-fields" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <label>
                  <span>Tên chi nhánh *</span>
                  <input
                    name="branch_name"
                    required
                    defaultValue={branch.branch_name}
                    placeholder="VD: Cơ sở 3 (Chi nhánh Bình Thạnh)"
                  />
                </label>

                <label>
                  <span>Địa chỉ chi nhánh *</span>
                  <input
                    name="address"
                    required
                    defaultValue={branch.address}
                    placeholder="VD: 268 Bạch Đằng, P.24, Q. Bình Thạnh, TP.HCM"
                  />
                </label>

                <div className="admin-fields two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span>Số điện thoại Hotline *</span>
                    <input
                      name="hotline"
                      required
                      defaultValue={branch.hotline}
                      placeholder="0327.359.368"
                    />
                  </label>

                  <label>
                    <span>Nhãn nổi bật</span>
                    <input
                      name="badge"
                      defaultValue={branch.badge || ""}
                      placeholder="VD: Cửa hàng trực tiếp"
                    />
                  </label>
                </div>

                <label>
                  <span>Ghi chú loại hình</span>
                  <input
                    name="note"
                    defaultValue={branch.note || ""}
                    placeholder="VD: Cửa hàng trưng bày & Trung tâm kỹ thuật"
                  />
                </label>

                <div className="admin-fields two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span>Thứ tự hiển thị</span>
                    <input name="sort_order" type="number" defaultValue={branch.sort_order} />
                  </label>

                  <label className="check-field" style={{ marginTop: "24px" }}>
                    <input name="is_active" type="checkbox" defaultChecked={branch.is_active} />
                    <span>Hiển thị trên website</span>
                  </label>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="button button-ghost"
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="button button-primary">
                  <Save size={16} />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
