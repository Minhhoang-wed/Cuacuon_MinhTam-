export const siteConfig = {
  name: "Cửa Cuốn An Tâm 24H",
  shortName: "AN TÂM 24H",
  description:
    "Dịch vụ sửa chữa, bảo trì và lắp đặt cửa cuốn tận nơi tại TP.HCM. Tiếp nhận yêu cầu 24/7, khảo sát rõ ràng, bảo hành minh bạch.",
  hotline: "0909 123 456",
  hotlineHref: "tel:0909123456",
  zaloHref: "https://zalo.me/0909123456",
  email: "hello@cuacuonantam.vn",
  address: "123 Đường Minh Họa, TP. Hồ Chí Minh",
  hours: "Tiếp nhận 24/7",
  mapsHref: "https://maps.google.com/?q=Ho+Chi+Minh+City",
  serviceArea: "TP. Hồ Chí Minh và khu vực lân cận",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export const mainNavigation = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/ve-chung-toi" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Dự án", href: "/du-an" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;
