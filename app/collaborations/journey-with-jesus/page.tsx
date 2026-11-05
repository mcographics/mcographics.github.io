import type { Metadata } from "next";
import BrandImage from "../../BrandImage";
import SiteHeader from "../../SiteHeader";
import JourneyXrayArtwork from "./JourneyXrayArtwork";

const projectUrl = "https://kerygmapath.com/";
const repositoryUrl = "https://github.com/mcographics/journey-with-jesus";

export const metadata: Metadata = {
  title: "Journey with Jesus | Collaborations | Majestic Creations",
  description: "A collaboration case study for Journey with Jesus: an anime-inspired, Scripture-centered animation project founded by Eric Oberhausen, with Kenneth Salmon serving as Editor / Webmaster.",
  alternates: { canonical: "/collaborations/journey-with-jesus/" },
  openGraph: {
    title: "Journey with Jesus | Majestic Creations Collaborations",
    description: "Exploring the storytelling vision, digital experience, and editorial work behind Journey with Jesus.",
    url: "/collaborations/journey-with-jesus/",
  },
};

const areas = [
  { number: "01", title: "Story-first presence", description: "A responsive home for the project's mission: sharing the Gospel through animated stories grounded in Scripture." },
  { number: "02", title: "Media & discovery", description: "A media-library foundation designed for published stories, playlists, and episode discussions. The catalog can grow as finished films become available." },
  { number: "03", title: "People & characters", description: "Dedicated pages introduce the creative team and guide audiences through characters connected to the Gospel accounts." },
  { number: "04", title: "Publishing foundations", description: "A private administrative Studio supports a planned publishing workflow for video assets, character profiles, team information, and moderated discussion." },
];

export default function JourneyWithJesusCollaborationPage() {
  return (
    <main className="collab-page collab-detail-page" id="top">
      <SiteHeader actionHref="/collaborations/" actionLabel="All collaborations" actionIcon="←" actionExternal={false} />
      <section className="collab-detail-hero" aria-labelledby="journey-title">
        <div className="collab-atmosphere" aria-hidden="true" />
        <div className="collab-container collab-detail-grid">
          <div className="collab-detail-intro">
            <nav className="collab-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/collaborations/">Collaborations</a><span>/</span><span>Journey with Jesus</span></nav>
            <p className="collab-kicker"><span /> Collaboration 001 · Faith &amp; creative media</p>
            <h1 id="journey-title" className="collab-detail-wordmark"><img src="/images/journey-with-jesus-wordmark.webp" width="2000" height="770" alt="Journey with Jesus" loading="eager" decoding="async" fetchPriority="high" /></h1>
            <p className="collab-hero-quote">One extraordinary life. One timeless message. A journey that changes everything.</p>
            <p className="collab-lead">A cinematic, anime-inspired approach to sharing Scripture—where purposeful storytelling meets a thoughtfully built online home.</p>
            <div className="collab-actions">
              <a className="collab-action" href={projectUrl} target="_blank" rel="noopener noreferrer">View Site <span aria-hidden="true">↗</span></a>
              <a className="collab-quiet-link" href="#my-role">My role <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <JourneyXrayArtwork />
        </div>
      </section>
      <section className="collab-story-section" aria-labelledby="project-story-title">
        <div className="collab-container collab-story-grid">
          <div><p className="collab-kicker">The project / 001</p><h2 id="project-story-title">A timeless story.<br /><em>A new visual language.</em></h2></div>
          <div className="collab-prose">
            <p><strong>Journey with Jesus</strong> is an independently published Christian animation initiative founded by Eric Oberhausen. Its goal is to share the life and message of Jesus Christ through cinematic visuals, heartfelt storytelling, and a contemporary anime-inspired style.</p>
            <p>The project focuses on the teachings, miracles, sacrifice, and resurrection of Jesus while inviting both newcomers and longtime readers to encounter the Gospel. Faith, hope, love, and redemption are central to its creative direction.</p>
            <p>This collaboration highlights the editorial and website work supporting the project. The animation and story vision belong to the broader Journey with Jesus effort; this portfolio entry documents my part in building its digital presence.</p>
          </div>
        </div>
      </section>
      <section className="collab-role-section" id="my-role" aria-labelledby="my-role-title">
        <div className="collab-container">
          <p className="collab-kicker">The people / Roles &amp; contribution</p>
          <h2 id="my-role-title">Working with <em>purpose.</em></h2>
          <div className="collab-role-grid">
            <article><span className="collab-role-index">01 / Founder</span><h3>Eric Oberhausen</h3><p>Founder of Journey with Jesus and the originating creative vision for its Scripture-centered animated storytelling.</p></article>
            <article><span className="collab-role-index">02 / Editor &amp; Webmaster</span><h3>Kenneth Salmon</h3><p>Supporting the project's digital presence through site content editing, website maintenance, presentation, and the ongoing development of its online experience.</p></article>
          </div>
        </div>
      </section>
      <section className="collab-foundations-section" aria-labelledby="foundation-title">
        <div className="collab-container">
          <div className="collab-section-heading"><p className="collab-kicker">The digital foundation</p><h2 id="foundation-title">Designed to <em>grow.</em></h2><p>The current website establishes a foundation for sharing stories as the library and creative materials develop.</p></div>
          <div className="collab-foundations-grid">{areas.map((area) => <article key={area.number}><span>{area.number}</span><h3>{area.title}</h3><p>{area.description}</p></article>)}</div>
        </div>
      </section>
      <section className="collab-gallery-section" aria-labelledby="gallery-title">
        <div className="collab-container">
          <div className="collab-section-heading"><p className="collab-kicker">Selected visuals / Reserved for updates</p><h2 id="gallery-title">Behind the <em>journey.</em></h2><p>Artwork, character designs, interface captures, and production imagery can be added here as they are approved for the case study.</p></div>
          <div className="collab-gallery-grid" aria-label="Future image gallery placeholders">
            <div className="collab-gallery-slot collab-gallery-slot-wide"><span>01 / Featured artwork</span><strong>Visual in preparation</strong></div>
            <div className="collab-gallery-slot"><span>02 / Characters &amp; stories</span><strong>Visual in preparation</strong></div>
            <div className="collab-gallery-slot"><span>03 / Website &amp; process</span><strong>Visual in preparation</strong></div>
          </div>
        </div>
      </section>
      <section className="collab-next-section" aria-labelledby="next-title">
        <div className="collab-container collab-next-grid">
          <div><p className="collab-kicker">Keep exploring</p><h2 id="next-title">Follow the <em>story.</em></h2><p>The Journey with Jesus website is the best place to explore the project as its content develops. This page will grow alongside the visual portfolio.</p></div>
          <div className="collab-next-links"><a href={projectUrl} target="_blank" rel="noopener noreferrer">Visit Journey with Jesus <span aria-hidden="true">↗</span></a><a href={repositoryUrl} target="_blank" rel="noopener noreferrer">Explore the GitHub repository <span aria-hidden="true">↗</span></a><a href="/blog/journey-with-jesus-creative-collaboration/">Read the collaboration update <span aria-hidden="true">↗</span></a><a href="/collaborations/">More collaborations <span aria-hidden="true">←</span></a></div>
        </div>
      </section>
      <footer className="collab-footer"><div className="collab-container collab-footer-inner"><a className="brand" href="/"><BrandImage alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Independent work. Shared purpose.</p><div><a href="/#work">Projects</a><a href="/blog/">Journal</a><a href="/contact/">Contact</a></div></div></footer>
    </main>
  );
}
