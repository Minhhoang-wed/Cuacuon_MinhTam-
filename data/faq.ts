import type { FaqItem } from "@/components/structured-data";

/**
 * FAQ data for service pages — these will render as FAQPage JSON-LD
 * for Google rich snippets (accordion dropdown on search results).
 */
export const serviceFaqs: FaqItem[] = [
  {
    question: "Sửa cửa cuốn giá bao nhiêu?",
    answer:
      "Chi phí sửa cửa cuốn tùy thuộc vào loại lỗi và mức độ hư hỏng. Các lỗi phổ biến như kẹt ray, đứt dây curoa, hư remote có giá từ 150.000đ – 500.000đ. Motor hư hoặc cần thay thế từ 1.500.000đ – 4.500.000đ. Kỹ thuật viên sẽ khảo sát thực tế và báo giá chính xác trước khi sửa.",
  },
  {
    question: "Bao lâu kỹ thuật viên có mặt?",
    answer:
      "Kỹ thuật viên Minh Tâm Door túc trực tại các quận huyện TP.HCM, có mặt trong vòng 15 – 30 phút sau khi tiếp nhận yêu cầu. Dịch vụ tiếp nhận 24/7 kể cả ngày lễ, Chủ Nhật.",
  },
  {
    question: "Có bảo hành sau khi sửa không?",
    answer:
      "Có. Tất cả dịch vụ sửa chữa đều được bảo hành từ 3 – 24 tháng tùy hạng mục. Phụ kiện thay thế là hàng chính hãng, có đầy đủ chứng nhận xuất xưởng CO/CQ.",
  },
  {
    question: "Sửa cửa cuốn vào ban đêm có được không?",
    answer:
      "Được. Minh Tâm Door tiếp nhận yêu cầu sửa chữa và cứu hộ cửa cuốn 24/7, kể cả ngoài giờ hành chính, ban đêm, ngày lễ và Chủ Nhật. Quý khách chỉ cần gọi hotline hoặc nhắn Zalo để được hỗ trợ ngay.",
  },
  {
    question: "Cửa cuốn bị kẹt, không lên xuống được phải làm sao?",
    answer:
      "Khi cửa cuốn bị kẹt, quý khách nên: (1) Tắt nguồn điện motor ngay lập tức, (2) Không cố kéo bằng tay vì có thể gây hư thêm, (3) Gọi ngay kỹ thuật viên Minh Tâm Door qua hotline 0327.359.368 để được hỗ trợ khẩn cấp. Kỹ thuật viên sẽ khảo sát nguyên nhân kẹt (ray lệch, dây curoa đứt, motor hư) và xử lý tận nơi.",
  },
  {
    question: "Có cần đặt cọc trước khi sửa không?",
    answer:
      "Không. Kỹ thuật viên khảo sát và báo giá minh bạch tại chỗ. Quý khách chỉ thanh toán sau khi công việc hoàn tất và chạy thử thành công. Không phát sinh chi phí ngoài báo giá.",
  },
  {
    question: "Minh Tâm Door phục vụ những khu vực nào?",
    answer:
      "Minh Tâm Door phục vụ tất cả các quận huyện tại TP. Hồ Chí Minh và khu vực lân cận, bao gồm: Quận 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Bình Thạnh, Phú Nhuận, Tân Bình, Tân Phú, Gò Vấp, Bình Tân, Thủ Đức và các huyện ngoại thành.",
  },
];
