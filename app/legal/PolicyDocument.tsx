import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PolicyDocumentProps = {
  title: string;
  intro: string;
  updated?: string;
  sections: PolicySection[];
};

export function PolicyDocument({ title, intro, updated = "November 6, 2026", sections }: PolicyDocumentProps) {
  return (
    <main className="policy-page" id="top">
      <SiteHeader className="journal-header" />
      <section className="policy-hero">
        <p className="eyebrow"><span /> Majestic Creations · Site policies</p>
        <h1>{title}</h1>
        <p className="policy-intro">{intro}</p>
        <p className="policy-updated">Last updated: {updated}</p>
      </section>
      <article className="policy-document">
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={"policy-section-" + index}>
            <h2 id={"policy-section-" + index}>{section.heading}</h2>
            {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}
        <aside className="policy-contact">
          <h2>Questions or a privacy request?</h2>
          <p>Contact Kenneth Salmon, the privacy contact for Majestic Creations, at <a href="mailto:majesticcreationsottawa@outlook.com">majesticcreationsottawa@outlook.com</a>.</p>
        </aside>
      </article>
    </main>
  );
}

export const policyMetadata = (title: string, description: string): Metadata => ({
  title: title + " | Majestic Creations",
  description,
  alternates: { canonical: "/" + title.toLowerCase().replaceAll(" ", "-") + "/" },
});
