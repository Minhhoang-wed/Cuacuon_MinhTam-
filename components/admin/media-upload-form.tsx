"use client";

import { CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { uploadMedia } from "@/lib/admin-actions";

export function MediaUploadForm({ demo = false }: { demo?: boolean }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [altText, setAltText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate object URLs for preview
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  // Sync selected files to hidden input for form submission
  useEffect(() => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    selectedFiles.forEach((file) => dt.items.add(file));
    fileInputRef.current.files = dt.files;
  }, [selectedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prev) => [...prev, ...droppedFiles].slice(0, 10));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      action={uploadMedia}
      onSubmit={() => setIsSubmitting(true)}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>
          Văn bản mô tả ảnh (Alt text SEO)
        </span>
        <input
          name="alt_text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="VD: Lắp đặt cửa cuốn khe thoáng tại Bình Thạnh"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1.5px solid #cbd5e1",
            fontSize: "14px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        name="images"
        accept="image/jpeg,image/png,image/webp"
        multiple
        required={selectedFiles.length === 0}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Drag & Drop Clickable Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed #2563eb" : "2px dashed #cbd5e1",
          borderRadius: "12px",
          padding: "24px 16px",
          textAlign: "center",
          background: isDragging ? "#eff6ff" : "#f8fafc",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: isDragging ? "#dbeafe" : "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563eb",
          }}
        >
          <Upload size={24} />
        </div>

        <div>
          <b style={{ fontSize: "14.5px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
            Bấm để chọn ảnh từ máy tính hoặc kéo thả vào đây
          </b>
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            Hỗ trợ định dạng JPG, PNG, WebP · Tối đa 10MB mỗi ảnh
          </span>
        </div>
      </div>

      {/* Preview selected images */}
      {selectedFiles.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#059669", display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={15} /> Đã chọn {selectedFiles.length} ảnh
            </span>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                fontSize: "12.5px",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Xóa tất cả
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
              gap: "8px",
            }}
          >
            {previews.map((url, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #cbd5e1",
                  background: "#e2e8f0",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  aria-label="Xóa ảnh"
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.65)",
                    color: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="button button-primary"
        disabled={demo || selectedFiles.length === 0 || isSubmitting}
        style={{
          width: "100%",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: 700,
          cursor: selectedFiles.length === 0 ? "not-allowed" : "pointer",
          opacity: selectedFiles.length === 0 ? 0.6 : 1,
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="spin" />
            <span>Đang tải ảnh lên...</span>
          </>
        ) : (
          <>
            <Upload size={18} />
            <span>Tải và lưu {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}ảnh lên kho</span>
          </>
        )}
      </button>
    </form>
  );
}
