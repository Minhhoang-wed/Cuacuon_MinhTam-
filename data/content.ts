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

export const services: Service[] = [
  {
    slug: "cua-cuon-khong-hoat-dong",
    name: "Cửa cuốn không hoạt động",
    summary: "Kiểm tra nguồn, cầu chì, motor, bộ nhận tín hiệu và xử lý đúng nguyên nhân.",
    price: "200.000 – 500.000đ",
    duration: "30–60 phút",
    warranty: "3–6 tháng",
    symptoms: ["Bấm remote nhưng cửa không chạy", "Cửa dừng giữa hành trình", "Motor không phát tiếng", "Có điện nhưng hộp nhận không sáng"],
    process: ["Đo nguồn và kiểm tra dây dẫn", "Kiểm tra hộp nhận, remote và cầu chì", "Đo motor và bộ phanh", "Báo phương án trước khi sửa"],
  },
  {
    slug: "cua-cuon-ket-nan-so-lo",
    name: "Kẹt nan, lệch ray, sổ lô",
    summary: "Xử lý cửa kẹt, cong nan, cuốn lên hộp hoặc rơi khỏi ray dẫn hướng.",
    price: "300.000 – 1.200.000đ",
    duration: "45–120 phút",
    warranty: "3–6 tháng",
    symptoms: ["Cửa chạy giật cục", "Nan cửa bị xô hoặc cong", "Cửa cuốn quá hành trình", "Cửa phát tiếng va đập lớn"],
    process: ["Cô lập nguồn, giữ an toàn thân cửa", "Căn lại ray và trục cuốn", "Thay nan hỏng nếu cần", "Chạy thử đủ hành trình"],
  },
  {
    slug: "sua-motor-cua-cuon",
    name: "Sửa motor cửa cuốn",
    summary: "Khắc phục motor yếu, kêu rít, nóng bất thường hoặc bộ phanh không giữ cửa.",
    price: "Liên hệ khảo sát",
    duration: "60–150 phút",
    warranty: "6–12 tháng",
    symptoms: ["Motor chạy yếu hoặc nóng", "Cửa tự trôi xuống", "Motor kêu nhưng cửa không lên", "Mùi khét hoặc nhảy aptomat"],
    process: ["Kiểm tra tải và nguồn cấp", "Đo tụ, cuộn dây và bộ phanh", "Sửa hoặc đề xuất thay thế", "Cân hành trình và tải"],
  },
  {
    slug: "sua-remote-hop-dieu-khien",
    name: "Remote & hộp điều khiển",
    summary: "Sửa hộp nhận, cài remote mới, sao chép remote và khắc phục mất tín hiệu.",
    price: "100.000 – 650.000đ",
    duration: "20–60 phút",
    warranty: "3–6 tháng",
    symptoms: ["Remote chập chờn", "Mất hoặc cần thêm remote", "Hộp nhận báo lỗi", "Cửa tự chạy không kiểm soát"],
    process: ["Kiểm tra tần số và nguồn hộp nhận", "Xóa mã lạ nếu cần", "Cài đặt thiết bị tương thích", "Bàn giao và hướng dẫn sử dụng"],
  },
  {
    slug: "sua-luu-dien-ups",
    name: "Lưu điện cửa cuốn",
    summary: "Kiểm tra ắc quy, mạch sạc, relay và khả năng vận hành cửa khi mất điện.",
    price: "250.000 – 1.500.000đ",
    duration: "30–90 phút",
    warranty: "3–12 tháng",
    symptoms: ["Mất điện cửa không chạy", "UPS kêu liên tục", "Không tích điện", "Ắc quy phồng hoặc nóng"],
    process: ["Đo điện áp và dung lượng ắc quy", "Kiểm tra mạch sạc, inverter", "Sửa hoặc thay phần hỏng", "Mô phỏng mất điện để thử tải"],
  },
  {
    slug: "bao-tri-cua-cuon",
    name: "Bảo trì định kỳ",
    summary: "Vệ sinh, cân chỉnh, tra dầu và rà soát an toàn toàn bộ hệ thống cửa.",
    price: "450.000 – 900.000đ",
    duration: "45–90 phút",
    warranty: "Biên bản kiểm tra",
    symptoms: ["Cửa kêu to dần", "Chạy chậm hoặc không đều", "Lâu ngày chưa kiểm tra", "Cửa có dấu hiệu lệch nhẹ"],
    process: ["Kiểm tra tổng thể", "Vệ sinh ray và thân cửa", "Cân chỉnh, bôi trơn đúng vị trí", "Ghi nhận hạng mục cần theo dõi"],
  },
];

