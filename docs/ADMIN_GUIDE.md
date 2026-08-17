# Hướng dẫn quản trị Website Cửa Cuốn An Tâm 24H

## 1. Đăng nhập

Truy cập `/admin/login`, nhập email và mật khẩu đã được cấp. Chỉ tài khoản có trong danh sách quản trị mới vào được CMS. Hãy đăng xuất sau khi dùng máy chung và không chia sẻ mật khẩu qua tin nhắn công khai.

## 2. Quản lý sản phẩm

Vào **Sản phẩm** để xem toàn bộ catalog.

- **Tạo sản phẩm:** chọn “Thêm sản phẩm”, nhập tên, slug, danh mục, mô tả, giá hiển thị, trạng thái và nội dung SEO.
- **Sửa sản phẩm:** chọn sản phẩm trong danh sách. Có thể thêm/xóa thông số và tải nhiều ảnh.
- **Ảnh đại diện:** ảnh có thứ tự nhỏ nhất được ưu tiên hiển thị ngoài danh sách.
- **Ẩn sản phẩm:** chuyển trạng thái khỏi “Đã đăng” khi chưa muốn khách nhìn thấy.
- **Xóa:** chỉ dùng khi chắc chắn không cần khôi phục; nên ẩn trước để kiểm tra ảnh hưởng.

Slug nên viết thường, không dấu và dùng dấu gạch ngang, ví dụ `motor-cua-cuon-500kg`.

## 3. Quản lý danh mục

Vào **Danh mục** để tạo nhóm sản phẩm và chỉnh thứ tự hiển thị. Không nên xóa danh mục đang có sản phẩm; hãy chuyển sản phẩm sang danh mục khác trước.

## 4. Thư viện ảnh

Vào **Thư viện** để tải ảnh dùng chung. Nên dùng JPG/WebP, tên file dễ hiểu, ảnh ngang cho banner và ảnh vuông hoặc 4:3 cho sản phẩm. Nén ảnh trước khi tải để website mở nhanh hơn.

Xóa ảnh khỏi thư viện có thể làm mất hình ở nơi đang sử dụng URL đó. Hãy kiểm tra sản phẩm trước khi xóa.

## 5. Nội dung trang chủ

Vào **Trang chủ** để chỉnh tiêu đề chính, đoạn giới thiệu, nhãn nút và các số liệu nổi bật. Sau khi lưu, mở trang chủ trong tab mới và kiểm tra trên cả máy tính lẫn điện thoại.

## 6. Thông tin doanh nghiệp

Vào **Cài đặt** để cập nhật thương hiệu, hotline, Zalo, email, địa chỉ, Maps và nội dung SEO mặc định. Dùng số điện thoại chỉ gồm chữ số cho liên kết gọi; dùng URL đầy đủ cho Zalo và Maps.

## 7. Quy trình xuất bản an toàn

1. Chuẩn bị nội dung và ảnh đã được duyệt.
2. Tạo hoặc chỉnh nội dung ở trạng thái ẩn.
3. Kiểm tra chính tả, giá, thông số, đường dẫn và ảnh.
4. Chuyển sang trạng thái công khai.
5. Mở trang public để kiểm tra lại.

## 8. Xử lý sự cố thường gặp

- **Không đăng nhập được:** kiểm tra đúng email, mật khẩu và email đã được thêm vào `admin_users`.
- **Lưu không thành công:** kiểm tra kết nối mạng, cấu hình Supabase và quyền tài khoản.
- **Ảnh không hiển thị:** kiểm tra bucket `site-media`, URL ảnh và chính sách Storage.
- **Trang public chưa đổi ngay:** tải lại trang sau vài giây; thao tác lưu CMS đã kích hoạt làm mới bộ nhớ đệm.
- **Form không gửi được ở website thật:** kiểm tra `SERVICE_REQUEST_WEBHOOK_URL`, token và nhật ký endpoint nhận dữ liệu.

## 9. Sao lưu và bảo mật

- Bật sao lưu theo gói Supabase đang sử dụng.
- Định kỳ xuất dữ liệu quan trọng và lưu ở nơi an toàn.
- Chỉ cấp quyền cho người cần dùng, thu hồi tài khoản khi nhân sự thay đổi.
- Bật MFA cho tài khoản Supabase của đội kỹ thuật.
- Không gửi khóa bí mật qua email hoặc nhóm chat đông người.
