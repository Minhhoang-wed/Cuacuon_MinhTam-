-- Migration: Seed 6 Genuine Products for Each Category
-- Description: Adds 1 authentic, high-quality product for each category with specifications and images

DO $$
DECLARE
  v_cat_motor UUID;
  v_cat_ups UUID;
  v_cat_controller UUID;
  v_cat_remote UUID;
  v_cat_safety UUID;
  v_cat_door UUID;
  
  v_prod_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_cat_motor FROM public.categories WHERE slug = 'motor-cua-cuon' LIMIT 1;
  SELECT id INTO v_cat_ups FROM public.categories WHERE slug = 'bo-luu-dien' LIMIT 1;
  SELECT id INTO v_cat_controller FROM public.categories WHERE slug = 'bo-dieu-khien' LIMIT 1;
  SELECT id INTO v_cat_remote FROM public.categories WHERE slug = 'tay-dieu-khien' LIMIT 1;
  SELECT id INTO v_cat_safety FROM public.categories WHERE slug = 'an-toan' LIMIT 1;
  SELECT id INTO v_cat_door FROM public.categories WHERE slug = 'than-cua' LIMIT 1;

  -----------------------------------------------------------------------------
  -- 1. MOTOR CỬA CUỐN: Motor Austdoor AH500 Lõi Đồng Chính Hãng (500kg)
  -----------------------------------------------------------------------------
  IF v_cat_motor IS NOT NULL THEN
    INSERT INTO public.products (
      category_id, name, slug, short_description, description,
      price_mode, price_amount, price_label, currency, warranty,
      is_featured, status, sort_order, seo_title, seo_description, accent
    ) VALUES (
      v_cat_motor,
      'Motor Cửa Cuốn Austdoor AH500 Lõi Đồng Chính Hãng (Tải Trọng 500kg)',
      'motor-cua-cuon-austdoor-ah500-chinh-hang',
      'Động cơ Austdoor AH500 100% lõi đồng nguyên chất, vận hành siêu êm, tích hợp công nghệ chống sao chép ARC Austmatic và rơ-le tự ngắt khi quá nhiệt.',
      'Motor Austdoor AH500 là dòng motor cửa cuốn cao cấp được sản xuất theo dây chuyền công nghệ tiêu chuẩn của Tập đoàn Austdoor. Thiết bị sử dụng 100% dây đồng nguyên chất giúp động cơ hoạt động bền bỉ, không bị nóng máy khi đóng mở liên tục. Tích hợp hộp điều khiển mã nhảy Austmatic Rolling Code (ARC) chống sao chép và xích kéo trợ lực dễ dàng vận hành bằng tay khi cúp điện.',
      'exact', 4850000, '4.850.000đ', 'VND', '24 tháng',
      true, 'published', 1,
      'Motor Cửa Cuốn Austdoor AH500 Lõi Đồng Chính Hãng',
      'Báo giá lắp đặt Motor Cửa Cuốn Austdoor AH500 tải trọng 500kg dây đồng, bảo hành 24 tháng chính hãng.',
      '#10b981'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      price_mode = EXCLUDED.price_mode,
      price_amount = EXCLUDED.price_amount,
      price_label = EXCLUDED.price_label,
      warranty = EXCLUDED.warranty,
      is_featured = EXCLUDED.is_featured,
      status = EXCLUDED.status,
      accent = EXCLUDED.accent
    RETURNING id INTO v_prod_id;

    -- Images
    DELETE FROM public.product_images WHERE product_id = v_prod_id;
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES (v_prod_id, '/products/motor-cua-cuon-austdoor-ah500.jpg', 'Motor Cửa Cuốn Austdoor AH500 Lõi Đồng Chính Hãng', 0, true);

    -- Specs
    DELETE FROM public.product_specs WHERE product_id = v_prod_id;
    INSERT INTO public.product_specs (product_id, spec_name, spec_value, group_name, sort_order) VALUES
    (v_prod_id, 'Hãng sản xuất', 'Austdoor Group', 'Thông số kỹ thuật', 0),
    (v_prod_id, 'Tải trọng nâng tối đa', '500 kg (cho cửa dưới 22m²)', 'Thông số kỹ thuật', 1),
    (v_prod_id, 'Lõi cuộn dây', '100% Đồng nguyên chất chịu nhiệt cao', 'Thông số kỹ thuật', 2),
    (v_prod_id, 'Điện áp sử dụng', '220V / 50Hz', 'Thông số kỹ thuật', 3),
    (v_prod_id, 'Công suất tiêu thụ', '370W', 'Thông số kỹ thuật', 4),
    (v_prod_id, 'Tính năng an toàn', 'Tự ngắt khi quá tải, chống sao chép sóng ARC', 'Tính năng nổi bật', 5),
    (v_prod_id, 'Phụ kiện đi kèm', 'Thân motor, mặt bích, xích kéo tay, hộp nhận + 2 remote', 'Phụ kiện', 6);
  END IF;

  -----------------------------------------------------------------------------
  -- 2. BỘ LƯU ĐIỆN: Bộ Lưu Điện Cửa Cuốn Titadoor TU5 800VA Chính Hãng (Lưu 48 Giờ)
  -----------------------------------------------------------------------------
  IF v_cat_ups IS NOT NULL THEN
    INSERT INTO public.products (
      category_id, name, slug, short_description, description,
      price_mode, price_amount, price_label, currency, warranty,
      is_featured, status, sort_order, seo_title, seo_description, accent
    ) VALUES (
      v_cat_ups,
      'Bộ Lưu Điện Cửa Cuốn Titadoor TU5 800VA Chính Hãng (Ắc Quy Globe Siêu Bền)',
      'bo-luu-dien-cua-cuon-titadoor-tu5-chinh-hang',
      'Bộ lưu điện Titadoor TU5 công suất 800VA trang bị 2 bình ắc quy Globe 12V-7.5Ah chuyên dụng, duy trì hoạt động cửa 48h khi mất điện kèm mạch sạc xả tự động.',
      'Bộ lưu điện Titadoor TU-5 là thiết bị cấp nguồn dự phòng cao cấp dành cho motor cửa cuốn tải trọng dưới 600kg. Sản phẩm sử dụng bình ắc quy khô Globe kín khí công nghệ cao, tự động chuyển đổi nguồn điện mượt mà khi điện lưới bị cắt mà không gây gián đoạn hay kẹt cửa. Hệ thống vi xử lý thông minh tự động xả và sạc bảo dưỡng ắc quy định kỳ giúp kéo dài tuổi thọ bình lên đến 3-5 năm.',
      'exact', 2850000, '2.850.000đ', 'VND', '12 tháng (đổi mới 6 tháng)',
      true, 'published', 2,
      'Bộ Lưu Điện Cửa Cuốn Titadoor TU5 800VA Chính Hãng',
      'Bán bộ lưu điện Titadoor TU5 lưu điện 48 giờ cho motor cửa cuốn, chính hãng 100%, bảo hành 12 tháng.',
      '#06b6d4'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      price_mode = EXCLUDED.price_mode,
      price_amount = EXCLUDED.price_amount,
      price_label = EXCLUDED.price_label,
      warranty = EXCLUDED.warranty,
      is_featured = EXCLUDED.is_featured,
      status = EXCLUDED.status,
      accent = EXCLUDED.accent
    RETURNING id INTO v_prod_id;

    -- Images
    DELETE FROM public.product_images WHERE product_id = v_prod_id;
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES (v_prod_id, '/products/bo-luu-dien-titadoor-tu5.jpg', 'Bộ Lưu Điện Cửa Cuốn Titadoor TU5 800VA Chính Hãng', 0, true);

    -- Specs
    DELETE FROM public.product_specs WHERE product_id = v_prod_id;
    INSERT INTO public.product_specs (product_id, spec_name, spec_value, group_name, sort_order) VALUES
    (v_prod_id, 'Hãng sản xuất', 'Titadoor Power Systems', 'Thông số kỹ thuật', 0),
    (v_prod_id, 'Công suất danh định', '800VA / 500W', 'Thông số kỹ thuật', 1),
    (v_prod_id, 'Dung lượng ắc quy', '2 bình Globe 12V - 7.5Ah kín khí', 'Thông số kỹ thuật', 2),
    (v_prod_id, 'Thời gian lưu trữ', '48 giờ sau khi cúp điện', 'Hiệu năng', 3),
    (v_prod_id, 'Số lần đóng mở dự phòng', '15 - 20 lần đóng mở liên tục', 'Hiệu năng', 4),
    (v_prod_id, 'Tính năng thông minh', 'Tự động ngắt khi sạc đầy, chống phóng kiệt bình', 'Bảo vệ', 5);
  END IF;

  -----------------------------------------------------------------------------
  -- 3. BỘ ĐIỀU KHIỂN: Bộ Điều Khiển Cửa Cuốn Titadoor Kèm 2 Remote Mã Nhảy Chống Trộm
  -----------------------------------------------------------------------------
  IF v_cat_controller IS NOT NULL THEN
    INSERT INTO public.products (
      category_id, name, slug, short_description, description,
      price_mode, price_amount, price_label, currency, warranty,
      is_featured, status, sort_order, seo_title, seo_description, accent
    ) VALUES (
      v_cat_controller,
      'Bộ Điều Khiển Cửa Cuốn Titadoor Kèm 2 Remote Mã Nhảy Chống Sao Chép',
      'bo-dieu-khien-cua-cuon-titadoor-ma-nhay-chinh-hang',
      'Hộp nhận tín hiệu Titadoor sóng 433MHz Rolling Code mã nhảy bảo mật cao, khoảng cách bắt sóng lên tới 100m, chống phá khóa và chống máy dò sóng 100%.',
      'Bộ điều khiển cửa cuốn Titadoor chính hãng là giải pháp an ninh tối ưu cho ngôi nhà của bạn. Với công nghệ mã hóa Rolling Code thay đổi hàng tỷ mã sau mỗi lần bấm, thiết bị vô hiệu hóa hoàn toàn mọi thiết bị dò mã của kẻ gian. Hộp nhận có rơ-le chịu tải cao, nhận sóng cực nhạy xuyên qua tường bê tông và cửa kính.',
      'exact', 1350000, '1.350.000đ', 'VND', '12 tháng',
      true, 'published', 3,
      'Bộ Điều Khiển Cửa Cuốn Titadoor Kèm 2 Remote Mã Nhảy',
      'Cung cấp bộ hộp nhận điều khiển Titadoor chính hãng kèm 2 tay remote inox mã nhảy chống trộm tuyệt đối.',
      '#6366f1'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      price_mode = EXCLUDED.price_mode,
      price_amount = EXCLUDED.price_amount,
      price_label = EXCLUDED.price_label,
      warranty = EXCLUDED.warranty,
      is_featured = EXCLUDED.is_featured,
      status = EXCLUDED.status,
      accent = EXCLUDED.accent
    RETURNING id INTO v_prod_id;

    -- Images
    DELETE FROM public.product_images WHERE product_id = v_prod_id;
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES (v_prod_id, '/products/bo-dieu-khien-titadoor-chinh-hang.jpg', 'Bộ Điều Khiển Cửa Cuốn Titadoor Kèm 2 Remote Mã Nhảy', 0, true);

    -- Specs
    DELETE FROM public.product_specs WHERE product_id = v_prod_id;
    INSERT INTO public.product_specs (product_id, spec_name, spec_value, group_name, sort_order) VALUES
    (v_prod_id, 'Hãng sản xuất', 'Titadoor Tech', 'Thông số kỹ thuật', 0),
    (v_prod_id, 'Tần số thu phát sóng', '433.92 MHz Rolling Code (Mã nhảy)', 'Thông số kỹ thuật', 1),
    (v_prod_id, 'Khoảng cách nhận sóng', '50m - 100m (không vật cản)', 'Hiệu năng', 2),
    (v_prod_id, 'Khả năng lưu trữ', 'Lên đến 20 remote cùng lúc', 'Tính năng', 3),
    (v_prod_id, 'Bộ sản phẩm gồm', '1 hộp nhận + 2 tay điều khiển inox + jack cắm nối motor', 'Quy cách', 4);
  END IF;

  -----------------------------------------------------------------------------
  -- 4. TAY ĐIỀU KHIỂN: Tay Điều Khiển Remote Cửa Cuốn Austdoor DK1 Chính Hãng
  -----------------------------------------------------------------------------
  IF v_cat_remote IS NOT NULL THEN
    INSERT INTO public.products (
      category_id, name, slug, short_description, description,
      price_mode, price_amount, price_label, currency, warranty,
      is_featured, status, sort_order, seo_title, seo_description, accent
    ) VALUES (
      v_cat_remote,
      'Tay Điều Khiển Remote Cửa Cuốn Austdoor DK1 Nắp Trượt Kim Loại',
      'tay-dieu-khien-remote-austdoor-dk1-chinh-hang',
      'Khóa điều khiển từ xa Austdoor DK1 chính hãng, 4 nút bấm tiện dụng, công nghệ mã nhảy Austmatic ARC, viền inox chống va đập và chống nước nhẹ.',
      'Tay điều khiển từ xa Austdoor DK1 là dòng remote chính hãng cao cấp của Austdoor. Sở hữu kiểu dáng bo tròn tinh tế, phím bấm nảy êm tay và có nắp trượt chống bấm nhầm khi để trong túi xách hay túi quần. Tích hợp chip vi xử lý phát mã nhảy ngẫu nhiên mỗi lần bấm, bảo vệ an ninh tối đa cho ngôi nhà.',
      'exact', 380000, '380.000đ', 'VND', '12 tháng',
      true, 'published', 4,
      'Tay Điều Khiển Remote Cửa Cuốn Austdoor DK1 Chính Hãng',
      'Mua remote cửa cuốn Austdoor DK1 chính hãng nắp trượt kim loại, hỗ trợ cài đặt mã tận nơi tại TP.HCM.',
      '#ec4899'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      price_mode = EXCLUDED.price_mode,
      price_amount = EXCLUDED.price_amount,
      price_label = EXCLUDED.price_label,
      warranty = EXCLUDED.warranty,
      is_featured = EXCLUDED.is_featured,
      status = EXCLUDED.status,
      accent = EXCLUDED.accent
    RETURNING id INTO v_prod_id;

    -- Images
    DELETE FROM public.product_images WHERE product_id = v_prod_id;
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES (v_prod_id, '/products/tay-dieu-khien-austdoor-dk1.jpg', 'Tay Điều Khiển Remote Cửa Cuốn Austdoor DK1 Nắp Trượt Kim Loại', 0, true);

    -- Specs
    DELETE FROM public.product_specs WHERE product_id = v_prod_id;
    INSERT INTO public.product_specs (product_id, spec_name, spec_value, group_name, sort_order) VALUES
    (v_prod_id, 'Hãng sản xuất', 'Austdoor Group', 'Thông số kỹ thuật', 0),
    (v_prod_id, 'Số nút điều khiển', '4 nút (Lên, Xuống, Dừng, Khóa/Đèn)', 'Thiết kế', 1),
    (v_prod_id, 'Công nghệ mã hóa', 'Austmatic Rolling Code (ARC)', 'Bảo mật', 2),
    (v_prod_id, 'Loại pin sử dụng', 'Pin 12V - 27A (thời lượng dùng 1-2 năm)', 'Nguồn điện', 3),
    (v_prod_id, 'Chất liệu vỏ', 'Nhựa ABS cao cấp + Viền thép mạ crom không gỉ', 'Độ bền', 4);
  END IF;

  -----------------------------------------------------------------------------
  -- 5. AN TOÀN: Bộ Cảm Biến Tự Dừng & Đảo Chiều Không Dây Cửa Cuốn An Toàn
  -----------------------------------------------------------------------------
  IF v_cat_safety IS NOT NULL THEN
    INSERT INTO public.products (
      category_id, name, slug, short_description, description,
      price_mode, price_amount, price_label, currency, warranty,
      is_featured, status, sort_order, seo_title, seo_description, accent
    ) VALUES (
      v_cat_safety,
      'Bộ Cảm Biến Tự Dừng & Đảo Chiều Không Dây Cửa Cuốn Safe-Seal',
      'bo-cam-bien-dao-chieu-tu-dung-khong-day-cua-cuon',
      'Hệ thống cảm biến chống kẹt không dây thông minh, tự động phát hiện vật cản và đảo chiều cửa đi lên ngay lập tức, bảo vệ tuyệt đối an toàn cho trẻ nhỏ và xe cộ.',
      'Bộ cảm biến tự dừng & đảo chiều Safe-Seal là phụ kiện an toàn thiết yếu cho mọi bộ cửa cuốn hiện đại. Khi cửa đang hạ xuống mà gặp bất kỳ vật cản nào (người, trẻ nhỏ, xe máy, đồ vật), hệ thống cảm biến sẽ kích hoạt rơ-le ngắt chiều xuống và điều khiển motor đảo chiều chạy ngược lên 15-20cm trong 0.2 giây, loại bỏ hoàn toàn nguy cơ kẹt hay xô nan cửa cuốn.',
      'exact', 950000, '950.000đ', 'VND', '12 tháng',
      true, 'published', 5,
      'Bộ Cảm Biến Tự Dừng Đảo Chiều Cửa Cuốn Safe-Seal',
      'Lắp đặt bộ cảm biến chống kẹt đảo chiều tự động cho cửa cuốn gia đình, bảo đảm an toàn cho trẻ em.',
      '#f59e0b'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      price_mode = EXCLUDED.price_mode,
      price_amount = EXCLUDED.price_amount,
      price_label = EXCLUDED.price_label,
      warranty = EXCLUDED.warranty,
      is_featured = EXCLUDED.is_featured,
      status = EXCLUDED.status,
      accent = EXCLUDED.accent
    RETURNING id INTO v_prod_id;

    -- Images
    DELETE FROM public.product_images WHERE product_id = v_prod_id;
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES (v_prod_id, '/products/cam-bien-dao-chieu-khong-day.jpg', 'Bộ Cảm Biến Tự Dừng & Đảo Chiều Không Dây Cửa Cuốn Safe-Seal', 0, true);

    -- Specs
    DELETE FROM public.product_specs WHERE product_id = v_prod_id;
    INSERT INTO public.product_specs (product_id, spec_name, spec_value, group_name, sort_order) VALUES
    (v_prod_id, 'Loại thiết bị', 'Cảm biến đảo chiều & tự ngắt chống kẹt', 'Thông số kỹ thuật', 0),
    (v_prod_id, 'Công nghệ kết nối', 'Bộ phát sóng không dây Wireless Transmitter 433MHz', 'Kết nối', 1),
    (v_prod_id, 'Thời gian phản ứng', '< 0.2 giây khi chạm vật cản', 'Hiệu năng', 2),
    (v_prod_id, 'Hành trình đảo chiều', 'Tự động đảo chiều đi lên 15 - 20 cm', 'An toàn', 3),
    (v_prod_id, 'Khả năng tương thích', 'Tương thích tất cả các dòng motor và hộp nhận trên thị trường', 'Ứng dụng', 4);
  END IF;

  -----------------------------------------------------------------------------
  -- 6. THÂN CỬA: Cửa Cuốn Khe Thoáng Nhôm Titadoor PM-503 Sơn AkzoNobel
  -----------------------------------------------------------------------------
  IF v_cat_door IS NOT NULL THEN
    INSERT INTO public.products (
      category_id, name, slug, short_description, description,
      price_mode, price_amount, price_label, currency, warranty,
      is_featured, status, sort_order, seo_title, seo_description, accent
    ) VALUES (
      v_cat_door,
      'Cửa Cuốn Khe Thoáng Nhôm Titadoor PM-503 Sơn AkzoNobel (Đức)',
      'cua-cuon-khe-thoang-nhom-titadoor-pm-503-chinh-hang',
      'Thân cửa cuốn hợp kim nhôm 6063-T5 cao cấp 2 lớp, móc chịu lực dày 1.3mm, khe thoáng hình Ovan đón gió và ánh sáng, phủ sơn tĩnh điện AkzoNobel bảo hành 5 năm.',
      'Cửa cuốn nhôm khe thoáng Titadoor PM-503 là một trong những mẫu cửa cuốn cao cấp bán chạy nhất tại Việt Nam. Sử dụng phôi nhôm nguyên chất 6063 chuẩn T5 với cấu trúc nan kép chịu lực, ron giảm chấn triệt tiêu 95% tiếng ồn khi vận hành. Thiết kế các hàng lỗ thoáng hình Ovan linh hoạt, có thể để thoáng lấy gió hoặc đóng kín bảo vệ chống mưa bão.',
      'from', 1450000, 'Từ 1.450.000đ/m²', 'VND', '5 năm (màu sơn) · 24 tháng (thân cửa)',
      true, 'published', 6,
      'Cửa Cuốn Khe Thoáng Nhôm Titadoor PM-503 Chính Hãng',
      'Báo giá lắp đặt Cửa cuốn khe thoáng Titadoor PM-503 nhôm Đức chính hãng, bảo hành màu sơn 5 năm.',
      '#eab308'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      price_mode = EXCLUDED.price_mode,
      price_amount = EXCLUDED.price_amount,
      price_label = EXCLUDED.price_label,
      warranty = EXCLUDED.warranty,
      is_featured = EXCLUDED.is_featured,
      status = EXCLUDED.status,
      accent = EXCLUDED.accent
    RETURNING id INTO v_prod_id;

    -- Images
    DELETE FROM public.product_images WHERE product_id = v_prod_id;
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES (v_prod_id, '/products/cua-cuon-khe-thoang-titadoor-pm503.jpg', 'Cửa Cuốn Khe Thoáng Nhôm Titadoor PM-503 Sơn AkzoNobel', 0, true);

    -- Specs
    DELETE FROM public.product_specs WHERE product_id = v_prod_id;
    INSERT INTO public.product_specs (product_id, spec_name, spec_value, group_name, sort_order) VALUES
    (v_prod_id, 'Hãng sản xuất', 'Titadoor Technology (Đức)', 'Quy cách', 0),
    (v_prod_id, 'Chất liệu thân cửa', 'Hợp kim nhôm định hình 6063-T5 cao cấp', 'Chất liệu', 1),
    (v_prod_id, 'Độ dày nan cửa', 'Móc dày 1.3mm, chân chịu lực 1.5mm', 'Quy cách', 2),
    (v_prod_id, 'Thiết kế khe thoáng', 'Lỗ thoáng hình Ovan điều hòa không khí', 'Tính năng', 3),
    (v_prod_id, 'Công nghệ sơn bề mặt', 'Sơn tĩnh điện cao cấp AkzoNobel Hà Lan (bảo hành 5 năm)', 'Bề mặt', 4),
    (v_prod_id, 'Kích thước tối đa', 'Rộng 6.5m x Cao 6.0m (Diện tích tối đa 36m²)', 'Quy cách', 5);
  END IF;

END $$;