export const products: Product[] = [
  { slug: "motor-amt-500", name: "Motor AMT 500", category: "Motor cửa cuốn", summary: "Motor tải trung cho nhà phố, vận hành ổn định và có xích kéo tay.", price: "Liên hệ", warranty: "24 tháng", specs: ["Tải tham khảo 500 kg", "Nguồn 220V", "Có phanh chống trôi", "Phụ kiện lắp đặt đồng bộ"], accent: "#b9f5dc" },
  { slug: "ups-safe-1000", name: "UPS Safe 1000", category: "Bộ lưu điện", summary: "Duy trì vận hành cửa cuốn khi mất điện, phù hợp cửa gia đình.", price: "3.200.000đ", warranty: "12 tháng", specs: ["Công suất tham khảo 1000VA", "Tự động chuyển nguồn", "Cảnh báo ắc quy yếu", "Vỏ kim loại tản nhiệt"], accent: "#d9f99d" },
  { slug: "hop-nhan-amt-smart", name: "Hộp nhận AMT Smart", category: "Bộ điều khiển", summary: "Bộ nhận tín hiệu ổn định, hỗ trợ khóa mã và cài nhiều remote.", price: "1.450.000đ", warranty: "12 tháng", specs: ["Nguồn 220V", "Chống sao chép mã cơ bản", "Học lệnh nhanh", "Kèm 2 remote"], accent: "#ffdfd5" },
  { slug: "remote-amt-mini", name: "Remote AMT Mini", category: "Tay điều khiển", summary: "Thiết kế nhỏ gọn, phím bấm rõ và tương thích nhiều hộp nhận.", price: "350.000đ", warranty: "6 tháng", specs: ["4 phím chức năng", "Pin phổ thông", "Có nắp trượt", "Cài đặt tại chỗ"], accent: "#dce9ff" },
  { slug: "cam-bien-dao-chieu", name: "Cảm biến đảo chiều", category: "An toàn", summary: "Phát hiện vật cản để hỗ trợ dừng hoặc đảo chiều cửa khi đóng.", price: "Liên hệ", warranty: "12 tháng", specs: ["Cặp mắt thu phát", "Tầm hoạt động linh hoạt", "Đèn báo trạng thái", "Phù hợp nhiều hệ điều khiển"], accent: "#f3e2ff" },
  { slug: "nan-nhom-amt-a50", name: "Nan nhôm AMT A50", category: "Thân cửa", summary: "Nan nhôm hai lớp có khe thoáng, phù hợp nhà phố và cửa hàng.", price: "Theo kích thước", warranty: "Theo hợp đồng", specs: ["Hợp kim nhôm", "Sơn tĩnh điện", "Màu sắc tùy chọn", "Gia công theo kích thước"], accent: "#e5e7eb" },
];

