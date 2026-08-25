"use client";

import { Check, Image as ImageIcon, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SeoImageUploadProps {
  initialImageUrl?: string;
  siteName?: string;
  siteUrl?: string;
  description?: string;
}

export function SeoImageUpload({
  initialImageUrl = "/og.png",
  siteName = "Cửa Cuốn Minh Tâm",
  siteUrl = "suachuacuacuonnhanh24h.com",
  description = "Dịch vụ sửa chữa cửa cuốn 24/7 uy tín TP.HCM",
}: SeoImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh (JPG, PNG, WebP)!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Dung lượng ảnh tối đa là 5MB!");
        return;
      }
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      setHasNewFile(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh (JPG, PNG, WebP)!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Dung lượng ảnh tối đa là 5MB!");
        return;
      }
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
      }
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      setHasNewFile(true);
    }
  };

  const handleReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(initialImageUrl || "/og.png");
    setHasNewFile(false);
    setFileName("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Khung xem trước khi gửi link qua Zalo / Facebook ── */}
      <div className="seo-preview-card">
        <div className="seo-preview-label">
          <ImageIcon size={13} /> Xem trước khi gửi link qua Zalo / Facebook
        </div>
        <div className="seo-og-preview">
          <div className="seo-og-image" style={{ position: "relative", overflow: "hidden" }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Social Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                <ImageIcon size={32} style={{ opacity: 0.4, marginBottom: 6 }} />
                <span style={{ fontSize: 12 }}>Chưa có ảnh bìa</span>
              </div>
            )}
          </div>
          <div className="seo-og-copy">
            <span className="seo-og-site">
              {siteUrl?.replace(/https?:\/\//, "").replace(/\/$/, "") || "suachuacuacuonnhanh24h.com"}
            </span>
            <b>{siteName}</b>
            <p>{description}</p>
          </div>
        </div>
      </div>

      {/* ── Khu vực kéo thả & tải ảnh từ máy tính ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed #2563eb" : "2px dashed #cbd5e1",
          background: isDragging ? "#eff6ff" : "#f8fafc",
          borderRadius: "12px",
          padding: "24px 20px",
          textAlign: "center",
          transition: "all 0.2s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="og_image_file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Input ẩn để lưu URL cũ nếu không chọn file mới */}
        <input type="hidden" name="og_image_url" value={initialImageUrl} />

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: hasNewFile ? "#dcfce7" : "#e0f2fe",
            color: hasNewFile ? "#16a34a" : "#0284c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasNewFile ? <Check size={26} /> : <UploadCloud size={26} />}
        </div>

        <div>
          <p style={{ margin: "0 0 4px 0", fontSize: "14.5px", fontWeight: 700, color: "#0f172a" }}>
            {hasNewFile ? `Đã chọn: ${fileName}` : "Bấm để tải ảnh lên từ máy tính hoặc kéo thả vào đây"}
          </p>
          <span style={{ fontSize: "12.5px", color: "#64748b" }}>
            Hỗ trợ file JPG, PNG, WEBP (Dung lượng tối đa 5MB · Kích thước đẹp nhất: 1200×630px)
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            type="button"
            className="button button-primary button-small"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <UploadCloud size={15} />
            <span>{hasNewFile ? "Chọn ảnh khác" : "Chọn ảnh từ máy tính"}</span>
          </button>

          {hasNewFile && (
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              style={{ color: "#ef4444" }}
            >
              <Trash2 size={15} />
              <span>Hủy ảnh mới</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
