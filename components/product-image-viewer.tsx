"use client";

import { Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DoorVisual } from "@/components/door-visual";

const fallbackProductImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80";
const ProductSpinViewer = dynamic(() => import("@/components/product-spin-viewer").then((module) => module.ProductSpinViewer), { ssr: false });

type ProductImageViewerProps = {
  label: string;
  accent?: string;
  imageUrl?: string | null;
  imageUrls?: Array<string | null>;
  imageAlt: string;
};

export function ProductImageViewer({ label, accent, imageUrl, imageUrls = [], imageAlt }: ProductImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageSrc = imageUrl || fallbackProductImage;
  const spinImages = imageUrls.filter((url): url is string => Boolean(url));
  const canSpin = spinImages.length >= 8;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (open) setZoom(1);
  }, [open]);

  return (
    <div className="product-image-viewer">
      <button type="button" className="product-image-viewer-trigger" onClick={() => setOpen(true)} aria-label={`Phóng to và xem ảnh 360 độ của ${imageAlt}`}>
        <DoorVisual label={label} kind="product" accent={accent} imageUrl={imageUrl} imageAlt={imageAlt} />
        <span className="image-viewer-hint"><Maximize2 size={16} /> Xem ảnh 360°</span>
      </button>

      {open && (
        <div className="image-viewer-modal" role="dialog" aria-modal="true" aria-label={`Trình xem ảnh ${imageAlt}`} onMouseDown={() => setOpen(false)}>
          <div className="image-viewer-dialog" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="image-viewer-close" onClick={() => setOpen(false)} aria-label="Đóng trình xem ảnh"><X /></button>
            {canSpin ? <ProductSpinViewer images={spinImages} /> : <div className="image-viewer-stage image-viewer-static" onWheel={(event) => { event.preventDefault(); setZoom((value) => Math.min(3, Math.max(1, value + (event.deltaY < 0 ? .2 : -.2)))); }}><img src={imageSrc} alt={imageAlt} style={{ transform: `scale(${zoom})` }} /><div className="image-viewer-zoom-controls"><button type="button" onClick={() => setZoom((value) => Math.max(1, value - .25))} disabled={zoom <= 1} aria-label="Thu nhỏ ảnh"><ZoomOut /></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(3, value + .25))} disabled={zoom >= 3} aria-label="Phóng to ảnh"><ZoomIn /></button></div><p>Cuộn chuột hoặc dùng nút + / − để phóng to ảnh. Ảnh 360° sẽ khả dụng khi sản phẩm có tối thiểu 8 ảnh chụp liên tiếp quanh sản phẩm.</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
