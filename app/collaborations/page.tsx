import type { Metadata } from "next";
import BrandImage from "../BrandImage";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Collaborations | Majestic Creations",
  description: "Creative partnerships and shared projects supported by Majestic Creations. Explore Journey with Jesus, a Scripture-centered animated storytelling platform.",
  alternates: { canonical: "/collaborations/" },
  openGraph: {
    title: "Collaborations | Majestic Creations",
    description: "Creative partnerships, shared ideas, and thoughtful digital experiences.",
    url: "/collaborations/",
  },
};

export default function CollaborationsPage() {
  return (
    <main className="collab-page" id="top">
      <SiteHeader actionHref="/#work" actionLabel="Independent projects" actionIcon="↗" actionExternal={false} />
      <section className="collab-overview-hero" aria-labelledby="collaborations-title">
        <div className="collab-atmosphere" aria-hidden="true" />
        <div className="collab-container">
          <p className="collab-kicker"><span /> Majestic Creations · Working together</p>
          <h1 id="collaborations-title">Better stories.<br /><em>Built together.</em></h1>
          <p className="collab-lead">Some work is independent. Other ideas come to life through trust, shared purpose, and a team working toward something bigger. This is a home for those collaborations.</p>
          <a className="collab-text-link" href="#featured-collaboration">Explore the first collaboration <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <section className="collab-index-section" id="featured-collaboration" aria-labelledby="collab-index-title">
        <div className="collab-container">
          <div className="collab-section-heading"><p className="collab-kicker">01 / Collaboration archive</p><h2 id="collab-index-title">Shared <em>visions.</em></h2></div>
          <article className="collab-feature-card">
            <div className="collab-feature-art collab-feature-art--image">
              <img
                className="collab-art-image"
                src="/images/journey-with-jesus-collaboration-card.webp"
                alt="Illustration of Jesus wearing a white robe and red mantle, reaching forward with an open hand."
                loading="lazy"
                decoding="async"
              />
              <span className="collab-art-top">001 / Faith &amp; storytelling</span>
              <span className="collab-art-bottom">A story of faith, hope, and redemption</span>
            </div>
            <div className="collab-feature-copy">
              <p className="collab-kicker">Ongoing collaboration · Scripture &amp; animation</p>
              <h3 className="collab-feature-title"><img src="/images/journey-with-jesus-wordmark-transparent.png" alt="Journey with Jesus" /></h3>
              <p>A Scripture-centered storytelling project bringing the life, teachings, miracles, sacrifice, and resurrection of Jesus Christ to a new audience through cinematic, anime-inspired animation.</p>
              <dl className="collab-mini-facts">
                <div><dt>Founded by</dt><dd>Eric Oberhausen</dd></div>
                <div><dt>My contribution</dt><dd>Editor / Webmaster</dd></div>
              </dl>
              <a className="collab-action" href="/collaborations/journey-with-jesus/">View collaboration <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
      </section>
      <footer className="collab-footer">
        <div className="collab-container collab-footer-inner"><a className="brand" href="/"><BrandImage alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Independent work. Shared purpose.</p><div><a href="/#work">Projects</a><a href="/blog/">Journal</a><a href="/contact/">Contact</a></div></div>
      </footer>
    </main>
  );
}
