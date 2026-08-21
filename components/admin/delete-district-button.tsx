"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function DeleteDistrictButton({ districtName }: { districtName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="delete-product-button"
        title={`Xóa điểm phục vụ ${districtName}`}
        aria-label={`Xóa điểm phục vụ ${districtName}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} />
      </button>
      {open && (
        <div className="admin-confirm-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            className="admin-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-district-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <AlertTriangle size={24} />
            <h2 id="delete-district-title">Xóa khu vực phục vụ?</h2>
            <p>
              Khu vực <b>{districtName}</b> sẽ bị xóa khỏi danh sách phục vụ.
            </p>
            <div className="admin-confirm-actions">
              <button type="button" onClick={() => setOpen(false)}>
                Hủy bỏ
              </button>
              <button type="submit" className="confirm-delete">
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
