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

      <div className="sim-layout">
        {/* Left Side: Preview Frame & Controls */}
        <div className="sim-preview-pane">
          <div className="sim-pane-header">
            <span className="sim-label">Xem trước ảnh bài viết</span>
            {activeDisplayUrl && (
              <button
                type="button"
                className="sim-btn-clear"
                onClick={handleClearImage}
                title="Gỡ bỏ ảnh bìa này"
              >
                <Trash2 size={13} />
                <span>Gỡ ảnh</span>
              </button>
            )}
          </div>

          <div
            className={`sim-display-frame aspect-${aspectRatio.replace("/", "-")}`}
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "220px",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
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
                  gap: "10px",
                  color: "#94a3b8",
                  padding: "30px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#38bdf8",
                  }}
                >
                  <Newspaper size={28} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1" }}>
                  Chưa có ảnh bài viết
                </span>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b", maxWidth: "240px" }}>
                  Tải ảnh mới từ máy, chọn ảnh mẫu hoặc dán đường dẫn ảnh bên phải.
                </p>
              </div>
            )}

            {/* Badge type overlay */}
            {activeDisplayUrl && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(6px)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Sparkles size={11} color="#38bdf8" />
                <span>
                  {selectedFile
                    ? `Tệp mới: ${selectedFile.name}`
                    : selectedPresetUrl
                    ? "Ảnh mẫu Preset"
                    : customUrl
                    ? "Ảnh qua URL"
                    : "Ảnh hiện tại"}
                </span>
              </div>
            )}
          </div>

          {/* Quick Adjustment Tools */}
          {activeDisplayUrl && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                marginTop: "12px",
                padding: "8px 12px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Tỷ lệ:</span>
                {(["16/9", "4/3", "1/1"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11.5px",
                      fontWeight: aspectRatio === ratio ? 700 : 500,
                      borderRadius: "4px",
                      border: "1px solid",
                      borderColor: aspectRatio === ratio ? "#2563eb" : "#cbd5e1",
                      background: aspectRatio === ratio ? "#eff6ff" : "#ffffff",
                      color: aspectRatio === ratio ? "#1d4ed8" : "#475569",
                      cursor: "pointer",
                    }}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => setFitMode(fitMode === "cover" ? "contain" : "cover")}
                  title={fitMode === "cover" ? "Chuyển sang hiển thị trọn vẹn (Contain)" : "Chuyển sang tràn khung (Cover)"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: "12px",
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
                  title="Xoay góc 90°"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: "12px",
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  <RotateCw size={12} />
                  <span>{rotation}°</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tab Options for Image Source */}
        <div className="sim-options-pane">
          {/* Navigation Tabs */}
          <div className="sim-tabs">
            <button
              type="button"
              className={`sim-tab ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              <Upload size={14} />
              <span>Tải ảnh từ máy</span>
            </button>

            <button
              type="button"
              className={`sim-tab ${activeTab === "presets" ? "active" : ""}`}
              onClick={() => setActiveTab("presets")}
            >
              <Sparkles size={14} />
              <span>Ảnh mẫu có sẵn ({ARTICLE_PRESET_IMAGES.length})</span>
            </button>

            <button
              type="button"
              className={`sim-tab ${activeTab === "url" ? "active" : ""}`}
              onClick={() => setActiveTab("url")}
            >
              <Link2 size={14} />
              <span>Đường dẫn URL / Media</span>
            </button>
          </div>

          {/* Tab 1: Upload File */}
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
                  border: "2px dashed #cbd5e1",
                  borderRadius: "10px",
                  padding: "24px 16px",
                  textAlign: "center",
                  background: "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#e0f2fe",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 10px",
                  }}
                >
                  <ImagePlus size={22} />
                </div>
                <b style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                  Bấm để chọn tệp hoặc kéo thả vào đây
                </b>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Hỗ trợ JPG, PNG, WebP (Tối đa 10MB)
                </span>

                {selectedFile && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      color: "#15803d",
                      fontSize: "12.5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontWeight: 600,
                    }}
                  >
                    <Check size={14} />
                    <span>Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Presets */}
          {activeTab === "presets" && (
            <div className="sim-tab-content">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "10px",
                  maxHeight: "260px",
                  overflowY: "auto",
                  paddingRight: "4px",
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
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        cursor: "pointer",
                        background: "#f1f5f9",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ width: "100%", height: "70px", position: "relative" }}>
                        <img
                          src={preset.url}
                          alt={preset.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              background: "#2563eb",
                              color: "#fff",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "6px 8px", background: "#fff" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#1e293b", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {preset.title}
                        </span>
                        <span style={{ fontSize: "10px", color: "#64748b" }}>
                          {preset.category}
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
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                  Nhập URL ảnh trực tiếp hoặc đường dẫn từ Storage
                </span>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => handleCustomUrlChange(e.target.value)}
                  placeholder="VD: https://... hoặc articles/ten-anh.jpg"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13.5px",
                  }}
                />
              </label>
              <small style={{ color: "#64748b", fontSize: "12px", display: "block", marginTop: "6px" }}>
                Có thể dán đường dẫn ảnh từ trang <b>Quản lý Media</b> hoặc ảnh online chất lượng cao.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
