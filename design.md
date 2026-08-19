# Design System — Cửa Cuốn Minh Tâm

> **Single source of truth** cho toàn bộ giao diện Public Website và Admin CMS.

Tài liệu này quy định màu sắc, typography, spacing, layout, component states, responsive, accessibility và cách triển khai UI.

Mục tiêu là đảm bảo toàn bộ dự án có cùng một ngôn ngữ thiết kế:

**Uy tín — Kỹ thuật — Hiện đại — Sạch — Dễ sử dụng — Tối ưu chuyển đổi Gọi/Zalo**

---

# 0. Scope Lock

- Giữ nguyên danh mục sản phẩm hiện tại.
- Không đổi tên nhóm, không tách/gộp danh mục và không thay đổi cấu trúc lọc sản phẩm.
- Giai đoạn này chỉ ưu tiên đồng bộ màu sắc, token giao diện và nhận diện thương hiệu.
- Logo chính lấy từ `public/logo/logo.png` và dùng làm ảnh đại diện chính của website.

---

# 1. Design Principles

## 1.1. Brand personality

Cửa Cuốn Minh Tâm cần tạo cảm giác:

- Uy tín, chắc chắn.
- Có tính kỹ thuật.
- Nhanh và rõ ràng.
- Hiện đại nhưng không màu mè.
- Giao diện dễ đọc.
- CTA dễ nhìn, đặc biệt trên mobile.
- Public Website hướng tới conversion.
- Admin CMS hướng tới thao tác nhanh và ít lỗi.

## 1.2. Không sử dụng

Tránh:

- Đỏ/vàng phủ diện tích lớn như giao diện sale.
- Gradient mạnh.
- Glassmorphism quá nhiều.
- Shadow nặng.
- Card bo tròn quá mức.
- Quá nhiều màu cạnh tranh.
- Gold dùng cho đoạn văn dài.
- Navy phủ liên tục nhiều section lớn.
- Animation gây phân tâm.
- Mỗi component tự hardcode một màu khác nhau.

---

# 2. Token Architecture

Design system sử dụng **2 tầng token**:

```text
Primitive Brand Tokens
        ↓
Semantic Tokens
        ↓
Components
```

Component nên ưu tiên dùng **Semantic Tokens**.

Không hardcode màu trực tiếp nếu token tương ứng đã tồn tại.

---

# 3. Primitive Brand Tokens

Nguồn màu chính khai báo trong:

```text
app/globals.css
```

```css
:root {
  /* =========================
     BRAND
     ========================= */

  --brand-navy-900: #0d3158;
  --brand-navy-800: #123d6b;

  --brand-blue-600: #1976d2;
  --brand-blue-700: #1565b8;
  --brand-blue-100: #eaf4fd;
  --brand-blue-50: #f4f9fe;

  --brand-gold-500: #f4b323;
  --brand-gold-600: #e6a318;
  --brand-gold-100: #fff7e3;

  /* =========================
     NEUTRAL
     ========================= */

  --neutral-0: #ffffff;
  --neutral-25: #fcfdfe;
  --neutral-50: #f7f9fc;
  --neutral-100: #eef3f8;
  --neutral-200: #dce4ed;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-700: #334155;
  --neutral-800: #18324b;
  --neutral-900: #0f2235;

  /* =========================
     SEMANTIC STATUS
     ========================= */

  --green-700: #15803d;
  --green-100: #dcfce7;

  --amber-700: #b45309;
  --amber-100: #fef3c7;

  --red-700: #b91c1c;
  --red-600: #dc2626;
  --red-100: #fee2e2;
  --red-50: #fef2f2;

  --gray-status-700: #475569;
  --gray-status-100: #e2e8f0;

  /* =========================
     EXTERNAL BRAND
     ========================= */

  --zalo-blue: #0068ff;
  --zalo-blue-hover: #0057d9;
}
```

---

# 4. Semantic Tokens

Component nên dùng nhóm này trước.

