"use client";

import { Check, Crop, ImagePlus, Link2, Maximize2, RefreshCw, RotateCw, Sparkles, Trash2, Upload, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publicAssetUrl } from "@/lib/supabase-rest";

export interface ServiceImagePreset {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export const SERVICE_PRESET_IMAGES: ServiceImagePreset[] = [
  {
    id: "sua-cua-bi-ket",
    title: "Sửa cửa kẹt nan, xô nan",
    subtitle: "Xử lý đứt lá, lệch ray, kẹt cứng",
    url: "/services/sua-cua-bi-ket.png",
  },
  {
    id: "sua-motor",
    title: "Sửa & Thay Motor cửa cuốn",
    subtitle: "Motor xích kéo, motor ống chính hãng",
    url: "/services/sua-motor.png",
  },
  {
    id: "sua-remote",
    title: "Sửa Remote & Hộp nhận sóng",
    subtitle: "Đổi mã an toàn, làm thêm remote",
    url: "/services/sua-remote.png",
  },
  {
    id: "thay-nan",
    title: "Thay Nan lá & Lò xo trợ lực",
    subtitle: "Nắn phẳng nan móp gãy, thay lò xo",
    url: "/services/thay-nan.png",
  },
  {
    id: "sua-ray",
    title: "Nắn ray & Chỉnh hành trình",
    subtitle: "Gia cố ray cong vênh, chỉnh rơ-le ngắt",
    url: "/services/sua-ray.png",
  },
  {
    id: "binh-luu-dien",
    title: "Sửa & Thay bình lưu điện UPS",
    subtitle: "Thay ắc quy mới, sửa mạch sạc UPS",
    url: "/services/binh-luu-dien.png",
  },
];

interface ServiceImageManagerProps {
  initialImageUrl?: string | null;
  serviceName?: string;
}

export function ServiceImageManager({
  initialImageUrl = null,
  serviceName = "",
}: ServiceImageManagerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "presets" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialImageUrl || null);
  const [isCleared, setIsCleared] = useState(false);

