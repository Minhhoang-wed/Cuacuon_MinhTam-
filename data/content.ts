export type Service = {
  slug: string;
  name: string;
  summary: string;
  price: string;
  duration: string;
  warranty: string;
  symptoms: string[];
  process: string[];
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  price: string;
  warranty: string;
  specs: string[];
  accent: string;
};

export type Project = {
  slug: string;
  name: string;
  location: string;
  category: string;
  summary: string;
  result: string;
  accent: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
};


// Sẵn sàng để nhập dữ liệu thực tế của bạn
export const services: Service[] = [];

export const products: Product[] = [
  {
    slug: "motor-cua-cuon-austdoor-ah500-chinh-hang",
    name: "Motor Cửa Cuốn Austdoor AH500 Lõi Đồng Chính Hãng (Tải Trọng 500kg)",
    category: "Motor cửa cuốn",
    summary: "Động cơ Austdoor AH500 100% lõi đồng nguyên chất, vận hành siêu êm, tích hợp công nghệ chống sao chép ARC Austmatic và rơ-le tự ngắt khi quá nhiệt.",
    price: "4.850.000đ",
    warranty: "24 tháng",
    specs: [
      "Hãng sản xuất: Austdoor Group",
      "Tải trọng nâng: 500 kg (cửa dưới 22m²)",
      "Lõi cuộn dây: 100% Đồng nguyên chất",
      "Điện áp: 220V / 50Hz",
      "Công suất: 370W",
      "Bảo mật: Mã nhảy Austmatic ARC",
      "Phụ kiện: Motor + Mặt bích + Hộp nhận + 2 Remote",
    ],
    accent: "#10b981",
  },
  {
    slug: "bo-luu-dien-cua-cuon-titadoor-tu5-chinh-hang",
    name: "Bộ Lưu Điện Cửa Cuốn Titadoor TU5 800VA Chính Hãng (Ắc Quy Globe Siêu Bền)",
    category: "Bộ lưu điện",
    summary: "Bộ lưu điện Titadoor TU5 công suất 800VA trang bị 2 bình ắc quy Globe 12V-7.5Ah chuyên dụng, duy trì hoạt động cửa 48h khi mất điện.",
    price: "2.850.000đ",
    warranty: "12 tháng (đổi mới 6 tháng)",
    specs: [
      "Hãng sản xuất: Titadoor Power Systems",
      "Công suất danh định: 800VA / 500W",
      "Dung lượng ắc quy: 2 bình Globe 12V - 7.5Ah",
      "Thời gian lưu trữ: 48 giờ sau khi cúp điện",
      "Số lần đóng mở: 15 - 20 lần",
      "Bảo vệ: Tự ngắt sạc khi đầy, chống kiệt bình",
    ],
    accent: "#06b6d4",
  },
  {
    slug: "bo-dieu-khien-cua-cuon-titadoor-ma-nhay-chinh-hang",
    name: "Bộ Điều Khiển Cửa Cuốn Titadoor Kèm 2 Remote Mã Nhảy Chống Sao Chép",
    category: "Bộ điều khiển",
    summary: "Hộp nhận tín hiệu Titadoor sóng 433MHz Rolling Code mã nhảy bảo mật cao, khoảng cách bắt sóng lên tới 100m, chống phá khóa 100%.",
    price: "1.350.000đ",
    warranty: "12 tháng",
    specs: [
      "Hãng sản xuất: Titadoor Tech",
      "Tần số: 433.92 MHz Rolling Code (Mã nhảy)",
      "Khoảng cách nhận sóng: 50m - 100m",
      "Lưu trữ: Lên đến 20 remote",
      "Bộ sản phẩm: 1 hộp nhận + 2 tay điều khiển inox",
    ],
    accent: "#6366f1",
  },
  {
    slug: "tay-dieu-khien-remote-austdoor-dk1-chinh-hang",
    name: "Tay Điều Khiển Remote Cửa Cuốn Austdoor DK1 Nắp Trượt Kim Loại",
    category: "Tay điều khiển",
    summary: "Khóa điều khiển từ xa Austdoor DK1 chính hãng, 4 nút bấm tiện dụng, công nghệ mã nhảy Austmatic ARC, viền inox chống va đập.",
    price: "380.000đ",
    warranty: "12 tháng",
    specs: [
      "Hãng sản xuất: Austdoor Group",
      "Số nút: 4 nút (Lên, Xuống, Dừng, Khóa)",
      "Công nghệ: Austmatic Rolling Code (ARC)",
      "Loại pin: Pin 12V - 27A",
      "Chất liệu: Nhựa ABS + Viền thép không gỉ",
    ],
    accent: "#ec4899",
  },
  {
    slug: "bo-cam-bien-dao-chieu-tu-dung-khong-day-cua-cuon",
    name: "Bộ Cảm Biến Tự Dừng & Đảo Chiều Không Dây Cửa Cuốn Safe-Seal",
    category: "An toàn",
    summary: "Hệ thống cảm biến chống kẹt không dây thông minh, tự động phát hiện vật cản và đảo chiều cửa đi lên ngay lập tức, bảo vệ trẻ nhỏ và xe cộ.",
    price: "950.000đ",
    warranty: "12 tháng",
    specs: [
      "Loại thiết bị: Cảm biến đảo chiều & tự ngắt chống kẹt",
      "Kết nối: Không dây Wireless Transmitter 433MHz",
      "Thời gian phản ứng: < 0.2 giây khi chạm vật cản",
      "Hành trình đảo chiều: Đảo ngược lên 15 - 20 cm",
      "Tương thích: Tất cả các dòng motor cửa cuốn",
    ],
    accent: "#f59e0b",
  },
  {
    slug: "cua-cuon-khe-thoang-nhom-titadoor-pm-503-chinh-hang",
    name: "Cửa Cuốn Khe Thoáng Nhôm Titadoor PM-503 Sơn AkzoNobel (Đức)",
    category: "Thân cửa",
    summary: "Thân cửa cuốn hợp kim nhôm 6063-T5 cao cấp 2 lớp, móc chịu lực dày 1.3mm, khe thoáng hình Ovan đón gió, phủ sơn AkzoNobel bảo hành 5 năm.",
    price: "Từ 1.450.000đ/m²",
    warranty: "5 năm (màu sơn) · 24 tháng (thân cửa)",
    specs: [
      "Hãng sản xuất: Titadoor Technology (Đức)",
      "Chất liệu: Hợp kim nhôm định hình 6063-T5",
      "Độ dày: Móc dày 1.3mm, chân chịu lực 1.5mm",
      "Khe thoáng: Lỗ thoáng hình Ovan điều hòa gió",
      "Bề mặt sơn: Sơn tĩnh điện AkzoNobel Hà Lan",
      "Kích thước tối đa: Rộng 6.5m x Cao 6.0m (36m²)",
    ],
    accent: "#eab308",
  },
];

export const projects: Project[] = [];

export const articles: Article[] = [];

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((item) => item.slug === slug);
}