```css
:root {
  /* =========================
     BRAND SEMANTIC
     ========================= */

  --color-primary: var(--brand-navy-900);
  --color-primary-hover: var(--brand-blue-600);

  --color-interactive: var(--brand-blue-600);
  --color-interactive-hover: var(--brand-blue-700);

  --color-accent: var(--brand-gold-500);
  --color-accent-hover: var(--brand-gold-600);

  /* =========================
     TEXT
     ========================= */

  --color-text-primary: var(--neutral-800);
  --color-text-secondary: var(--neutral-500);
  --color-text-muted: var(--neutral-400);
  --color-text-inverse: var(--neutral-0);

  /* =========================
     BACKGROUND / SURFACE
     ========================= */

  --color-bg-page: var(--neutral-50);
  --color-bg-section: var(--neutral-100);
  --color-surface: var(--neutral-0);
  --color-surface-subtle: var(--brand-blue-50);

  /* =========================
     BORDER
     ========================= */

  --color-border: var(--neutral-200);
  --color-border-strong: var(--neutral-300);

  /* =========================
     FOCUS
     ========================= */

  --color-focus: var(--brand-blue-600);
  --focus-ring: 0 0 0 3px rgba(25, 118, 210, 0.16);

  /* =========================
     STATUS
     ========================= */

  --color-success: var(--green-700);
  --color-success-bg: var(--green-100);

  --color-warning: var(--amber-700);
  --color-warning-bg: var(--amber-100);

  --color-danger: var(--red-600);
  --color-danger-strong: var(--red-700);
  --color-danger-bg: var(--red-50);

  --color-inactive: var(--gray-status-700);
  --color-inactive-bg: var(--gray-status-100);

  /* =========================
     OVERLAY
     ========================= */

  --overlay-soft: rgba(13, 49, 88, 0.08);
  --overlay-medium: rgba(13, 49, 88, 0.18);
  --overlay-modal: rgba(15, 34, 53, 0.46);
}
```

---

# 5. Color Distribution

Tỷ lệ sử dụng khuyến nghị:

- **65%**: trắng / xám rất nhạt.
- **15%**: navy.
- **15%**: blue.
- **5%**: gold.

## Navy

Dùng cho:

- Brand trust.
- Topbar.
- Admin sidebar.
- Legal strip.
- Heading.
- Primary CTA.

Không dùng navy làm nền cho nhiều section liên tiếp.

## Blue

Dùng cho:

- Link.
- Active state.
- Hover.
- Focus.
- Icon thao tác.
- Edit action.
- Interactive UI.

## Gold

Chỉ dùng làm accent:

- Hotline.
- Badge.
- Icon nhỏ.
- Statistic highlight.
- Active indicator.
- Warning nhẹ.

Không dùng gold cho:

- Paragraph.
- Section background lớn.
- Table body.
- Primary Admin action.

## Red

Chỉ dùng cho:

- Error.
- Delete.
- Destructive confirmation.
- Validation nguy hiểm.

Không dùng red như brand color.

---

# 6. Spacing Scale

Không dùng spacing ngẫu nhiên.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

Ưu tiên sử dụng scale này xuyên suốt.

---

# 7. Layout Foundation

## 7.1. Public container

```css
--container-public: 1280px;
```

Desktop:

```text
max-width: 1280px
margin-inline: auto
padding-inline: 24px
```

Tablet:

```text
padding-inline: 20px
```

Mobile:

```text
padding-inline: 16px
```

## 7.2. Admin container

Admin content không cần ép về 1280px.

Ưu tiên:

```text
width: 100%
max-width: 1600px
```

để table và management UI có không gian.

## 7.3. Public section spacing

Desktop:

```text
64px – 80px
```

Hero đặc biệt có thể:

```text
72px – 96px
```

Compact section:

```text
40px – 56px
```

Mobile:

```text
40px – 56px
```

Không để section ít nội dung chiếm gần cả màn hình.

---

# 8. Grid

Public product/service grid:

Desktop:

```text
3 – 4 columns
gap: 24px
```

Tablet:

```text
2 columns
gap: 20px
```

Mobile:

```text
1 column
gap: 16px
```

Admin KPI grid:

```text
Desktop: auto-fit / 4–5 cards
Tablet: 2–3 cards
Mobile: 1–2 cards
```

---

