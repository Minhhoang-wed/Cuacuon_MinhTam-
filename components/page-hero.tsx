import { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <span className="eyebrow"><span />{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children && <div className="page-hero-actions">{children}</div>}
      </div>
    </section>
  );
}
