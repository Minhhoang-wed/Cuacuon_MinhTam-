"use client";

import { Check, Crop, ImagePlus, Link2, Maximize2, Newspaper, RefreshCw, RotateCw, Sparkles, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publicAssetUrl } from "@/lib/supabase-rest";

export interface ArticleImagePreset {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const ARTICLE_PRESET_IMAGES: ArticleImagePreset[] = [
  {
    id: "bao-tri-dinh-ky",
    title: "Bảo trì cửa cuốn định kỳ đúng cách",
    category: "Kinh nghiệm bảo trì",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&q=80",
  },
  {
    id: "xu-ly-ket-nan",
    title: "Hướng dẫn xử lý cửa kẹt nan an toàn",
    category: "Cẩm nang sử dụng",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80",
  },
  {
    id: "chon-motor",
    title: "Kinh nghiệm chọn motor cửa cuốn chính hãng",
    category: "Tư vấn chọn mua",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&q=80",
  },
  {
    id: "bo-luu-dien-ups",
    title: "Cách dùng bộ lưu điện UPS bền lâu",
    category: "Tin tức kỹ thuật",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=80",
  },
  {
    id: "an-toan-gia-dinh",
    title: "Tính năng tự dừng & an toàn trẻ nhỏ",
    category: "Cẩm nang sử dụng",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80",
  },
  {
    id: "khoa-ma-remote",
    title: "Bảo mật mã sóng Remote cửa cuốn",
    category: "Tin tức kỹ thuật",
    url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1000&q=80",
  },
];

interface ArticleImageManagerProps {
  initialImageUrl?: string | null;
  articleTitle?: string;
}

export function ArticleImageManager({
  initialImageUrl = null,
  articleTitle = "",
}: ArticleImageManagerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "presets" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialImageUrl || null);
  const [isCleared, setIsCleared] = useState(false);

