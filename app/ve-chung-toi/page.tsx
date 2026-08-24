import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { getAboutContent, getSiteSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu đội ngũ, quy trình và cam kết phục vụ trong lĩnh vực cửa cuốn.",
  alternates: { canonical: "/ve-chung-toi" },
};

export default async function AboutPage() {
  const [site, about] = await Promise.all([getSiteSettings(), getAboutContent()]);

  const processSteps = [
    about.processStep1,
    about.processStep2,
    about.processStep3,
    about.processStep4,
    about.processStep5,
  ].filter(Boolean);

  return (
    <>
      <PageHero
        title={about.heroTitle}
        description={about.heroDescription}
        image={about.heroImage || "/images/about-hero-banner.jpg"}
      />

      <div className="container">
        <Breadcrumb
          items={[{ name: "Giới thiệu", href: "/ve-chung-toi" }]}
          baseUrl={site.seoCanonicalBase || site.baseUrl}
        />
      </div>

      <section className="section about-intro">
        <div className="container about-intro-grid">
          <div>
            <span className="kicker">{about.philosophyKicker}</span>
            <h2>{about.philosophyTitle}</h2>
          </div>
          <div>
            <p>{about.philosophyText1}</p>
            {about.philosophyText2 && <p>{about.philosophyText2}</p>}
          </div>
        </div>
      </section>

      <section className="about-image-band">
        <div className="container about-image-grid">
          <img src={about.image1Url} alt="Kỹ thuật viên kiểm tra thiết bị" />
          <img src={about.image2Url} alt="Công trình cửa cuốn công nghiệp" />
        </div>
      </section>

      <section className="section about-values-section">
        <div className="container">
          <div className="lovable-section-heading">
            <span>Điều chúng tôi theo đuổi</span>
            <h2>{about.valuesHeading || "Giá trị cốt lõi"}</h2>
          </div>
          <div className="about-values-grid">
            <article>
              <Wrench />
              <span>01</span>
              <h3>{about.value1Title}</h3>
              <p>{about.value1Text}</p>
            </article>
            <article>
              <ShieldCheck />
              <span>02</span>
              <h3>{about.value2Title}</h3>
              <p>{about.value2Text}</p>
            </article>
            <article>
              <Sparkles />
              <span>03</span>
              <h3>{about.value3Title}</h3>
              <p>{about.value3Text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section about-process-section">
        <div className="container about-process-grid">
          <div>
            <span className="kicker">Quy trình làm việc</span>
            <h2>{about.processHeading || "Rõ ràng từ tiếp nhận đến bảo hành."}</h2>
          </div>
          <ol>
            {processSteps.map((item, index) => (
              <li key={item + index}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{item}</span>
                <CheckCircle2 />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
