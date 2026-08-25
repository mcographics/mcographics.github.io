import type { Metadata } from "next";
import { blogPosts } from "./posts";

export const metadata: Metadata = {
  title: "Blog | Majestic Creations",
  description: "Project stories, development notes, creative experiments, and ideas from Majestic Creations.",
};

export default function BlogPage() {
  const featured = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  return (
    <main className="journal-page" id="top">
      <header className="site-header journal-header">
        <a className="brand" href="/" aria-label="Majestic Creations home"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <nav aria-label="Primary navigation"><a href="/#work">Projects</a><a href="/#studio">Studio</a><a href="/blog" aria-current="page">Blog</a><a href="/community">Community</a><a href="/#support">Support</a><a href="/about">About Me</a></nav>
        <a className="header-cta" href="https://linktr.ee/Ken_S" target="_blank" rel="noreferrer">Connect / View Portfolios <span>↗</span></a>
      </header>

      <section className="journal-hero">
        <div className="about-grid" aria-hidden="true" />
        <p className="eyebrow"><span /> Ideas · Process · Progress</p>
        <h1>The Majestic<br /><em>Journal.</em></h1>
        <p>Project stories, development notes, creative experiments, and reflections from the intersection of design, artificial intelligence, coding, faith, and digital production.</p>
      </section>

      <section className="journal-list" aria-labelledby="latest-writing">
        <div className="journal-section-heading"><p className="section-kicker">Latest writing</p><h2 id="latest-writing">From behind<br />the work.</h2></div>
        {featured && <a className="featured-post" href={`/blog/${featured.slug}`}>
          <span className="post-number">01</span>
          <div><p className="post-meta"><span>{featured.category}</span> {featured.displayDate} · {featured.readingTime}</p><h3>{featured.title}</h3><p>{featured.description}</p><b>Read article <span>→</span></b></div>
          <img src="/og.png" alt="Majestic Creations gold lion and monogram" />
        </a>}
        <div className="journal-coming"><span>More stories are being written.</span><p>New project journals, development updates, and creative insights will be published here.</p></div>
      </section>

      <footer className="about-footer"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps · Games · Worlds · Ideas</p><div><a href="/">Home</a><a href="/community">Community</a><a href="/about">About Me</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
    </main>
  );
}
