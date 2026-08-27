"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Crop,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  Maximize2,
  Move,
  RefreshCw,
  RotateCw,
  Sparkles,
  Trash2,
  UploadCloud,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AboutBannerEditorProps {
  initialImageUrl?: string;
  defaultTitle?: string;
  defaultDescription?: string;
}

export function AboutBannerEditor({
  initialImageUrl = "/images/about-hero-banner.jpg",
  defaultTitle = "Tận tâm trong từng công trình.",
  defaultDescription = "Từ một yêu cầu sửa chữa nhỏ đến hệ cửa cho nhà xưởng, chúng tôi luôn bắt đầu bằng khảo sát rõ ràng và kết thúc bằng bàn giao minh bạch.",
}: AboutBannerEditorProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [previewSrc, setPreviewSrc] = useState<string>(initialImageUrl);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Điều chỉnh vị trí (Pan / Position X, Y theo %)
  const [posX, setPosX] = useState<number>(50);
  const [posY, setPosY] = useState<number>(50);

  // Điều chỉnh kích cỡ / thu phóng (Zoom: 100% -> 250%)
  const [zoom, setZoom] = useState<number>(100);

  // Xoay góc (0, 90, 180, 270)
  const [rotation, setRotation] = useState<number>(0);

  // Tỉ lệ khung hình preview
  const [aspectRatio, setAspectRatio] = useState<"21/9" | "16/9" | "3/1" | "4/3">("21/9");

  // Chế độ xem trước: hiển thị text overlay
  const [showOverlayText, setShowOverlayText] = useState(true);

  // Chế độ nhập link thủ công
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Kéo chuột để di chuyển ảnh
  const [isRepositioning, setIsRepositioning] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  // Load image element để chuẩn bị canvas export
  useEffect(() => {
    if (!previewSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewSrc;
    img.onload = () => {
      sourceImageRef.current = img;
      generateCroppedFile();
    };
  }, [previewSrc]);

  // Export ảnh đã chỉnh sửa (vị trí + zoom + xoay) ra file blob đính kèm form
  const generateCroppedFile = useCallback(() => {
    const img = sourceImageRef.current;
    if (!img || !hasNewFile) return;

    try {
      const canvas = document.createElement("canvas");
      // Kích thước chuẩn HD cho Banner
      let targetW = 1920;
      let targetH = 640;
      if (aspectRatio === "16/9") {
        targetW = 1920;
        targetH = 1080;
      } else if (aspectRatio === "3/1") {
        targetW = 1920;
        targetH = 640;
      } else if (aspectRatio === "4/3") {
        targetW = 1440;
        targetH = 1080;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, targetW, targetH);

      ctx.save();
      // Dịch gốc tọa độ về tâm
      ctx.translate(targetW / 2, targetH / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const scale = (zoom / 100);
      // Tỉ lệ scale bao phủ
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = targetW / targetH;

      let drawW: number;
      let drawH: number;

      if (imgRatio > targetRatio) {
        drawH = targetH * scale;
        drawW = drawH * imgRatio;
      } else {
        drawW = targetW * scale;
        drawH = drawW / imgRatio;
      }

      // Tọa độ lệch theo vị trí kéo (posX, posY từ 0% đến 100%, 50% là giữa)
      const offsetX = ((50 - posX) / 100) * (drawW - targetW);
      const offsetY = ((50 - posY) / 100) * (drawH - targetH);

      ctx.drawImage(
        img,
        -drawW / 2 + offsetX,
        -drawH / 2 + offsetY,
        drawW,
        drawH
      );
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (blob && fileInputRef.current) {
            const file = new File([blob], fileName || "about-hero-banner.jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
          }
        },
        "image/jpeg",
        0.92
      );
    } catch (e) {
      console.warn("Canvas export fallback:", e);
    }
  }, [hasNewFile, fileName, aspectRatio, zoom, posX, posY, rotation]);

  // Cập nhật lại file export mỗi khi thay đổi zoom / pos / rotation
  useEffect(() => {
    if (hasNewFile) {
      generateCroppedFile();
    }
  }, [hasNewFile, zoom, posX, posY, rotation, aspectRatio, generateCroppedFile]);

  // Xử lý chọn file từ máy
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh (JPG, PNG, WebP)!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa là 10MB!");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFileName(file.name);
    setPreviewSrc(objectUrl);
    setImageUrl(objectUrl);
    setHasNewFile(true);
    setPosX(50);
    setPosY(50);
    setZoom(100);
    setRotation(0);
  };

  // Kéo thả chuột để điều chỉnh vị trí ảnh (Drag to reposition)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRepositioning(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: posX,
      initialPosY: posY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRepositioning || !dragStartRef.current || !previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    // Tính % di chuyển dựa trên kích thước khung và zoom
    const sensitivity = 100 / (zoom / 100);
    const percentChangeX = -(deltaX / rect.width) * sensitivity;
    const percentChangeY = -(deltaY / rect.height) * sensitivity;

    const newX = Math.min(100, Math.max(0, dragStartRef.current.initialPosX + percentChangeX));
    const newY = Math.min(100, Math.max(0, dragStartRef.current.initialPosY + percentChangeY));

    setPosX(Math.round(newX));
    setPosY(Math.round(newY));
  };

  const handleMouseUp = () => {
    setIsRepositioning(false);
    dragStartRef.current = null;
  };

  // Touch support cho mobile / iPad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsRepositioning(true);
      dragStartRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initialPosX: posX,
        initialPosY: posY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRepositioning || !dragStartRef.current || !previewContainerRef.current || e.touches.length !== 1) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const deltaX = e.touches[0].clientX - dragStartRef.current.startX;
    const deltaY = e.touches[0].clientY - dragStartRef.current.startY;

    const sensitivity = 100 / (zoom / 100);
    const percentChangeX = -(deltaX / rect.width) * sensitivity;
    const percentChangeY = -(deltaY / rect.height) * sensitivity;

    const newX = Math.min(100, Math.max(0, dragStartRef.current.initialPosX + percentChangeX));
    const newY = Math.min(100, Math.max(0, dragStartRef.current.initialPosY + percentChangeY));

    setPosX(Math.round(newX));
    setPosY(Math.round(newY));
  };

  const handleTouchEnd = () => {
    setIsRepositioning(false);
    dragStartRef.current = null;
  };

  // Điều chỉnh bằng nút bấm (Nudge +/- 5%)
  const nudge = (dx: number, dy: number) => {
    setPosX((prev) => Math.min(100, Math.max(0, prev + dx)));
    setPosY((prev) => Math.min(100, Math.max(0, prev + dy)));
  };

  // Reset về mặc định
  const handleReset = () => {
    setPreviewSrc(initialImageUrl);
    setImageUrl(initialImageUrl);
    setHasNewFile(false);
    setFileName("");
    setPosX(50);
    setPosY(50);
    setZoom(100);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="about-banner-editor">
      {/* ── 1. KHUNG XEM TRƯỚC VÀ KÉO THẢ VỊ TRÍ ── */}
      <div className="banner-preview-wrapper">
        <div className="banner-preview-header">
          <div className="banner-preview-title">
            <Sparkles size={16} className="text-amber-500" />
            <span>Xem trước Hero Banner (Kéo chuột trực tiếp trên ảnh để căn vị trí)</span>
          </div>

          <div className="banner-preview-actions">
            <button
              type="button"
              className={`button-toggle ${showOverlayText ? "active" : ""}`}
              onClick={() => setShowOverlayText(!showOverlayText)}
              title="Ẩn/Hiện lớp chữ minh họa trang thực tế"
            >
              {showOverlayText ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{showOverlayText ? "Hiển thị chữ" : "Ảnh thuần"}</span>
            </button>

            <button
              type="button"
              className="button-toggle"
              onClick={() => {
                setPosX(50);
                setPosY(50);
                setZoom(100);
              }}
              title="Căn giữa lại vị trí ban đầu"
            >
              <RefreshCw size={14} />
              <span>Căn giữa (50% 50%)</span>
            </button>
          </div>
        </div>

        {/* Khung Viewport chính hỗ trợ kéo ảnh */}
        <div
          ref={previewContainerRef}
          className={`banner-viewport ${isRepositioning ? "is-dragging" : ""}`}
          style={{
            aspectRatio:
              aspectRatio === "21/9"
                ? "21 / 9"
                : aspectRatio === "16/9"
                ? "16 / 9"
                : aspectRatio === "3/1"
                ? "3 / 1"
                : "4 / 3",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ảnh nền được áp dụng Zoom, Rotation và Background Position */}
          <div
            className="banner-bg-layer"
            style={{
              backgroundImage: `url(${previewSrc})`,
              backgroundPosition: `${posX}% ${posY}%`,
              backgroundSize: `${zoom}%`,
              transform: `rotate(${rotation}deg)`,
            }}
          />

          {/* Lớp gradient mô phỏng đúng như trên website public */}
          <div className="banner-overlay-layer" />

          {/* Lưới căn chỉnh (Grid lines) khi đang kéo */}
          <div className={`banner-grid-guide ${isRepositioning ? "visible" : ""}`}>
            <div className="grid-line horizontal top" />
            <div className="grid-line horizontal bottom" />
            <div className="grid-line vertical left" />
            <div className="grid-line vertical right" />
            <div className="grid-center-cross" />
          </div>

          {/* Huy hiệu hướng dẫn kéo */}
          <div className="banner-drag-badge">
            <Move size={13} />
            <span>Kéo để chỉnh góc nhìn: {posX}% X · {posY}% Y</span>
          </div>

          {/* Chữ mô phỏng trang thực tế */}
          {showOverlayText && (
            <div className="banner-text-mockup">
              <span className="banner-eyebrow-tag">Giới thiệu · Cửa Cuốn Minh Tâm</span>
              <h2 className="banner-mock-title">{defaultTitle}</h2>
              <p className="banner-mock-desc">{defaultDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. BẢNG ĐIỀU KHIỂN THU PHÓNG, KÍCH CỠ & VỊ TRÍ ── */}
      <div className="banner-control-bar">
        {/* Nhóm 1: Thu phóng / Kích cỡ (Zoom slider) */}
        <div className="control-group">
          <label className="control-label">
            <ZoomIn size={15} />
            <span>Kích cỡ / Thu phóng: <b>{zoom}%</b></span>
          </label>
          <div className="zoom-slider-wrapper">
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.max(100, z - 10))}
              title="Thu nhỏ (-10%)"
            >
              <ZoomOut size={14} />
            </button>
            <input
              type="range"
              min="100"
              max="250"
              step="5"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="banner-slider"
            />
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoom((z) => Math.min(250, z + 10))}
              title="Phóng to (+10%)"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              className="zoom-reset-btn"
              onClick={() => setZoom(100)}
              title="Khôi phục chuẩn 100%"
            >
              100%
            </button>
          </div>
        </div>

        {/* Nhóm 2: Tỉ lệ khung hình (Aspect Ratio) */}
        <div className="control-group">
          <label className="control-label">
            <Crop size={15} />
            <span>Tỉ lệ khung banner:</span>
          </label>
          <div className="ratio-btn-group">
            <button
              type="button"
              className={`ratio-btn ${aspectRatio === "21/9" ? "active" : ""}`}
              onClick={() => setAspectRatio("21/9")}
            >
              21:9 (Chuẩn Hero)
            </button>
            <button
              type="button"
              className={`ratio-btn ${aspectRatio === "16/9" ? "active" : ""}`}
              onClick={() => setAspectRatio("16/9")}
            >
              16:9 (Rộng)
            </button>
            <button
              type="button"
              className={`ratio-btn ${aspectRatio === "3/1" ? "active" : ""}`}
              onClick={() => setAspectRatio("3/1")}
            >
              3:1 (Panorama)
            </button>
            <button
              type="button"
              className={`ratio-btn ${aspectRatio === "4/3" ? "active" : ""}`}
              onClick={() => setAspectRatio("4/3")}
            >
              4:3 (Cao)
            </button>
          </div>
        </div>

        {/* Nhóm 3: Tinh chỉnh vị trí bằng phím điều hướng & Xoay */}
        <div className="control-group">
          <label className="control-label">
            <Move size={15} />
            <span>Tinh chỉnh vị trí:</span>
          </label>
          <div className="nudge-controls">
            <div className="dpad-wrapper">
              <button
                type="button"
                className="dpad-btn up"
                onClick={() => nudge(0, -5)}
                title="Lên trên"
              >
                <ArrowUp size={13} />
              </button>
              <div className="dpad-row">
                <button
                  type="button"
                  className="dpad-btn left"
                  onClick={() => nudge(-5, 0)}
                  title="Sang trái"
                >
                  <ArrowLeft size={13} />
                </button>
                <button
                  type="button"
                  className="dpad-btn center"
                  onClick={() => {
                    setPosX(50);
                    setPosY(50);
                  }}
                  title="Căn giữa"
                >
                  •
                </button>
                <button
                  type="button"
                  className="dpad-btn right"
                  onClick={() => nudge(5, 0)}
                  title="Sang phải"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              <button
                type="button"
                className="dpad-btn down"
                onClick={() => nudge(0, 5)}
                title="Xuống dưới"
              >
                <ArrowDown size={13} />
              </button>
            </div>

            <button
              type="button"
              className="rotate-btn"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              title="Xoay ảnh 90°"
            >
              <RotateCw size={15} />
              <span>Xoay {rotation}°</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. KHU VỰC CHỌN TẢI ẢNH TỪ MÁY TÍNH / DROPZONE ── */}
      <div
        className={`banner-upload-dropzone ${isDraggingFile ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingFile(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="dropzone-circle-icon">
          {hasNewFile ? <Check size={28} /> : <UploadCloud size={28} />}
        </div>

        <div className="dropzone-info">
          <b>{hasNewFile ? `Đã chọn ảnh mới: ${fileName}` : "Bấm để tải ảnh mới từ máy tính hoặc kéo thả ảnh vào đây"}</b>
          <p>Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB) · Khuyến nghị ảnh ngang độ phân giải cao từ 1600px trở lên.</p>
        </div>

        <div className="dropzone-buttons" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="button button-primary button-small"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={15} />
            <span>{hasNewFile ? "Chọn ảnh khác từ máy" : "Tải ảnh từ máy tính"}</span>
          </button>

          <button
            type="button"
            className="button button-ghost button-small"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            <LinkIcon size={14} />
            <span>{showUrlInput ? "Ẩn ô nhập URL" : "Nhập link ảnh (URL)"}</span>
          </button>

          {hasNewFile && (
            <button
              type="button"
              className="button button-ghost button-small text-red-500"
              onClick={handleReset}
            >
              <Trash2 size={14} />
              <span>Hủy thay đổi</span>
            </button>
          )}
        </div>
      </div>

      {/* Tùy chọn nhập link ảnh URL bên ngoài */}
      {showUrlInput && (
        <div className="banner-url-box">
          <label>
            <span>Nhập trực tiếp URL ảnh ngoài (hoặc đường dẫn nội bộ):</span>
            <div className="url-input-wrapper">
              <input
                type="text"
                value={imageUrl}
                placeholder="VD: /images/about-hero-banner.jpg hoặc https://..."
                onChange={(e) => {
                  const val = e.target.value;
                  setImageUrl(val);
                  if (val.trim()) {
                    setPreviewSrc(val.trim());
                    setHasNewFile(false);
                  }
                }}
              />
              <button
                type="button"
                className="button button-small"
                onClick={() => {
                  if (imageUrl.trim()) {
                    setPreviewSrc(imageUrl.trim());
                  }
                }}
              >
                Áp dụng URL
              </button>
            </div>
          </label>
        </div>
      )}

      {/* Input file ẩn gửi qua FormData lên server action */}
      <input
        ref={fileInputRef}
        type="file"
        name="hero_image_file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* Input hidden lưu trữ giá trị đường dẫn cũ nếu không upload ảnh mới */}
      <input type="hidden" name="hero_image" value={imageUrl} />
    </div>
  );
}
