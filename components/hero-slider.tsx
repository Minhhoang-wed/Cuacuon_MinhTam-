"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface HeroSliderProps {
  heroEyebrow?: string;
  heroTitle?: string;
  heroEmphasis?: string;
  images?: string[];
}

const DEFAULT_IMAGES = [
  "/images/hero-banner.jpg",
  "/images/hero-banner-2.jpg",
  "/images/hero-banner-3.jpg",
];

export function HeroSlider({
  heroEyebrow,
  heroTitle,
  heroEmphasis,
  images = DEFAULT_IMAGES,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Tự động chuyển ảnh mỗi 3 giây

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="maison-hero-panorama">
      {/* Slider Track - Hiệu ứng lướt mượt từ phải sang trái */}
      <div className="hero-slider-track">
        {images.map((imgSrc, index) => {
          const offset = index - currentIndex;
          return (
            <div
              key={index}
              className={`hero-slide-item ${index === currentIndex ? "active" : ""}`}
              style={{
                transform: `translateX(${offset * 100}%)`,
              }}
            >
              <img src={imgSrc} alt={`Cửa cuốn banner ${index + 1}`} />
            </div>
          );
        })}
      </div>

      {/* Khối chữ nổi bật phía trên */}
      <div className="container" style={{ position: "relative", zIndex: 3, width: "100%" }}>
        <div className="maison-hero-inner">
          <span className="maison-hero-eyebrow">
            <ShieldCheck size={15} /> {heroEyebrow || "15 NĂM KINH NGHIỆM THI CÔNG & BẢO HÀNH"}
          </span>
          <h1>
            {heroTitle || "Giải pháp cửa cuốn"}
            <span>{heroEmphasis || "An tâm & Vận hành êm ái"}</span>
          </h1>
        </div>
      </div>

      {/* Dấu chấm chuyển slide */}
      <div className="hero-slider-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`hero-slider-dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Chuyển đến ảnh ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
