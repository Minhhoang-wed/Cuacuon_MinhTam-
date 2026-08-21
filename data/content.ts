export type Service = {
  slug: string;
  name: string;
  summary: string;
  price: string;
  duration: string;
  warranty: string;
  imageUrl?: string;
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

export const services: Service[] = [
  {
    slug: "sua-cua-cuon-bi-ket",
    name: "Sửa cửa cuốn bị kẹt",
    summary: "Xử lý cửa kẹt nan, xổ lô, lệch ray, không lên xuống được an toàn, nhanh chóng.",
    price: "300.000 – 800.000đ",
    duration: "20 - 45 phút",
    warranty: "3 – 6 tháng",
    imageUrl: "/services/sua-cua-bi-ket.png",
    symptoms: ["Cửa dừng giữa chừng không lên xuống được", "Nan cửa bị kẹt, xô nan hoặc bung ray", "Cửa kêu to và kẹt cứng khi đóng mở"],
    process: ["Tiếp nhận thông tin và định vị sự cố", "Kỹ thuật viên đến hiện trường trong 15-30 phút", "Nắn chỉnh nan, tra dầu mỡ và căn chỉnh ray", "Vận hành thử nghiệm và bàn giao"],
  },
  {
    slug: "sua-motor-cua-cuon",
    name: "Sửa motor cửa cuốn",
    summary: "Sửa motor kẹt cơ, hỏng tụ, cháy cuộn dây, thay vỉ mạch hành trình chính hãng.",
    price: "350.000 – 800.000đ",
    duration: "30 - 60 phút",
    warranty: "3 – 6 tháng",
    imageUrl: "/services/sua-motor.png",
    symptoms: ["Motor phát tiếng kêu bất thường nhưng cửa không chạy", "Motor nóng nhanh, yếu tải không kéo được cửa", "Hỏng bộ điều khiển từ xa hoặc rơ-le"],
    process: ["Kiểm tra cuộn dây, tụ điện và vỉ mạch", "Thay thế linh kiện chính hãng tại chỗ", "Căn chỉnh lại hành trình ngắt an toàn", "Bàn giao bảo hành 3-6 tháng"],
  },
  {
    slug: "sua-remote-hop-nhan",
    name: "Sửa remote & hộp nhận",
    summary: "Khắc phục remote chập chờn, làm thêm remote mã gạt/nhảy, đổi mã khóa an toàn.",
    price: "150.000 – 550.000đ",
    duration: "15 - 30 phút",
    warranty: "6 – 12 tháng",
    imageUrl: "/services/sua-remote.png",
    symptoms: ["Remote bấm đèn sáng nhưng cửa không nhận lệnh", "Khoảng cách bắt sóng bị ngắn đi đáng kể", "Cần làm thêm chìa remote dự phòng"],
    process: ["Đo tần số sóng điều khiển", "Cài đặt đồng bộ hộp nhận và tay remote mới", "Reset mã khóa cũ đảm bảo an ninh tuyệt đối", "Kiểm tra tầm bắt sóng và bàn giao"],
  },
  {
    slug: "thay-nan-lo-xo-cua",
    name: "Thay nan & lò xo cửa",
    summary: "Gỡ xô nan, nắn phẳng nan móp gãy, thay bộ lò xo trợ lực kéo tay cao cấp.",
    price: "800.000 – 1.500.000đ",
    duration: "45 - 90 phút",
    warranty: "6 – 12 tháng",
    imageUrl: "/services/thay-nan.png",
    symptoms: ["Nan cửa bị đứt gãy khớp nối", "Lò xo cửa kéo tay bị đứt hoặc nhão", "Cửa kéo nặng bất thường, dễ tuột rơi"],
    process: ["Tháo dỡ phần nan hỏng an toàn", "Thay thế nan cùng kích thước hoặc thay lò xo mới", "Cân chỉnh lực đàn hồi đồng đều hai bên", "Nghiệm thu đóng mở êm ái"],
  },
  {
    slug: "sua-ray-chinh-hanh-trinh",
    name: "Sửa ray & chỉnh hành trình",
    summary: "Căn chỉnh, thay mới ray dẫn hướng bị lệch, móp, tra dầu mỡ bảo dưỡng trơn tru.",
    price: "400.000 – 900.000đ",
    duration: "30 - 60 phút",
    warranty: "3 – 6 tháng",
    imageUrl: "/services/sua-ray.png",
    symptoms: ["Ray dẫn hướng bị bung mối hàn, cong vênh", "Cửa đóng không chạm sàn hoặc mở vọt lên trên", "Nan cửa cọ sát vào ray phát tiếng rít chói tai"],
    process: ["Gia cố và nắn chỉnh ray dẫn hướng", "Cài đặt lại công tắc hành trình rơ-le", "Tra mỡ bôi trơn chuyên dụng chịu nhiệt", "Chạy thử nhiều chu kỳ hoàn tất"],
  },
  {
    slug: "sua-binh-luu-dien-ups",
    name: "Sửa bình lưu điện (UPS)",
    summary: "Sửa UPS lỗi không sạc, thay cặp ắc quy mới, thay bộ UPS chính hãng giá tốt.",
    price: "350.000 – 1.200.000đ",
    duration: "30 - 45 phút",
    warranty: "6 – 24 tháng",
    imageUrl: "/services/binh-luu-dien.png",
    symptoms: ["Mất điện không điều khiển mở cửa được", "Bình lưu điện kêu bíp liên tục hoặc báo đèn đỏ", "Ắc quy bị chai, phồng nạp không vào điện"],
    process: ["Đo kiểm tra dung lượng cặp bình ắc quy", "Thay thế ắc quy chuyên dụng hoặc sửa mạch sạc", "Test cắt điện lưới vận hành thử đóng/mở", "Dán tem bảo hành và hướng dẫn bảo dưỡng"],
  },
];

export const products: Product[] = [
  {
    slug: "cua-cuon-khe-thoang-nhom-titadoor-pm-503-chinh-hang",
    name: "Cửa Cuốn Khe Thoáng Nhôm Titadoor PM-503 Sơn AkzoNobel (Đức)",
    category: "Cửa cuốn khe thoáng",
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
  {
    slug: "cua-cuon-tam-lien-austdoor-series-1",
    name: "Cửa Cuốn Tấm Liền Austdoor Series 1 Thép Colorbond (Úc)",
    category: "Cửa cuốn tấm liền",
    summary: "Cửa cuốn tấm liền Austdoor thép Colorbond nhập khẩu BlueScope Steel Úc, trang bị dây polyguide giảm chấn triệt tiêu tiếng ồn, có chốt ly hợp kéo tay nhẹ nhàng.",
    price: "Từ 850.000đ/m²",
    warranty: "5 năm (thân cửa)",
    specs: [
      "Hãng sản xuất: Austdoor Group (Úc)",
      "Vật liệu: Thép hợp kim Colorbond BlueScope Úc",
      "Độ dày thép: 0.53 mm tiêu chuẩn",
      "Vận hành: Hệ thống lò xo C75 trợ lực, mở tay cực êm",
      "Giảm chấn: Dây polyguide chạy dọc 2 mép thân cửa",
    ],
    accent: "#0284c7",
  },
  {
    slug: "cua-cuon-trong-suot-polycarbonate-austdoor",
    name: "Cửa Cuốn Trong Suốt Polycarbonate Austdoor Siêu Bền (Showroom)",
    category: "Cửa cuốn trong suốt",
    summary: "Cửa cuốn nan Polycarbonate trong suốt lấy sáng 90%, độ bền gấp 250 lần kính thường, chịu va đập cực tốt, lý tưởng cho showroom và trung tâm thương mại.",
    price: "Từ 1.850.000đ/m²",
    warranty: "24 tháng",
    specs: [
      "Hãng sản xuất: Austdoor Group",
      "Chất liệu: Polycarbonate trong suốt + Khớp nối Inox 304",
      "Độ truyền sáng: 90% ánh sáng tự nhiên",
      "Độ bền: Chống va đập gấp 250 lần kính thường",
      "Bảo vệ: Chống tia UV không ố vàng",
    ],
    accent: "#38bdf8",
  },
  {
    slug: "cua-cuon-inox-304-cao-cap-sieu-ben",
    name: "Cửa Cuốn Inox 304 Cao Cấp Siêu Bền Chống Ăn Mòn",
    category: "Cửa cuốn công nghiệp",
    summary: "Cửa cuốn Inox 304 cao cấp chuyên dụng cho nhà xưởng, kho bãi, trung tâm thương mại và môi trường hóa chất, biển mặn chống rỉ sét tuyệt đối.",
    price: "Liên hệ",
    warranty: "36 tháng",
    specs: [
      "Vật liệu: 100% Inox 304 không gỉ",
      "Ứng dụng: Nhà xưởng, gara, trung tâm thương mại",
      "Độ bền: Chống ăn mòn, chịu lực gió bão cao",
    ],
    accent: "#94a3b8",
  },
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
    category: "Phụ kiện & linh kiện",
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