  const [aspectRatio, setAspectRatio] = useState<"16/9" | "4/3" | "1/1">("16/9");
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
      alert("Dung lượng ảnh tối đa là 10MB.");
      return;
    }

    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(preview);
    setSelectedPresetUrl(null);
    setCustomUrl("");
    setIsCleared(false);
  };

  const handleSelectPreset = (url: string) => {
    setSelectedPresetUrl(url);
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setCustomUrl("");
    setIsCleared(false);
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomUrl(url);
    if (url.trim()) {
      setSelectedPresetUrl(null);
      setSelectedFile(null);
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
      setIsCleared(false);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setSelectedPresetUrl(null);
    setCustomUrl("");
    setCurrentUrl(null);
    setIsCleared(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Determine which image to show in the preview area
  let activeDisplayUrl: string | null = null;
  if (!isCleared) {
    if (filePreviewUrl) {
      activeDisplayUrl = filePreviewUrl;
    } else if (selectedPresetUrl) {
      activeDisplayUrl = selectedPresetUrl;
    } else if (customUrl.trim()) {
      activeDisplayUrl = customUrl.trim();
    } else if (currentUrl) {
      activeDisplayUrl = publicAssetUrl(currentUrl) || currentUrl;
    }
  }

  // Value to be sent in hidden input `image_url`
  const finalImageUrlValue = isCleared
    ? ""
    : customUrl.trim() || selectedPresetUrl || (selectedFile ? "" : currentUrl || "");

  return (
    <div className="service-image-manager">
      {/* Hidden inputs to pass data via standard Form Submission */}
      <input
        type="file"
        name="image"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
      />
      <input type="hidden" name="image_url" value={finalImageUrlValue} />
      <input type="hidden" name="clear_image" value={isCleared ? "true" : "false"} />

      <div
        className="sim-layout"
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side: Compact Preview Frame & Actions */}
        <div
          className="sim-preview-pane"
          style={{
            width: "320px",
            maxWidth: "100%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 2px",
            }}
          >
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Xem trước ảnh bìa
            </span>
            {activeDisplayUrl && (
              <button
                type="button"
                onClick={handleClearImage}
                title="Gỡ bỏ ảnh bìa này"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  border: "none",
                  background: "transparent",
                  color: "#dc2626",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                <Trash2 size={13} />
                <span>Gỡ ảnh</span>
              </button>
            )}
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "185px",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#0f172a",
              border: "1px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {activeDisplayUrl ? (
              <img
                src={activeDisplayUrl}
                alt={articleTitle || "Ảnh bài viết"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: fitMode,
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 0.25s ease, object-fit 0.2s ease",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: "#94a3b8",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <Newspaper size={30} color="#64748b" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8" }}>
                  Chưa chọn ảnh bìa
                </span>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b", maxWidth: "200px" }}>
                  Tải ảnh từ máy hoặc chọn ảnh mẫu bên cạnh
                </p>
              </div>
            )}

            {/* Badge overlay on thumbnail */}
            {activeDisplayUrl && (
              <div
                style={{
                  position: "absolute",
                  bottom: "6px",
                  left: "6px",
                  right: "6px",
                  background: "rgba(15, 23, 42, 0.8)",
                  backdropFilter: "blur(4px)",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  color: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <Sparkles size={11} color="#38bdf8" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selectedFile
                    ? selectedFile.name
                    : selectedPresetUrl
                    ? "Ảnh mẫu Preset"
                    : customUrl
                    ? "Ảnh qua URL"
                    : "Ảnh hiện tại"}
                </span>
              </div>
            )}
          </div>

          {/* Quick Adjustment Tools: Underneath Thumbnail */}
          {activeDisplayUrl && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "6px",
                padding: "6px 8px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => setFitMode(fitMode === "cover" ? "contain" : "cover")}
                title={fitMode === "cover" ? "Chuyển sang hiển thị vừa vặn (Contain)" : "Chuyển sang tràn khung (Cover)"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  color: "#334155",
                  cursor: "pointer",
                }}
              >
                <Crop size={12} />
                <span>{fitMode === "cover" ? "Tràn khung" : "Vừa vặn"}</span>
              </button>

              <button
                type="button"
                onClick={handleRotate}
                title="Xoay 90°"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 8px",
                  borderRadius: "5px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  color: "#334155",
                  cursor: "pointer",
                }}
              >
                <RotateCw size={12} />
                <span>{rotation}°</span>
              </button>

              <div style={{ display: "flex", gap: "3px" }}>
                {(["16/9", "4/3", "1/1"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    style={{
                      padding: "3px 6px",
                      fontSize: "11px",
                      fontWeight: aspectRatio === ratio ? 700 : 500,
                      borderRadius: "4px",
                      border: "1px solid",
                      borderColor: aspectRatio === ratio ? "#2563eb" : "#cbd5e1",
                      background: aspectRatio === ratio ? "#eff6ff" : "#ffffff",
                      color: aspectRatio === ratio ? "#1d4ed8" : "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Options Pane (Takes remaining width) */}
        <div
          className="sim-options-pane"
          style={{
            flex: 1,
            minWidth: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "10px 12px",
          }}
        >
          {/* Navigation Tabs */}
          <div
            className="sim-tabs"
            style={{
              display: "flex",
              gap: "6px",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className={`sim-tab ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: activeTab === "upload" ? "#cbd5e1" : "transparent",
                background: activeTab === "upload" ? "#ffffff" : "transparent",
                color: activeTab === "upload" ? "#0f5fd7" : "#64748b",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: activeTab === "upload" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              Tải ảnh từ máy
            </button>

            <button
              type="button"
              className={`sim-tab ${activeTab === "presets" ? "active" : ""}`}
              onClick={() => setActiveTab("presets")}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: activeTab === "presets" ? "#cbd5e1" : "transparent",
                background: activeTab === "presets" ? "#ffffff" : "transparent",
                color: activeTab === "presets" ? "#0f5fd7" : "#64748b",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: activeTab === "presets" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              Ảnh mẫu có sẵn ({ARTICLE_PRESET_IMAGES.length})
            </button>

            <button
              type="button"
              className={`sim-tab ${activeTab === "url" ? "active" : ""}`}
              onClick={() => setActiveTab("url")}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: activeTab === "url" ? "#cbd5e1" : "transparent",
                background: activeTab === "url" ? "#ffffff" : "transparent",
                color: activeTab === "url" ? "#0f5fd7" : "#64748b",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: activeTab === "url" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              Đường dẫn URL / Media
            </button>
          </div>

          {/* Tab 1: Upload Dropzone (Compact & horizontal) */}
          {activeTab === "upload" && (
            <div className="sim-tab-content">
              <div
                className="sim-dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(e.dataTransfer.files);
                }}
                style={{
                  border: "1.5px dashed #cbd5e1",
                  borderRadius: "8px",
                  padding: "18px 20px",
                  background: "#f8fafc",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "all 0.15s ease",
                  minHeight: "115px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "#e0f2fe",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ImagePlus size={22} />
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <b style={{ fontSize: "13.5px", color: "#0f172a", display: "block", marginBottom: "3px" }}>
                    Bấm để chọn tệp hoặc kéo thả ảnh vào đây
                  </b>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Hỗ trợ định dạng JPG, PNG, WebP (Dung lượng tối đa 10MB)
                  </span>
                </div>
              </div>

              {selectedFile && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#15803d",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 600,
                  }}
                >
                  <Check size={14} />
                  <span>Đã chọn tệp: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Presets (Compact grid) */}
          {activeTab === "presets" && (
            <div className="sim-tab-content">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))",
                  gap: "8px",
                  maxHeight: "140px",
                  overflowY: "auto",
                  paddingRight: "2px",
                }}
              >
                {ARTICLE_PRESET_IMAGES.map((preset) => {
                  const isSelected = selectedPresetUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.url)}
                      style={{
                        position: "relative",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        cursor: "pointer",
                        background: "#f1f5f9",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ width: "100%", height: "46px", position: "relative" }}>
                        <img
                          src={preset.url}
                          alt={preset.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              background: "#2563eb",
                              color: "#fff",
                              borderRadius: "50%",
                              width: "15px",
                              height: "15px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={9} />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "3px 5px", background: "#fff" }}>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "#1e293b", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {preset.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Custom URL */}
          {activeTab === "url" && (
            <div className="sim-tab-content">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => handleCustomUrlChange(e.target.value)}
                placeholder="Dán URL ảnh hoặc đường dẫn (VD: https://... hoặc articles/anh.jpg)"
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
              <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "3px" }}>
                Có thể dán đường dẫn ảnh từ <b>Quản lý Media</b> hoặc liên kết ảnh online.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
