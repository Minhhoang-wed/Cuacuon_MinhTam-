"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface CinematicHeroSliderProps {
  hotlineHref?: string;
  hotline?: string;
  zaloHref?: string;
  images?: string[];
}

const DEFAULT_SLIDES = [
  "/images/home-hero-daylight.jpg",
  "/images/home-hero-daylight-2.jpg",
  "/images/home-hero-daylight-3.jpg",
];

export function CinematicHeroSlider({
  hotlineHref,
  hotline,
  zaloHref,
  images = DEFAULT_SLIDES,
}: CinematicHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Chuyển ảnh tự động mỗi 3 giây

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="cinematic-hero-section" id="sua-cua-cuon">
      <div className="container">
        <div className="cinematic-hero-card">
          {/* Background Fade Slides - Hiệu ứng mờ dần chuyển ảnh */}
          <div className="cinematic-slides-container">
            {images.map((imgSrc, index) => (
              <div
                key={index}
                className={`cinematic-slide-bg ${index === currentIndex ? "active" : ""}`}
                style={{
                  backgroundImage: `url(${imgSrc})`,
                }}
              />
            ))}
          </div>

          {/* Lớp nội dung chữ nổi bật */}
          <div className="cinematic-hero-content">
            <span className="cinematic-hero-badge">
              CỨU HỘ & SỬA CỬA CUỐN 24/7 TOÀN TP.HCM
            </span>
            <h1 className="cinematic-hero-title">
              Cửa cuốn gặp sự cố?
              <em>Minh Tâm hỗ trợ sửa chữa tận nơi.</em>
            </h1>
            <p className="cinematic-hero-desc">
              Tiếp nhận mọi sự cố cửa cuốn kẹt nan, hỏng motor, lỗi remote, lệch ray, đứt lò xo... 
              Kỹ thuật viên có mặt nhanh sau 15 – 30 phút tại tất cả các quận huyện TP.HCM.
            </p>

            <div className="cinematic-hero-actions">
              <a
                href={hotlineHref || `tel:${(hotline || "0327359368").replace(/\D/g, "")}`}
                className="cinematic-btn-primary"
              >
                <Phone size={18} />
                <span>Gọi ngay: <b>{hotline || "0327 359 368"}</b></span>
              </a>
              <a
                href={zaloHref || "https://zalo.me/0327359368"}
                target="_blank"
                rel="noreferrer"
                className="cinematic-btn-secondary"
              >
                <MessageCircle size={18} />
                <span>Nhận báo giá qua Zalo</span>
              </a>
            </div>
          </div>

          {/* Dấu chấm chuyển slide (Subtle Dots) */}
          {images.length > 1 && (
            <div className="cinematic-slider-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`cinematic-dot ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Chuyển đến ảnh ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
