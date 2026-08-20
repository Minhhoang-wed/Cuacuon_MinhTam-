import { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  image = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=82",
  cardOverlay = false,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  image?: string;
  cardOverlay?: boolean;
}) {
  return (
    <section
      className={`page-hero ${cardOverlay ? "page-hero-has-card" : ""}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container page-hero-inner">
        {cardOverlay ? (
          <div className="page-hero-card">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1>{title}</h1>
            <p>{description}</p>
            {children && <div className="page-hero-actions">{children}</div>}
          </div>
        ) : (
          <>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1>{title}</h1>
            <p>{description}</p>
            {children && <div className="page-hero-actions">{children}</div>}
          </>
        )}
      </div>
    </section>
  );
}

