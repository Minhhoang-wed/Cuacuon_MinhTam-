"use client";

import { Clock3, Edit3, Flame, MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { saveServiceDistrict } from "@/lib/admin-actions";
import type { AdminServiceDistrictRow } from "@/lib/admin-data";

export function EditDistrictModal({ district }: { district: AdminServiceDistrictRow }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Chỉnh sửa quận huyện này"
        aria-label={`Sửa ${district.district_name}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#475569",
          cursor: "pointer",
          transition: "all .15s",
        }}
      >
        <Edit3 size={14} />
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
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
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
                <MapPin size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                  Chỉnh sửa điểm trực quận huyện
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

            <form action={saveServiceDistrict} style={{ padding: "20px" }}>
              <input type="hidden" name="id" value={district.id} />

              <div className="admin-fields" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <label>
                  <span>Tên Quận / Huyện *</span>
                  <input
                    name="district_name"
                    required
                    defaultValue={district.district_name}
                    placeholder="VD: Quận Gò Vấp, Bình Dương, Long An..."
                  />
                </label>

                <label>
                  <span>Địa chỉ điểm chốt / Cột mốc *</span>
                  <input
                    name="address_landmark"
                    required
                    defaultValue={district.address_landmark}
                    placeholder="VD: 248 Quang Trung, P.10, Gò Vấp"
                  />
                </label>

                <label>
                  <span>Thời gian cam kết có mặt *</span>
                  <input
                    name="response_time"
                    required
                    defaultValue={district.response_time}
                    placeholder="VD: Có mặt sau 15 – 20 phút"
                  />
                </label>

                <label>
                  <span>Ghi chú điểm chốt</span>
                  <input
                    name="note"
                    defaultValue={district.note || ""}
                    placeholder="VD: Trạm trực kỹ thuật lưu động"
                  />
                </label>

                <label className="check-field">
                  <input name="is_hotspot" type="checkbox" defaultChecked={district.is_hotspot} />
                  <span>Đánh dấu là khu vực trọng điểm</span>
                </label>

                <div className="admin-fields two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span>Thứ tự hiển thị</span>
                    <input name="sort_order" type="number" defaultValue={district.sort_order} />
                  </label>

                  <label className="check-field" style={{ marginTop: "24px" }}>
                    <input name="is_active" type="checkbox" defaultChecked={district.is_active} />
                    <span>Hiển thị trên website</span>
                  </label>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: "auto",
                    height: "40px",
                    minWidth: "100px",
                    padding: "0 20px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    width: "auto",
                    height: "40px",
                    minWidth: "135px",
                    padding: "0 22px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
                    transition: "all 0.2s ease",
                  }}
                >
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
