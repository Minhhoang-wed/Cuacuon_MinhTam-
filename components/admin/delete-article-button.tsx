"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function DeleteArticleButton({ articleTitle }: { articleTitle: string }) {
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
        title={`Xóa bài viết ${articleTitle}`}
        aria-label={`Xóa bài viết ${articleTitle}`}
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
            aria-labelledby="delete-article-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <AlertTriangle size={24} />
            <h2 id="delete-article-title">Xóa bài viết?</h2>
            <p>
              Bài viết <b>{articleTitle}</b> sẽ bị xóa khỏi danh sách tin tức.
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