# 9. Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-pill: 999px;
}
```

Quy tắc:

- Button: `--radius-md`.
- Input: `--radius-md`.
- Card: `--radius-lg`.
- Dialog: `--radius-xl`.
- Badge: `--radius-pill`.

Không sử dụng radius 24–32px cho card thông thường.

---

# 10. Shadow

```css
:root {
  --shadow-xs: 0 1px 2px rgba(13, 49, 88, 0.05);

  --shadow-sm: 0 2px 8px rgba(13, 49, 88, 0.06);

  --shadow-md: 0 8px 24px rgba(13, 49, 88, 0.1);

  --shadow-lg: 0 16px 40px rgba(13, 49, 88, 0.14);
}
```

Quy tắc:

- Card mặc định: `none` hoặc `--shadow-xs`.
- Card hover: tối đa `--shadow-sm`.
- Dropdown: `--shadow-md`.
- Modal: `--shadow-lg`.

Không dùng shadow mạnh cho mọi card.

---

# 11. Typography

## Font

Ưu tiên:

```text
Be Vietnam Pro
```

Fallback:

```css
font-family:
  "Be Vietnam Pro",
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Arial,
  sans-serif;
```

## Font weights

```text
400 — Regular
500 — Medium
600 — SemiBold
700 — Bold
```

Không lạm dụng 800/900.

## Public typography

Hero H1:

```text
Desktop: 52px
Tablet: 44px
Mobile: 36px
Weight: 700
Line-height: 1.12
```

Page H1:

```text
48px / 1.15
```

Section H2:

```text
32px – 36px
Weight: 700
```

H3/Card title:

```text
18px – 20px
Weight: 600
```

Body:

```text
16px
Line-height: 1.65
```

Small/meta:

```text
13px – 14px
```

## Admin typography

Admin H1:

```text
36px – 40px
```

Section title:

```text
24px – 28px
```

Table/body:

```text
14px – 15px
```

Admin ưu tiên compact hơn Public.

---

# 12. Breakpoints

Sử dụng nhất quán:

```text
Mobile small: < 480px
Mobile / large mobile: < 640px
Tablet: 640px – 1023px
Desktop: >= 1024px
Large desktop: >= 1280px
Wide: >= 1440px
```

Nếu Tailwind đã có breakpoint riêng thì ưu tiên convention của project, không tạo song song.

---

# 13. Z-index Scale

Không đặt `z-index: 99999` tùy ý.

```css
:root {
  --z-base: 0;
  --z-sticky: 20;
  --z-header: 30;
  --z-dropdown: 40;
  --z-mobile-cta: 50;
  --z-overlay: 60;
  --z-modal: 70;
  --z-toast: 80;
}
```

---

# 14. Motion

Animation phải ngắn và có mục đích.

```css
:root {
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --duration-slow: 260ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

Dùng cho:

- Hover.
- Focus.
- Dropdown.
- Modal.
- Button.

Không sử dụng animation dài > 400ms cho thao tác thông thường.

Tôn trọng:

```css
@media (prefers-reduced-motion: reduce);
```

---

# 15. Icon System

Ưu tiên một icon library duy nhất nếu project đã có.

Kích thước:

```text
Small: 16px
Default: 20px
Large: 24px
Feature icon: 28–32px
```

Không mix icon stroke dày/mỏng không đồng nhất.

---

# 16. Logo

Logo chính:

```text
public/logo.png
```

Quy tắc:

- Không đổi màu logo.
- Không bóp méo.
- Luôn giữ aspect ratio.
- Dùng `object-fit: contain`.
- Không đặt trên background khiến logo bị chìm.

## Public Header

Desktop:

```text
width: 190px – 220px
```

Mobile:

```text
width: 150px – 165px
```

## Footer

```text
width: 180px – 200px
```

## Admin Sidebar

Không đặt nguyên logo xanh trực tiếp trên nền navy nếu mất contrast.

Ưu tiên:

```text
white logo tile
+
MINH TÂM
ADMIN CMS
```

Logo tile:

```text
48px – 56px
background: white
radius: 12px
```

Brand text:

```text
MINH TÂM → white
ADMIN CMS → gold
```

---

# 17. Buttons

## Height

```text
Small: 36px
Default: 44px
Large CTA: 48px
```

Touch target mobile không dưới:

```text
44px
```

## Primary

```text
Background: --color-primary
Text: white
Hover: --color-primary-hover
```

## Secondary

```text
Background: white
Text: --color-primary
Border: --color-border-strong
Hover text/border: --color-interactive
```

## Destructive

```text
Background: --color-danger
Text: white
```

## Disabled

```text
Opacity: 0.5 – 0.6
Cursor: not-allowed
```

Disabled không được chỉ đổi màu nhẹ mà vẫn nhìn giống enabled.

## Loading

Không thay đổi width của button khi loading.

Có:

```text
spinner + label
```

hoặc spinner riêng nếu button rất nhỏ.

---

# 18. Links

Default:

```text
--color-interactive
```

Hover:

```text
--color-interactive-hover
```

Không dùng underline mặc định nếu navigation.

Trong body text, link phải phân biệt rõ với paragraph.

---

# 19. Forms

## Input height

```text
44px
```

Textarea:

```text
min-height: 120px
```

## Input

```text
Background: white
Border: --color-border
Text: --color-text-primary
Placeholder: --color-text-muted
```

Focus:

```text
Border: --color-focus
Box-shadow: --focus-ring
```

Error:

```text
Border: --color-danger
Text: --color-danger
Background helper/error: --color-danger-bg
```

Disabled:

```text
Background: --neutral-100
Text: --color-text-muted
```

Label:

```text
14px
Weight: 500–600
```

Helper:

```text
13px
```

Required field không chỉ thể hiện bằng màu đỏ; cần ký hiệu hoặc text.

---

# 20. Public Website

## 20.1. Topbar

```text
Background: --brand-navy-900
Text: white 75–85%
Icons: gold
```

Height nên compact:

```text
34px – 40px
```

## 20.2. Main Header

```text
Background: white
Border bottom: --color-border
```

Menu:

```text
Default: --color-primary
Active: --color-interactive
Hover: --color-interactive
```

Header desktop:

```text
72px – 84px
```

Không để quá cao.

## 20.3. Hero

Background:

```text
--color-bg-page
```

Hoặc:

```css
linear-gradient(
  135deg,
  #FFFFFF 0%,
  var(--brand-blue-50) 100%
)
```

Gradient chỉ rất nhẹ.

Headline:

```text
--color-primary
```

Description:

```text
--color-text-secondary
```

Badge:

```text
Background: --brand-gold-100
Text: --color-primary
Icon: --color-accent
```

## 20.4. Service Cards

```text
Background: --color-surface
Border: --color-border
Title: --color-primary
Body: --color-text-secondary
Icon: --color-interactive
Icon background: --brand-blue-100
```

Hover:

```text
Border: --color-interactive
Shadow: --shadow-sm
TranslateY: tối đa -2px
```

## 20.5. Product Cards

Name:

```text
--color-primary
```

Price:

```text
--color-primary
```

hoặc:

```text
--color-interactive
```

Old price:

```text
--color-text-muted
text-decoration: line-through
```

Sale badge:

```text
Background: --brand-gold-100
Text: --color-primary
```

Không dùng red cho sale price.

---

# 21. Product Image Rules

Ảnh sản phẩm:

```text
Aspect ratio: 1:1 hoặc 4:3
```

Phải thống nhất toàn listing.

Dùng:

```text
object-fit: contain
```

nếu ảnh sản phẩm có nền trắng.

Dùng:

```text
object-fit: cover
```

chỉ khi ảnh lifestyle/công trình.

Không để mỗi card một tỷ lệ ảnh khác nhau.

---

# 22. Project / Service Image Rules

Hero / project:

```text
16:9
```

Service card:

```text
4:3
```

Thumbnail article:

```text
16:9
```

Có placeholder nếu thiếu ảnh.

---

# 23. Mobile Sticky CTA

Mục tiêu conversion:

```text
[GỌI NGAY] [ZALO TƯ VẤN]
```

Call:

```text
Background: --color-primary
Text: white
```

Zalo:

```text
Background: --zalo-blue
Text: white
```

Yêu cầu:

- Height khoảng 52–56px.
- Safe-area bottom.
- Không che content.
- Body/footer phải có bottom padding tương ứng.
- Chỉ hiển thị mobile/tablet nhỏ nếu UX yêu cầu.

---

# 24. Footer

## Main Footer

```text
Background: white hoặc --color-bg-page
```

Heading:

```text
--color-primary
```

Body:

```text
--color-text-secondary
```

Link hover:

```text
--color-interactive
```

Contact icon:

```text
--color-accent
```

Padding:

```text
48px 0 40px
```

Không để footer chính thành một khối navy quá lớn.

## Legal strip

```text
Background: --brand-navy-900
Text: rgba(255,255,255,.76)
```

Padding:

```text
16px – 20px
```

---

# 25. Admin CMS

Admin dùng cùng brand nhưng ưu tiên:

```text
Navy + Blue + White + Gray
```

Gold dùng rất ít.

Admin cần compact hơn Public.

---

# 26. Admin Sidebar

```text
Background: --brand-navy-900
```

Desktop width:

```text
220px – 240px
```

Không rộng hơn nếu không cần.

Text:

```text
rgba(255,255,255,.78)
```

Hover:

```text
rgba(255,255,255,.06)
```

Active:

```text
Background: rgba(25,118,210,.18)
Text: white
```

Active indicator:

```text
--color-accent
```

---

# 27. Admin Brand Block

Brand area:

```text
Height: khoảng 92px – 108px
```

Ưu tiên:

```text
Logo tile + MINH TÂM + ADMIN CMS
```

Divider:

```text
rgba(255,255,255,.10)
```

Không để logo bị chìm trên sidebar.

---

# 28. Admin Main Area

Background:

```text
--color-bg-page
```

Heading:

```text
--color-primary
```

Description:

```text
--color-text-secondary
```

Admin content padding desktop:

```text
28px – 36px
```

Mobile:

```text
16px
```

---

# 29. Admin KPI Cards

```text
Background: white
Border: --color-border
Radius: --radius-lg
```

Value:

```text
--color-primary
```

Label:

```text
--color-text-secondary
```

Icon tile:

```text
Background: --brand-blue-100
Icon: --color-interactive
```

Padding:

```text
20px – 24px
```

Không làm KPI card quá cao.

---

# 30. Admin Tables

Header:

```text
Background: --color-bg-page
Text: --color-primary
```

Row:

```text
Background: white
```

Hover:

```text
var(--brand-blue-50)
```

Divider:

```text
--color-border
```

Desktop row height:

```text
52px – 60px
```

Table phải ưu tiên density và scan nhanh.

---

# 31. Admin Actions

Primary:

```text
Navy
```

Edit:

```text
Blue
```

Delete:

```text
Danger red
```

Cancel:

```text
White + border
```

Không dùng gold cho CRUD action chính.

---

# 32. Status Badge

## Published / Active

```text
Background: --color-success-bg
Text: --color-success
```

## Draft

```text
Background: --color-warning-bg
Text: --color-warning
```

## Inactive / Archived

```text
Background: --color-inactive-bg
Text: --color-inactive
```

## Error

```text
Background: --color-danger-bg
Text: --color-danger-strong
```

Badge luôn phải có label text.

---

# 33. Dialog / Modal

Overlay:

```text
--overlay-modal
```

Dialog:

```text
Background: white
Radius: --radius-xl
Shadow: --shadow-lg
```

Width thông thường:

```text
420px – 560px
```

Delete confirmation phải hiển thị rõ destructive intent.

---

# 34. Toast

Success:

```text
Green semantic
```

Warning:

```text
Amber semantic
```

Error:

```text
Red semantic
```

Info:

```text
Blue semantic
```

Toast không sử dụng brand navy cho mọi loại trạng thái.

---

# 35. Empty State

Empty state gồm:

```text
Icon
Title
Description
Optional CTA
```

Không chỉ để khoảng trắng.

Icon:

```text
Blue hoặc muted
```

---

# 36. Loading State

Ưu tiên:

- Skeleton cho page/list.
- Spinner cho button/action ngắn.

Skeleton:

```text
neutral-100 / neutral-200
```

Không dùng spinner toàn trang nếu có thể render skeleton.

---

# 37. Accessibility

Bắt buộc:

- Contrast đủ tốt.
- Focus visible rõ.
- Không chỉ dùng màu để truyền trạng thái.
- Touch target tối thiểu 44x44px.
- Button có accessible label.
- Icon-only button phải có `aria-label`.
- Form label phải liên kết với input.
- Image có `alt` phù hợp.
- Decorative image dùng alt rỗng.
- Modal phải giữ focus.
- Keyboard navigation không bị mất focus outline.

---

# 38. Responsive Rules

## Mobile

- Header compact.
- H1 giảm kích thước.
- CTA rõ.
- Grid 1 column.
- Button có thể full-width.
- Table Admin chuyển scroll ngang hoặc responsive layout.
- Không ép table desktop thành chữ quá nhỏ.
- Sticky CTA không che footer/content.

## Tablet

- Grid 2 columns.
- Sidebar Admin có thể collapse nếu thiết kế hiện có hỗ trợ.

## Desktop

- Scan nhanh.
- Giữ container.
- Không kéo content vô hạn trên màn hình ultra-wide.

---

# 39. Component State Standard

Mọi interactive component cần cân nhắc đủ:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error (nếu có)
```

Không chỉ thiết kế default state.

---

# 40. Implementation Rules

Nguồn token:

```text
app/globals.css
```

Logo:

```text
components/logo.tsx
```

Mobile CTA:

```text
components/mobile-actions.tsx
```

Quy tắc:

- Dùng CSS variables.
- Không hardcode màu nếu token có sẵn.
- Nếu cần màu mới → thêm token trước.
- Không tạo thêm design system song song.
- Không sửa Backend chỉ để thay giao diện.
- Không sửa Supabase/API/auth/CRUD khi thực hiện styling.

---

# 41. Naming Convention

Ưu tiên semantic naming:

Tốt:

```css
color: var(--color-text-primary);
background: var(--color-surface);
border-color: var(--color-border);
```

Không ưu tiên:

```css
color: var(--brand-navy-900);
```

trừ khi component thật sự mang tính brand.

---

# 42. QA Checklist

Trước khi merge UI:

## Brand

- [ ] Public và Admin dùng cùng palette.
- [ ] Không hardcode màu ngoài token nếu không có lý do.
- [ ] Gold chỉ là accent.
- [ ] Red chỉ dùng semantic danger/error.

## Public

- [ ] Header đúng navy/white/blue/gold.
- [ ] Hero sáng và dễ đọc.
- [x] Primary CTA nổi bật.
- [ ] Product/service card nhất quán.
- [ ] Image aspect ratio không nhảy.
- [ ] Mobile Gọi/Zalo dễ thao tác.
- [ ] Footer không quá cao/tối.

## Admin

- [ ] Sidebar logo nhìn rõ.
- [ ] Admin content sáng.
- [ ] KPI card compact.
- [ ] Table scan nhanh.
- [ ] CRUD action dùng đúng màu.
- [ ] Status badge đúng semantic.
- [ ] Delete luôn dùng danger.

## Accessibility

- [ ] Keyboard focus nhìn thấy.
- [ ] Touch target >= 44px.
- [ ] Contrast tốt.
- [ ] Icon-only action có accessible label.

## Responsive

Test tối thiểu:

```text
375px
430px
768px
1024px
1280px
1440px
```

## Technical

Chạy nếu script tồn tại:

```bash
pnpm typecheck
pnpm build
```

Nếu project có lint:

```bash
pnpm lint
```

---

# 43. Change Policy

Khi muốn thay đổi giao diện toàn dự án:

## Thay màu

Sửa:

```text
Primitive / Semantic Token
```

Không sửa hàng loạt từng component.

## Thay spacing

Sửa spacing scale hoặc component convention.

## Thay radius

Sửa radius token.

## Thay shadow

Sửa shadow token.

Mục tiêu:

> **Một thay đổi ở Design System có thể lan nhất quán tới toàn bộ Public Website và Admin CMS mà không tạo style drift.**

---

# 44. Final Design Direction

Public Website:

> **Sáng — chuyên nghiệp — đáng tin — conversion-focused**

Admin CMS:

> **Gọn — sáng — dễ scan — dễ thao tác — cùng nhận diện thương hiệu**

Brand language:

```text
NAVY
→ Uy tín / chắc chắn / kỹ thuật

BLUE
→ Hiện đại / tương tác / công nghệ

GOLD
→ Chất lượng / tốc độ / điểm nhấn

WHITE & LIGHT GRAY
→ Sạch / thoáng / dễ đọc
```

Đây là design core chính thức của dự án Cửa Cuốn Minh Tâm.
