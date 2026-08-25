export const siteConfig = {
  name: "Cửa Cuốn Minh Tâm 24H",
  shortName: "Minh Tâm 24H",
  description:
    "Dịch vụ sửa cửa cuốn TP.HCM 24/7 uy tín, có mặt sau 15 phút. Chuyên sửa kẹt nan, motor, remote, bình lưu điện. Thợ giỏi, giá rẻ từ 150k, bảo hành 24T.",
  hotline: "0327 359 368",
  hotlineHref: "tel:0327359368",
  zaloHref: "https://zalo.me/0327359368",
  email: "hello@suachuacuacuonnhanh24h.com",
  address: "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM",
  hours: "Tiếp nhận 24/7",
  mapsHref: "https://maps.google.com/?q=Ho+Chi+Minh+City",
  serviceArea: "Toàn bộ 24 Quận / Huyện TP.HCM & Khu vực lân cận",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.suachuacuacuonnhanh24h.com",
} as const;

export const mainNavigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Giới thiệu", href: "/ve-chung-toi" },
] as const;