export const projects: Project[] = [
  { slug: "bao-tri-cua-cuon-showroom-quan-7", name: "Bảo trì hệ cửa showroom", location: "Quận 7, TP.HCM", category: "Bảo trì", summary: "Rà soát 4 bộ cửa, căn hành trình và thay các chi tiết hao mòn.", result: "Hoàn tất trong ngày, bàn giao biên bản từng cửa.", accent: "#0f766e" },
  { slug: "thay-motor-nha-pho-thu-duc", name: "Thay motor nhà phố", location: "TP. Thủ Đức", category: "Sửa chữa", summary: "Motor cũ yếu tải, bộ phanh mòn khiến cửa vận hành không ổn định.", result: "Thay motor đồng bộ, chạy thử tải và hướng dẫn kéo tay.", accent: "#f46f51" },
  { slug: "lap-cua-cuon-cua-hang-tan-binh", name: "Lắp cửa cuốn cửa hàng", location: "Quận Tân Bình", category: "Lắp đặt", summary: "Khảo sát, gia công và lắp hệ cửa mới cho mặt tiền kinh doanh.", result: "Tối ưu khe sáng, độ êm và lịch thi công ngoài giờ bán hàng.", accent: "#9bc3ff" },
];

export const articles: Article[] = [
  { slug: "5-dau-hieu-can-bao-tri-cua-cuon", title: "5 dấu hiệu cửa cuốn cần được bảo trì sớm", excerpt: "Tiếng kêu, độ rung và thời gian đóng mở đang cho bạn biết điều gì?", category: "Bảo trì", date: "12/08/2026", readTime: "5 phút", content: ["Cửa cuốn thường xuống cấp từ từ. Tiếng kêu lớn hơn, cửa chạy chậm, rung ở một vị trí cố định hoặc remote phản hồi chập chờn đều là tín hiệu nên kiểm tra sớm.", "Không nên tự bôi dầu vào mọi vị trí. Một số bộ phận cần giữ khô, còn ray dẫn hướng cần vệ sinh trước khi sử dụng chất bôi trơn phù hợp.", "Bảo trì định kỳ giúp phát hiện nan lệch, phanh motor mòn và dây dẫn lão hóa trước khi chúng trở thành sự cố dừng cửa hoàn toàn." ] },
  { slug: "lam-gi-khi-cua-cuon-bi-ket", title: "Làm gì khi cửa cuốn bị kẹt giữa hành trình?", excerpt: "Ba bước an toàn cần làm trước khi gọi kỹ thuật viên tới kiểm tra.", category: "An toàn", date: "05/08/2026", readTime: "4 phút", content: ["Dừng thao tác remote ngay khi cửa phát tiếng bất thường hoặc nghiêng lệch. Việc cố đóng mở nhiều lần có thể làm nan cong và tăng mức độ hư hỏng.", "Giữ người và đồ vật cách xa vùng cửa. Nếu thân cửa có dấu hiệu rơi hoặc sổ ray, không đứng phía dưới để quan sát.", "Chụp ảnh tình trạng, ghi lại âm thanh bất thường và gửi kèm yêu cầu. Những thông tin này giúp kỹ thuật viên chuẩn bị dụng cụ phù hợp trước khi đến." ] },
  { slug: "chon-luu-dien-cua-cuon", title: "Chọn lưu điện cửa cuốn theo nhu cầu thực tế", excerpt: "Không chỉ nhìn công suất: tải cửa, tần suất dùng và tuổi ắc quy đều quan trọng.", category: "Thiết bị", date: "28/07/2026", readTime: "6 phút", content: ["Bộ lưu điện cần phù hợp với công suất motor và tải thực tế của cửa. Thiết bị quá nhỏ có thể không kéo được cửa, trong khi thiết bị quá lớn gây lãng phí.", "Tần suất mất điện và số lần cần đóng mở trong thời gian mất điện cũng ảnh hưởng đến lựa chọn dung lượng ắc quy.", "Nên kiểm tra khả năng chuyển nguồn và thử tải định kỳ. Ắc quy vẫn có thể hiển thị đầy nhưng sụt áp mạnh khi motor bắt đầu chạy." ] },
];

export function getService(slug: string) { return services.find((item) => item.slug === slug); }
export function getProduct(slug: string) { return products.find((item) => item.slug === slug); }
export function getProject(slug: string) { return projects.find((item) => item.slug === slug); }
export function getArticle(slug: string) { return articles.find((item) => item.slug === slug); }
