export const repairIssues = [
  {
    title: "Cửa không lên / xuống",
    description: "Cửa bị kẹt, hoạt động chập chờn hoặc dừng giữa chừng.",
    icon: "/icons/issues/cua-khong-len-xuong.png",
  },
  {
    title: "Remote không hoạt động",
    description: "Remote bấm không nhận, mất tín hiệu hoặc phản hồi chậm.",
    icon: "/icons/issues/remote-khong-hoat-dong.png",
  },
  {
    title: "Motor phát tiếng kêu",
    description: "Motor kêu to, rung mạnh hoặc có dấu hiệu yếu tải.",
    icon: "/icons/issues/motor-phat-keu.png",
  },
  {
    title: "Cửa bị kẹt nan",
    description: "Nan cửa bị lệch, kẹt ray, đóng mở không đều.",
    icon: "/icons/issues/cua-bi-ket-nan.png",
  },
  {
    title: "Cửa bị lệch ray",
    description: "Ray dẫn hướng bị lệch, móp hoặc cửa vận hành không thẳng.",
    icon: "/icons/issues/cua-bi-ket-nan.png",
  },
  {
    title: "Bình lưu điện gặp lỗi",
    description: "Cửa không vận hành khi mất điện hoặc bình sạc không ổn định.",
    icon: "/icons/services/binh-luu-dien.png",
  },
] as const;

export const repairServices = [
  {
    title: "Sửa cửa cuốn bị kẹt",
    description: "Xử lý cửa kẹt nan, xổ lô, lệch ray, không lên xuống được.",
    price: "300.000 – 800.000đ",
    warranty: "3 – 6 tháng",
    icon: "/icons/services/sua-cua-bi-ket.png",
    image: "/services/sua-cua-bi-ket.png",
  },
  {
    title: "Sửa motor cửa cuốn",
    description: "Sửa motor kẹt cơ, hỏng tụ, cháy cuộn dây, thay vỉ mạch hành trình.",
    price: "350.000 – 800.000đ",
    warranty: "3 – 6 tháng",
    icon: "/icons/services/sua-motor.png",
    image: "/services/sua-motor.png",
  },
  {
    title: "Sửa remote & hộp nhận",
    description: "Khắc phục remote chập chờn, làm thêm remote mã gạt/nhảy, đổi mã khóa.",
    price: "150.000 – 550.000đ",
    warranty: "6 – 12 tháng",
    icon: "/icons/services/sua-remote.png",
    image: "/services/sua-remote.png",
  },
  {
    title: "Thay nan & lò xo cửa",
    description: "Gỡ xô nan, nắn phẳng nan móp gãy, thay bộ lò xo trợ lực kéo tay.",
    price: "800.000 – 1.500.000đ",
    warranty: "6 – 12 tháng",
    icon: "/icons/services/thay-nan.png",
    image: "/services/thay-nan.png",
  },
  {
    title: "Sửa ray & chỉnh hành trình",
    description: "Căn chỉnh, thay mới ray dẫn hướng bị lệch, móp, tra dầu mỡ bảo dưỡng.",
    price: "400.000 – 900.000đ",
    warranty: "3 – 6 tháng",
    icon: "/icons/services/sua-ray.png",
    image: "/services/sua-ray.png",
  },
  {
    title: "Sửa bình lưu điện (UPS)",
    description: "Sửa UPS lỗi không sạc, thay cặp ắc quy mới, thay bộ UPS chính hãng.",
    price: "350.000 – 1.200.000đ",
    warranty: "6 – 24 tháng",
    icon: "/icons/services/binh-luu-dien.png",
    image: "/services/binh-luu-dien.png",
  },
] as const;

