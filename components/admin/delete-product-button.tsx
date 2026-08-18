"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export function DeleteProductButton({ productName, disabled = false }: { productName: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="delete-product-button"
        disabled={disabled}
        title={disabled ? "Chức năng bị khóa ở chế độ xem trước" : `Xóa vĩnh viễn ${productName}`}
        aria-label={`Xóa vĩnh viễn ${productName}`}
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
            aria-labelledby="delete-product-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <AlertTriangle size={24} />
            <h2 id="delete-product-title">Xóa vĩnh viễn sản phẩm?</h2>
            <p>
              Sản phẩm <b>{productName}</b>, toàn bộ thông số kỹ thuật và hình ảnh trong kho sẽ bị xóa vĩnh viễn và không thể khôi phục.
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

