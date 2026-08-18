"use client";

import { Check, Crop, ImagePlus, Maximize2, RefreshCw, RotateCw, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publicAssetUrl } from "@/lib/supabase-rest";

type ExistingImage = {
  id: string;
  storage_path: string;
  alt_text?: string | null;
};

interface ImageUploadWithPreviewProps {
  name?: string;
  maxFiles?: number;
  existingImages?: ExistingImage[];
  onDeleteExisting?: (imageId: string, storagePath: string) => void;
  deleteAction?: (formData: FormData) => void;
  label?: string;
  helperText?: string;
}

type PreviewItem = {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number;
};

export function ImageUploadWithPreview({
  name = "images",
  maxFiles = 6,
  existingImages = [],
  label = "Ảnh chụp công trình / sản phẩm thực tế",
  helperText = "Bấm hoặc kéo thả ảnh vào đây (Hỗ trợ JPG, PNG, WEBP — Tối đa 6 ảnh)",
}: ImageUploadWithPreviewProps) {
  const [selectedFiles, setSelectedFiles] = useState<PreviewItem[]>([]);
  const [aspectRatio, setAspectRatio] = useState<"4/3" | "16/9" | "1/1">("4/3");
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected files to native input for form submission
  useEffect(() => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    selectedFiles.forEach((item) => dt.items.add(item.file));
    fileInputRef.current.files = dt.files;
  }, [selectedFiles]);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const availableSlots = maxFiles - selectedFiles.length;
    if (availableSlots <= 0) {
      alert(`Đã đạt giới hạn tối đa ${maxFiles} ảnh.`);
      return;
    }

    const newItems: PreviewItem[] = [];
    const filesArray = Array.from(files).slice(0, availableSlots);

    for (const file of filesArray) {
      if (!file.type.startsWith("image/")) continue;
      newItems.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        rotation: 0,
      });
    }

    setSelectedFiles((prev) => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleRotate = (id: string) => {
    setSelectedFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  return (
    <div className="admin-upload-widget">
      {/* Thanh công cụ tùy chỉnh khung ảnh */}
      <div className="admin-upload-toolbar">
        <div className="admin-toolbar-group">
          <span className="admin-toolbar-label">
            <Crop size={14} /> Khung hình:
          </span>
          <div className="admin-ratio-buttons">
            <button
              type="button"
              className={aspectRatio === "4/3" ? "active" : ""}
              onClick={() => setAspectRatio("4/3")}
            >
              4:3 (Chuẩn)
            </button>
            <button
              type="button"
              className={aspectRatio === "16/9" ? "active" : ""}
              onClick={() => setAspectRatio("16/9")}
            >
              16:9 (Rộng)
            </button>
            <button
              type="button"
              className={aspectRatio === "1/1" ? "active" : ""}
              onClick={() => setAspectRatio("1/1")}
            >
              1:1 (Vuông)
            </button>
          </div>
        </div>

        <div className="admin-toolbar-group">
          <span className="admin-toolbar-label">
            <Maximize2 size={14} /> Chế độ:
          </span>
          <div className="admin-ratio-buttons">
            <button
              type="button"
              className={fitMode === "cover" ? "active" : ""}
              onClick={() => setFitMode("cover")}
            >
              Lấp đầy (Cover)
            </button>
            <button
              type="button"
              className={fitMode === "contain" ? "active" : ""}
              onClick={() => setFitMode("contain")}
            >
              Vừa vặn (Contain)
            </button>
          </div>
        </div>
      </div>

      {/* Grid danh sách ảnh xem trước & ảnh có sẵn */}
      {(existingImages.length > 0 || selectedFiles.length > 0) && (
        <div className="admin-preview-grid">
          {/* 1. Ảnh đã lưu trong Database */}
          {existingImages.map((image) => (
            <div
              className="admin-preview-card existing"
              key={image.id}
              style={{ aspectRatio }}
            >
              <img
                src={publicAssetUrl(image.storage_path) || ""}
                alt={image.alt_text || "Ảnh công trình"}
                style={{ objectFit: fitMode }}
              />
              <div className="admin-preview-badge">Đã lưu</div>
            </div>
          ))}

          {/* 2. Ảnh mới chọn chuẩn bị upload */}
          {selectedFiles.map((item, index) => (
            <div
              className="admin-preview-card new-upload"
              key={item.id}
              style={{ aspectRatio }}
            >
              <img
                src={item.previewUrl}
                alt={item.file.name}
                style={{
                  objectFit: fitMode,
                  transform: `rotate(${item.rotation}deg)`,
                  transition: "transform 0.2s ease",
                }}
              />
              <div className="admin-preview-overlay">
                <span className="admin-file-size">
                  {(item.file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
                <div className="admin-preview-actions">
                  <button
                    type="button"
                    title="Xoay 90°"
                    onClick={() => handleRotate(item.id)}
                    className="admin-rotate-btn"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button
                    type="button"
                    title="Xóa ảnh này"
                    onClick={() => handleRemoveItem(item.id)}
                    className="admin-remove-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="admin-preview-index">Ảnh mới #{index + 1}</div>
            </div>
          ))}
        </div>
      )}

      {/* Vùng Dropzone bấm chọn ảnh */}
      <div
        className="admin-dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesSelected(e.dataTransfer.files);
        }}
      >
        <div className="admin-dropzone-icon">
          <ImagePlus size={28} />
        </div>
        <div className="admin-dropzone-text">
          <b>{label}</b>
          <p>{helperText}</p>
          <span className="admin-dropzone-btn">
            <Upload size={14} /> Chọn ảnh từ máy tính
          </span>
        </div>
      </div>

      {/* Input ẩn đồng bộ với form server action */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
    </div>
  );
}