export const servicePriceCategories = [
  {
    categoryTitle: "1. Bảng giá sửa chữa cơ bản & cứu hộ cửa cuốn",
    items: [
      { name: "Sửa cửa cuốn bị kẹt nan, xổ lô nhẹ", price: "300.000 – 800.000 VNĐ", warranty: "3 – 6 tháng" },
      { name: "Gỡ xô nan, nắn phẳng nan bị kẹt nặng", price: "800.000 – 1.500.000 VNĐ", warranty: "6 tháng" },
      { name: "Sửa ray cửa bị lệch, cong vênh, chỉnh hành trình", price: "400.000 – 900.000 VNĐ", warranty: "3 – 6 tháng" },
      { name: "Thay lò xo cửa cuốn kéo tay (theo bộ)", price: "800.000 – 1.900.000 VNĐ", warranty: "6 – 12 tháng" },
      { name: "Bảo dưỡng, vệ sinh, tra dầu mỡ toàn bộ cửa", price: "200.000 – 600.000 VNĐ", warranty: "Kiểm tra định kỳ" },
    ],
  },
  {
    categoryTitle: "2. Bảng giá sửa chữa & thay mới Motor",
    items: [
      { name: "Sửa motor bị kẹt cơ, hỏng tụ, cháy cuộn dây", price: "350.000 – 800.000 VNĐ", warranty: "3 – 6 tháng" },
      { name: "Thay tụ điện motor cửa cuốn", price: "300.000 – 500.000 VNĐ", warranty: "6 tháng" },
      { name: "Thay vỉ mạch/hành trình motor", price: "495.000 – 1.200.000 VNĐ", warranty: "6 – 12 tháng" },
      { name: "Thay mới motor cửa cuốn chính hãng (Austdoor, YH, Mitadoor...)", price: "1.500.000 – 3.500.000 VNĐ", warranty: "12 – 24 tháng" },
      { name: "Motor tải trọng lớn hoặc nhập khẩu cao cấp", price: "Từ 4.600.000 VNĐ", warranty: "12 – 24 tháng" },
    ],
  },
  {
    categoryTitle: "3. Bảng giá Remote & Hộp nhận tín hiệu",
    items: [
      { name: "Sửa remote lỗi mạch, lỗi mã phát sóng", price: "150.000 – 300.000 VNĐ", warranty: "3 – 6 tháng" },
      { name: "Làm thêm remote mã gạt thông dụng", price: "300.000 – 550.000 VNĐ", warranty: "6 – 12 tháng" },
      { name: "Làm thêm remote mã nhảy (ARC) chống sao chép", price: "400.000 – 650.000 VNĐ", warranty: "6 – 12 tháng" },
      { name: "Thay mới bộ hộp nhận + 2 remote điều khiển", price: "600.000 – 1.850.000 VNĐ", warranty: "12 tháng" },
      { name: "Reset, đổi mã khóa an toàn cửa cuốn", price: "200.000 – 350.000 VNĐ", warranty: "Hỗ trợ tận nơi" },
    ],
  },
  {
    categoryTitle: "4. Bảng giá sửa chữa Bộ lưu điện (UPS)",
    items: [
      { name: "Sửa UPS lỗi không sạc, lỗi mạch nguồn", price: "350.000 – 900.000 VNĐ", warranty: "3 – 6 tháng" },
      { name: "Thay ắc quy bộ lưu điện (01 cặp 2 bình chất lượng cao)", price: "800.000 – 1.200.000 VNĐ", warranty: "6 tháng" },
      { name: "Thay mới bộ lưu điện UPS chính hãng (900W – 1200W)", price: "2.200.000 – 2.900.000 VNĐ", warranty: "12 – 24 tháng" },
    ],
  },
];

export const directStores = [
  {
    branch: "Cơ sở 1 (Trụ sở Quận 10)",
    address: "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10, TP.HCM",
    hotline: "0327.359.368",
    note: "Cửa hàng trưng bày & Trung tâm kỹ thuật",
  },
  {
    branch: "Cơ sở 2 (Chi nhánh Quận 6)",
    address: "617 Phạm Văn Chí, P. Bình Tiên, Quận 6, TP.HCM",
    hotline: "0327.359.368",
    note: "Cửa hàng trưng bày & Điểm trực kỹ thuật",
  },
] as const;

export const districtChips = [
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Tân Phú",
  "Phú Nhuận",
  "Bình Tân",
  "TP. Thủ Đức",
  "Hóc Môn",
  "Bình Chánh",
  "Nhà Bè",
  "Củ Chi",
] as const;

