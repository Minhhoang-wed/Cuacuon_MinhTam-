import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PublicLogo } from "@/components/public-logo";
import { directStores } from "@/data/public-home";
import type { CatalogStoreBranch, ManagedSiteConfig } from "@/lib/catalog";

export function SiteFooter({ site, branches = [] }: { site: ManagedSiteConfig; branches?: CatalogStoreBranch[] }) {
  const displayBranches = branches.length > 0 ? branches : directStores.map((s) => ({
    id: s.branch,
    branchName: s.branch,
    address: s.address,
    hotline: site.hotline,
    note: s.note,
    badge: (s as unknown as { badge?: string }).badge || "Cửa hàng trực tiếp",
    sortOrder: 0,
    isActive: true,
  }));

  return (
    <footer className="footer-maison">
      <div className="container footer-maison-grid">
        <div className="footer-maison-brand">
          <PublicLogo name={site.name} shortName={site.shortName} />
          <p>{site.description}</p>
          <div className="footer-maison-trust">
            <ShieldCheck size={16} />
            <span>Tư vấn rõ tình trạng · Hỗ trợ sửa chữa và bảo trì cửa cuốn</span>
          </div>
          <div className="footer-maison-actions">
            <a href={site.zaloHref} target="_blank" rel="noreferrer" className="footer-zalo-btn">
              <MessageCircle size={16} /> Zalo tư vấn sửa cửa cuốn
            </a>
          </div>
        </div>

        <div>
          <h3>Sửa Chữa & Dịch Vụ</h3>
          <div className="footer-maison-links">
            <Link href="/dich-vu">Sửa cửa cuốn</Link>
            <Link href="/dich-vu">Sửa motor cửa cuốn</Link>
            <Link href="/dich-vu">Sửa remote cửa cuốn</Link>
            <Link href="/dich-vu">Bảo trì & bảo dưỡng</Link>
            <Link href="/dich-vu#loi-thuong-gap">Các lỗi thường gặp</Link>
          </div>
        </div>

        <div>
          <h3>Khu Vực & Hướng Dẫn</h3>
          <div className="footer-maison-links">
            <Link href="/khu-vuc-phuc-vu">Khu vực phục vụ</Link>
            <Link href="/meo-kien-thuc">Mẹo & kiến thức</Link>
            <Link href="/tin-tuc">Bài viết hữu ích</Link>
            <Link href="/san-pham">Sản phẩm & phụ kiện</Link>
            <Link href="/ve-chung-toi">Về Minh Tâm</Link>
          </div>
        </div>

        <div>
          <h3>Hệ Thống Chi Nhánh</h3>
          <div className="footer-maison-contact">
            <a href={site.hotlineHref} className="footer-hotline-highlight">
              <Phone size={17} />
              <span className="footer-hotline-label">TỔNG ĐÀI 24/7:</span>
              <strong className="footer-hotline-number">{site.hotline}</strong>
            </a>

            {/* Trụ sở chính từ Cài đặt chung CMS */}
            {site.address && (
              <a
                href={site.mapsHref || "https://maps.google.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <MapPin size={16} style={{ flexShrink: 0, marginTop: "2px", color: "#10b981" }} />
                <span>
                  <strong style={{ color: "#ffffff", display: "block", fontSize: "12.5px", marginBottom: "2px" }}>
                    Trụ sở chính / Xưởng kỹ thuật
                  </strong>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: 1.45, display: "block" }}>
                    {site.address}
                  </span>
                </span>
              </a>
            )}

            {/* Danh sách Chi nhánh từ CMS */}
            {displayBranches.map((store, idx) => (
              <a
                key={store.id || idx}
                href={site.mapsHref || "https://maps.google.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <MapPin size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--lovable-gold, #f59e0b)" }} />
                <span>
                  <strong style={{ color: "#ffffff", display: "block", fontSize: "12.5px", marginBottom: "2px" }}>
                    {store.branchName}
                  </strong>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.78)", lineHeight: 1.45, display: "block" }}>
                    {store.address}
                  </span>
                </span>
              </a>
            ))}

            <a href={`mailto:${site.email}`}>
              <Mail size={16} />
              <span>{site.email}</span>
            </a>
            <div>
              <Clock3 size={16} />
              <span>{site.hours} — Phục vụ toàn TP.HCM & lân cận</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-maison-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Giữ toàn quyền tác quyền & nội dung.</span>
        <div>
          <Link href="/ve-chung-toi">Về chúng tôi</Link>
          <Link href="/san-pham">Catalog sản phẩm</Link>
          <Link href="/dich-vu">Sửa cửa cuốn</Link>
          <Link href="/lien-he">Liên hệ & Báo giá</Link>
        </div>
      </div>
    </footer>
  );
}

