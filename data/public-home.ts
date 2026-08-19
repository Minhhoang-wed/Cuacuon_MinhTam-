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
    description: "Xử lý cửa kẹt nan, kẹt ray, không lên xuống được.",
    icon: "/icons/services/sua-cua-bi-ket.png",
    image: "/services/sua-cua-bi-ket.png",
  },
  {
    title: "Sửa motor cửa cuốn",
    description: "Kiểm tra motor yếu, không hoạt động hoặc phát tiếng kêu.",
    icon: "/icons/services/sua-motor.png",
    image: "/services/sua-motor.png",
  },
  {
    title: "Sửa remote cửa cuốn",
    description: "Khắc phục remote chập chờn, mất tín hiệu hoặc không nhận.",
    icon: "/icons/services/sua-remote.png",
    image: "/services/sua-remote.png",
  },
  {
    title: "Thay nan cửa cuốn",
    description: "Thay nan móp, gãy, rỉ sét hoặc xuống cấp.",
    icon: "/icons/services/thay-nan.png",
    image: "/services/thay-nan.png",
  },
  {
    title: "Sửa ray dẫn hướng",
    description: "Căn chỉnh, thay mới ray dẫn hướng bị lệch hoặc móp.",
    icon: "/icons/services/sua-ray.png",
    image: "/services/sua-ray.png",
  },
  {
    title: "Kiểm tra bình lưu điện",
    description: "Kiểm tra, sửa chữa hoặc thay mới bình lưu điện phù hợp.",
    icon: "/icons/services/binh-luu-dien.png",
    image: "/services/binh-luu-dien.png",
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
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Tân Phú",
  "Phú Nhuận",
  "Bình Tân",
  "Thủ Đức",
] as const;

// Area labels only, not production addresses.
export const serviceAreaPoints = [
  "Khu vực Quận 1 - TP.HCM",
  "Khu vực Quận 2 - TP.HCM",
  "Khu vực Quận 3 - TP.HCM",
  "Khu vực Quận 4 - TP.HCM",
  "Khu vực Quận 5 - TP.HCM",
  "Khu vực Quận 6 - TP.HCM",
  "Khu vực Quận 7 - TP.HCM",
  "Khu vực Quận 8 - TP.HCM",
  "Khu vực Quận 10 - TP.HCM",
  "Khu vực Quận 11 - TP.HCM",
  "Khu vực Quận 12 - TP.HCM",
  "Khu vực Bình Thạnh - TP.HCM",
  "Khu vực Gò Vấp - TP.HCM",
  "Khu vực Tân Bình - TP.HCM",
  "Khu vực Tân Phú - TP.HCM",
  "Khu vực Phú Nhuận - TP.HCM",
  "Khu vực Bình Tân - TP.HCM",
  "Khu vực Thủ Đức - TP.HCM",
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
    title: "Tiếp nhận nhanh",
    description: "Tư vấn tình trạng rõ ràng trước khi hẹn lịch kiểm tra.",
    icon: "/icons/trust/co-mat-nhanh.png",
  },
  {
    title: "Bảo hành rõ ràng",
    description: "Nội dung sửa chữa, thay thế và bảo hành được trao đổi minh bạch.",
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