export const serviceAreaPoints = [
  {
    district: "Quận 1",
    address: "128 Nguyễn Trãi, P. Bến Thành, Quận 1",
    note: "Trạm kỹ thuật trung tâm · Có mặt sau 15 – 20 phút",
  },
  {
    district: "Quận 2",
    address: "42 Trần Não, P. An Khánh, TP. Thủ Đức (Q.2 cũ)",
    note: "Trạm kỹ thuật khu Đông · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận 3",
    address: "215 Lý Chính Thắng, P. Võ Thị Sáu, Quận 3",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 20 phút",
  },
  {
    district: "Quận 4",
    address: "88 Hoàng Diệu, Phường 12, Quận 4",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận 5",
    address: "156 Trần Hưng Đạo, Phường 7, Quận 5",
    note: "Trạm trực kỹ thuật Chợ Lớn · Có mặt sau 15 – 20 phút",
  },
  {
    district: "Quận 6",
    address: "617 Phạm Văn Chí, P. Bình Tiên, Quận 6",
    note: "Cơ sở cửa hàng trực tiếp & Showroom · Có mặt ngay",
  },
  {
    district: "Quận 7",
    address: "75 Nguyễn Thị Thập, P. Tân Phong, Quận 7",
    note: "Trạm trực kỹ thuật Nam Sài Gòn · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận 8",
    address: "324 Phạm Thế Hiển, Phường 3, Quận 8",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận 9",
    address: "112 Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức (Q.9 cũ)",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 30 phút",
  },
  {
    district: "Quận 10",
    address: "361 Lý Thường Kiệt, P. Tân Hòa, Quận 10",
    note: "Trụ sở chính & Showroom trưng bày · Có mặt ngay",
  },
  {
    district: "Quận 11",
    address: "192 Lạc Long Quân, Phường 3, Quận 11",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 20 phút",
  },
  {
    district: "Quận 12",
    address: "184 Nguyễn Ảnh Thủ, P. Hiệp Thành, Quận 12",
    note: "Trạm trực kỹ thuật Q.12 · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận Bình Thạnh",
    address: "268 Bạch Đằng, Phường 24, Q. Bình Thạnh",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận Gò Vấp",
    address: "248 Quang Trung, Phường 10, Q. Gò Vấp",
    note: "Trạm trực kỹ thuật Gò Vấp · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận Tân Bình",
    address: "340 Trường Chinh, Phường 13, Q. Tân Bình",
    note: "Trạm trực kỹ thuật Tân Bình · Có mặt sau 15 – 20 phút",
  },
  {
    district: "Quận Tân Phú",
    address: "165 Lũy Bán Bích, P. Tân Thới Hòa, Q. Tân Phú",
    note: "Trạm trực kỹ thuật Tân Phú · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Quận Phú Nhuận",
    address: "52 Phan Đăng Lưu, Phường 5, Q. Phú Nhuận",
    note: "Trạm trực kỹ thuật · Có mặt sau 15 – 20 phút",
  },
  {
    district: "Quận Bình Tân",
    address: "410 Tên Lửa, P. Bình Trị Đông B, Q. Bình Tân",
    note: "Trạm trực kỹ thuật Bình Tân · Có mặt sau 15 – 25 phút",
  },
  {
    district: "TP. Thủ Đức",
    address: "68 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức",
    note: "Trạm trực kỹ thuật Thủ Đức · Có mặt sau 15 – 25 phút",
  },
  {
    district: "Huyện Hóc Môn",
    address: "74 Lý Thường Kiệt, TT. Hóc Môn, H. Hóc Môn",
    note: "Đội kỹ thuật lưu động tận nơi · Có mặt sau 20 – 30 phút",
  },
  {
    district: "Huyện Bình Chánh",
    address: "B12/9 Quốc Lộ 50, Xã Bình Hưng, H. Bình Chánh",
    note: "Đội kỹ thuật lưu động tận nơi · Có mặt sau 20 – 30 phút",
  },
  {
    district: "Huyện Nhà Bè",
    address: "182 Huỳnh Tấn Phát, TT. Nhà Bè, H. Nhà Bè",
    note: "Đội kỹ thuật lưu động tận nơi · Có mặt sau 20 – 30 phút",
  },
  {
    district: "Huyện Củ Chi",
    address: "55 Tỉnh Lộ 8, TT. Củ Chi, H. Củ Chi",
    note: "Đội kỹ thuật lưu động tận nơi · Có mặt sau 25 – 35 phút",
  },
] as const;

export const repairTips = [
  {
    tag: "Sự cố thường gặp",
    title: "Cửa cuốn bị kẹt nan nên làm gì?",
    excerpt: "Nhận biết nguyên nhân và các bước kiểm tra an toàn trước khi gọi kỹ thuật.",
    image: "/tips/ket-nan-nen-lam-gi.png",
  },
  {
    tag: "Motor cửa cuốn",
    title: "Dấu hiệu motor đang gặp vấn đề",
    excerpt: "Nhận biết sớm để sửa chữa kịp thời, tránh hư hỏng nặng hơn.",
    image: "/tips/dau-hieu-motor-gap-van-de.png",
  },
  {
    tag: "Remote cửa cuốn",
    title: "Remote cửa cuốn không hoạt động nên kiểm tra gì?",
    excerpt: "Các kiểm tra cơ bản, an toàn khi remote không nhận tín hiệu.",
    image: "/tips/remote-khong-hoat-dong.png",
  },
] as const;

export const trustItems = [
  {
    title: "Kinh nghiệm & chuyên nghiệp",
    description: "Kỹ thuật viên giàu kinh nghiệm, xử lý theo đúng tình trạng cửa.",
    icon: "/icons/trust/kinh-nghiem-chuyen-nghiep.png",
  },
  {
    title: "15 phút có mặt nhanh",
    description: "Kỹ thuật viên có mặt tận nơi nhanh chóng, xử lý kịp thời khi cửa gặp sự cố.",
    icon: "/icons/trust/co-mat-nhanh.png",
  },
  {
    title: "Bảo hành 12 - 24 tháng",
    description: "Bảo hành sửa chữa và các sản phẩm cửa cuốn thường từ 12 - 24 tháng rõ ràng.",
    icon: "/icons/trust/bao-hanh-ro-rang.png",
  },
  {
    title: "Giá hợp lý",
    description: "Báo giá trước khi sửa, hạn chế phát sinh ngoài thỏa thuận.",
    icon: "/icons/trust/gia-hop-ly.png",
  },
  {
    title: "Hỗ trợ tận tâm",
    description: "Tư vấn hướng xử lý phù hợp cho từng tình trạng cửa cuốn.",
    icon: "/icons/trust/ho-tro-tan-tam.png",
  },
] as const;
