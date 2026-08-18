import { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  image = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=82",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(30, 28, 25, 0.88), rgba(30, 28, 25, 0.55)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container page-hero-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children && <div className="page-hero-actions">{children}</div>}
      </div>
    </section>
  );
}

