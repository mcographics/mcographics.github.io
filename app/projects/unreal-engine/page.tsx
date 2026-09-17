import type { Metadata } from "next";
import SiteHeader from "../../SiteHeader";

export const metadata: Metadata = {
  title: "Unreal Engine | Majestic Creations",
  description: "The Unreal Engine area of Majestic Creations is currently being built.",
  alternates: { canonical: "/projects/unreal-engine/" },
};

export default function UnrealEnginePage() {
  return (
    <main className="coming-soon-page" id="top">
      <SiteHeader className="coming-soon-header" />
      <section className="coming-soon-content" aria-labelledby="coming-soon-title">
        <div className="coming-soon-copy">
          <p className="eyebrow"><span /> Unreal Engine</p>
          <h1 id="coming-soon-title">Coming Soon</h1>
          <p>Coming Soon Page being built.</p>
          <a className="button ghost" href="/">Go back <span>←</span></a>
        </div>
      </section>
    </main>
  );
}
