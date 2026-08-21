import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbJsonLd, type BreadcrumbItem } from "./structured-data";

/**
 * Visual breadcrumb navigation + BreadcrumbList JSON-LD for SEO.
 * Renders a horizontal navigation trail above page content.
 */
export function Breadcrumb({
  items,
  baseUrl,
}: {
  items: BreadcrumbItem[];
  baseUrl: string;
}) {
  return (
    <>
      <BreadcrumbJsonLd items={items} baseUrl={baseUrl} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/" aria-label="Trang chủ">
              <Home size={14} />
              <span>Trang chủ</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} aria-current={isLast ? "page" : undefined}>
                <ChevronRight size={13} aria-hidden="true" />
                {isLast ? (
                  <span>{item.name}</span>
                ) : (
                  <Link href={item.href}>{item.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
