import Link from "next/link";

export function AdminLogo() {
  return (
    <Link href="/admin/dashboard" className="admin-logo-link" aria-label="Cua Cuon Minh Tam CMS">
      <img
        src="/logo/logo.png"
        alt="Cua Cuon Minh Tam"
        className="admin-logo-image"
      />
    </Link>
  );
}
