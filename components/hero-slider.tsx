"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

interface HeroSliderProps {
  heroEyebrow?: string;
  heroTitle?: string;
  heroEmphasis?: string;
  heroDescription?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  images?: string[];
  hotline?: string;
}

const DEFAULT_IMAGES = [
  "/images/banner-hero-villa.jpg",
  "/images/banner-hero-modern.jpg",
  "/images/hero-banner.jpg",
];

export function HeroSlider({
  heroEyebrow,
  heroTitle,
  heroEmphasis,
  heroDescription,
  heroCtaLabel,
  heroCtaHref = "#repair-form",
  images = DEFAULT_IMAGES,
  hotline = "0938 123 456",
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          {/* Slider Background Track */}
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
                  <img
                    src={imgSrc}
                    alt={`Cửa Cuốn An Tâm Banner ${index + 1}`}
                    className="hero-slide-image"
                  />
                </div>
              );
            })}
          </div>

          {/* Left-focused cinematic dark gradient overlay */}
          <div className="hero-banner-overlay" />

          {/* Left-Aligned Content Layout */}
          <div className="hero-banner-content">
            {heroEyebrow && (
              <span className="hero-banner-eyebrow">
                <ShieldCheck size={15} />
                {heroEyebrow}
              </span>
            )}

            <h1 className="hero-banner-title">
              {heroTitle || "Cửa gặp sự cố?"}
              <span className="hero-banner-emphasis">
                {heroEmphasis || "Đừng để cả ngày bị kẹt lại."}
              </span>
            </h1>

            <p className="hero-banner-description">
              {heroDescription ||
                "Đặt lịch trong 60 giây. Kỹ thuật viên liên hệ xác nhận tình trạng, thời gian và báo giá tham khảo trước khi đến."}
            </p>

            <div className="hero-banner-actions">
              <Link href={heroCtaHref} className="hero-pill-button">
                <span>{heroCtaLabel || "Gửi yêu cầu"}</span>
                <ArrowRight size={16} />
              </Link>
              {hotline && (
                <a href={`tel:${hotline.replace(/\s+/g, "")}`} className="hero-phone-button">
                  <PhoneCall size={16} />
                  <span>Hotline: <b>{hotline}</b></span>
                </a>
              )}
            </div>

            {/* Micro Trust Perks */}
            <div className="hero-banner-perks">
              <div className="hero-perk-item">
                <Clock size={14} />
                <span>Có mặt sau 15–30p</span>
              </div>
              <div className="hero-perk-item">
                <CheckCircle2 size={14} />
                <span>Báo giá trước khi làm</span>
              </div>
              <div className="hero-perk-item">
                <ShieldCheck size={14} />
                <span>Bảo hành tận nơi 24/7</span>
              </div>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          {images.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
}

