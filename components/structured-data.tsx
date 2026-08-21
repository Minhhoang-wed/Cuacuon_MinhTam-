/**
 * Reusable Schema.org JSON-LD components for SEO rich snippets.
 * Each component renders a <script type="application/ld+json"> tag.
 */

/* ------------------------------------------------------------------ */
/* BreadcrumbList JSON-LD                                             */
/* ------------------------------------------------------------------ */
export type BreadcrumbItem = { name: string; href: string };

export function BreadcrumbJsonLd({
  items,
  baseUrl,
}: {
  items: BreadcrumbItem[];
  baseUrl: string;
}) {
  const base = baseUrl.replace(/\/$/, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: base },
      ...items.map((item, index) => ({
        "@type": "ListItem" as const,
        position: index + 2,
        name: item.name,
        item: item.href.startsWith("http") ? item.href : `${base}${item.href}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* FAQPage JSON-LD (Google rich snippets)                             */
/* ------------------------------------------------------------------ */
export type FaqItem = { question: string; answer: string };

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* WebSite JSON-LD (Sitelinks Search Box on Google)                   */
/* ------------------------------------------------------------------ */
export function WebSiteJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  const base = url.replace(/\/$/, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: base,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/san-pham?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
