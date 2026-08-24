"use client";

import { Edit3, Layers, Save, Tag, X } from "lucide-react";
import { useState } from "react";
import { saveServicePriceItem } from "@/lib/admin-actions";
import type { AdminServicePriceItemRow } from "@/lib/admin-data";

const priceCategoryOptions = [
  "1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn",
  "2. Bảng giá sửa chữa & thay mới Motor",
  "3. Bảng giá Remote & Hộp nhận tín hiệu",
  "4. Bảng giá sửa chữa Bộ lưu điện (UPS)",
];

export function EditPriceItemModal({ item }: { item: AdminServicePriceItemRow }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Chỉnh sửa dòng báo giá này"
        aria-label={`Sửa ${item.item_name}`}
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
                <Tag size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                  Chỉnh sửa hạng mục báo giá
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

            <form action={saveServicePriceItem} style={{ padding: "20px" }}>
              <input type="hidden" name="id" value={item.id} />

              <div className="admin-fields" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <label>
                  <span>Nhóm bảng giá *</span>
                  <select name="category_name" required defaultValue={item.category_name}>
                    {priceCategoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Tên hạng mục sửa chữa / Dịch vụ *</span>
                  <input
                    name="item_name"
                    required
                    defaultValue={item.item_name}
                    placeholder="VD: Sửa motor bị kẹt cơ, hỏng tụ"
                  />
                </label>

                <div className="admin-fields two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span>Mức giá tham khảo *</span>
                    <input
                      name="price"
                      required
                      defaultValue={item.price}
                      placeholder="VD: 350.000 – 800.000 VNĐ"
                    />
                  </label>

                  <label>
                    <span>Thời gian bảo hành</span>
                    <input
                      name="warranty"
                      defaultValue={item.warranty}
                      placeholder="VD: 3 – 6 tháng"
                    />
                  </label>
                </div>

                <div className="admin-fields two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span>Thứ tự hiển thị</span>
                    <input name="sort_order" type="number" defaultValue={item.sort_order} />
                  </label>

                  <label className="check-field" style={{ marginTop: "24px" }}>
                    <input name="is_active" type="checkbox" defaultChecked={item.is_active} />
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