  const [aspectRatio, setAspectRatio] = useState<"4/3" | "16/9" | "1/1">("4/3");
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [rotation, setRotation] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected file with native input for form submission
  useEffect(() => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    if (selectedFile) {
      dt.items.add(selectedFile);
    }
    fileInputRef.current.files = dt.files;
  }, [selectedFile]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Dung lượng ảnh không được vượt quá 10MB.");
      return;
    }

    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(objectUrl);
    setSelectedPresetUrl(null);
    setCustomUrl("");
    setIsCleared(false);
    setRotation(0);
  };

  const handleSelectPreset = (url: string) => {
    setSelectedPresetUrl(url);
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    setCustomUrl(url);
    setIsCleared(false);
  };

  const handleCustomUrlChange = (val: string) => {
    setCustomUrl(val);
    setSelectedPresetUrl(null);
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (val.trim()) {
      setIsCleared(false);
    }
  };

  const handleClearImage = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    setSelectedFile(null);
    setSelectedPresetUrl(null);
    setCustomUrl("");
    setCurrentUrl(null);
    setIsCleared(true);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Determine what image to display in live preview
  let activePreviewSrc: string | null = null;
  let previewBadge: string = "";

  if (selectedFile && filePreviewUrl) {
    activePreviewSrc = filePreviewUrl;
    previewBadge = `Tệp mới: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`;
  } else if (selectedPresetUrl) {
    activePreviewSrc = selectedPresetUrl;
    previewBadge = "Ảnh mẫu hệ thống";
  } else if (customUrl.trim()) {
    activePreviewSrc = customUrl.trim();
    previewBadge = "Đường dẫn tùy chỉnh";
  } else if (currentUrl && !isCleared) {
    activePreviewSrc = publicAssetUrl(currentUrl) || currentUrl;
    previewBadge = "Ảnh hiện tại của dịch vụ";
  }

  // Value for hidden input image_url
  const finalImageUrlValue = isCleared
    ? ""
    : (selectedFile ? "" : (selectedPresetUrl || customUrl.trim() || currentUrl || ""));

  return (
    <div className="service-image-manager">
      {/* Hidden inputs to submit with Server Action */}
      <input
        ref={fileInputRef}
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files)}
      />
      <input type="hidden" name="image_url" value={finalImageUrlValue} />
      <input type="hidden" name="clear_image" value={isCleared ? "true" : "false"} />

      {/* Tabs Navigation */}
      <div className="service-image-tabs">
        <button
          type="button"
          className={`service-image-tab ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          <Upload size={16} />
          <span>Tải ảnh từ máy tính</span>
        </button>
        <button
          type="button"
          className={`service-image-tab ${activeTab === "presets" ? "active" : ""}`}
          onClick={() => setActiveTab("presets")}
        >
          <Sparkles size={16} />
          <span>Kho ảnh mẫu kỹ thuật</span>
        </button>
        <button
          type="button"
          className={`service-image-tab ${activeTab === "url" ? "active" : ""}`}
          onClick={() => setActiveTab("url")}
        >
          <Link2 size={16} />
          <span>Nhập URL / Đường dẫn</span>
        </button>
      </div>

      {/* Tab 1: Upload from Computer */}
      {activeTab === "upload" && (
        <div className="service-tab-content">
          <div
            className="admin-dropzone service-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files);
            }}
          >
            <div className="admin-dropzone-icon">
              <ImagePlus size={30} />
            </div>
            <div className="admin-dropzone-text">
              <b>Kéo thả hoặc bấm để chọn ảnh minh họa dịch vụ</b>
              <p>Hỗ trợ định dạng JPG, PNG, WebP — Kích thước đề xuất 800x600px (Tối đa 10MB)</p>
              <span className="admin-dropzone-btn">
                <Upload size={14} /> Duyệt ảnh từ máy tính
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Preset Gallery */}
      {activeTab === "presets" && (
        <div className="service-tab-content">
          <p className="service-preset-guide">
            Chọn 1 ảnh minh họa tiêu chuẩn phù hợp với loại hình sửa chữa bên dưới:
          </p>
          <div className="service-presets-grid">
            {SERVICE_PRESET_IMAGES.map((preset) => {
              const isSelected = (selectedPresetUrl === preset.url) || (!selectedFile && !customUrl && !isCleared && currentUrl === preset.url);
              return (
                <div
                  key={preset.id}
                  className={`service-preset-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectPreset(preset.url)}
                >
                  <div className="service-preset-thumb">
                    <img src={preset.url} alt={preset.title} />
                    {isSelected && (
                      <div className="service-preset-check">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <div className="service-preset-info">
                    <strong>{preset.title}</strong>
                    <small>{preset.subtitle}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Custom URL */}
      {activeTab === "url" && (
        <div className="service-tab-content">
          <label style={{ display: "block", marginBottom: "8px" }}>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
              Đường dẫn hình ảnh trực tiếp (URL hoặc đường dẫn sẵn có)
            </span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
              placeholder="VD: /services/sua-cua-bi-ket.png hoặc https://example.com/anh-sua-cua.jpg"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
              }}
            />
          </label>
          <small style={{ color: "#64748b" }}>
            Ảnh sẽ được tự động hiển thị xem trước ngay khi bạn dán liên kết hợp lệ.
          </small>
        </div>
      )}

      {/* Live Preview & Toolbars */}
      {activePreviewSrc ? (
        <div className="service-preview-section">
          <div className="service-preview-header">
            <div className="service-preview-badge-wrap">
              <span className="service-preview-badge">{previewBadge}</span>
              {serviceName && <span className="service-preview-target">{serviceName}</span>}
            </div>
            <div className="service-preview-actions">
              <button
                type="button"
                className="service-action-btn rotate"
                title="Xoay ảnh 90°"
                onClick={handleRotate}
              >
                <RotateCw size={14} />
                <span>Xoay</span>
              </button>
              <button
                type="button"
                className="service-action-btn delete"
                title="Xóa / Hủy ảnh này"
                onClick={handleClearImage}
              >
                <Trash2 size={14} />
                <span>Xóa ảnh</span>
              </button>
            </div>
          </div>

          {/* View Toolbar Controls */}
          <div className="admin-upload-toolbar service-view-toolbar">
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
                  4:3 (Chuẩn thẻ)
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
                <Maximize2 size={14} /> Chế độ hiển thị:
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

          {/* Preview Container */}
          <div
            className="service-preview-frame"
            style={{ aspectRatio }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePreviewSrc}
              alt="Xem trước ảnh dịch vụ"
              style={{
                objectFit: fitMode,
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.25s ease",
              }}
              onError={(e) => {
                // If custom URL fails to load
                (e.target as HTMLImageElement).src = "/services/sua-cua-bi-ket.png";
              }}
            />
          </div>
        </div>
      ) : (
        <div className="service-empty-image-note">
          <Wrench size={24} color="#94a3b8" />
          <span>Dịch vụ này hiện chưa có ảnh minh họa. Vui lòng chọn ảnh từ máy tính hoặc kho ảnh mẫu ở trên.</span>
        </div>
      )}
    </div>
  );
}
