import type { Metadata } from "next";
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
              <nav className="collab-social-links" aria-label="Journey with Jesus social media">
                <span className="collab-social-links-label">Follow the project</span>
                <a className="collab-social-link" data-platform="youtube" href="https://www.youtube.com/@KerygmaPath" target="_blank" rel="noopener noreferrer" aria-label="Journey with Jesus on YouTube (opens in a new tab)" title="YouTube">
                  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" /></svg>
                </a>
                <a className="collab-social-link" data-platform="facebook" href="https://www.facebook.com/KerygmaPath" target="_blank" rel="noopener noreferrer" aria-label="Journey with Jesus on Facebook (opens in a new tab)" title="Facebook">
                  <svg aria-hidden="true" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0C152.8 0 105.47 44.38 105.47 124.72v70.62H24.5V288h80.97v224h99.2V288z" /></svg>
                </a>
              </nav>
            </div>
          </article>
        </div>
      </section>
      
    </main>
  );
}
