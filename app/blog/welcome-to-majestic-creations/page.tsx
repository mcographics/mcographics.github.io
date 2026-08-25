import type { Metadata } from "next";
import { getBlogPost } from "../posts";

const post = getBlogPost("welcome-to-majestic-creations")!;

export const metadata: Metadata = { title: `${post.title} | Majestic Creations`, description: post.description };

export default function WelcomePostPage() {
  return <main className="journal-page article-page" id="top">
    <header className="site-header journal-header"><a className="brand" href="/" aria-label="Majestic Creations home"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><nav aria-label="Primary navigation"><a href="/#work">Projects</a><a href="/#studio">Studio</a><a href="/blog" aria-current="page">Blog</a><a href="/community">Community</a><a href="/#support">Support</a><a href="/about">About Me</a></nav><a className="header-cta" href="/blog">All articles <span>←</span></a></header>
    <article className="article-shell">
      <a className="article-back" href="/blog">← Back to the journal</a>
      <p className="post-meta"><span>{post.category}</span> {post.displayDate} · {post.readingTime}</p>
      <h1>{post.title}</h1>
      <p className="article-deck">{post.description}</p>
      <img className="article-cover" src="/og.png" alt="Majestic Creations gold lion and monogram" />
      <div className="article-body">{post.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <aside className="article-conversation"><p className="section-kicker">Continue the conversation</p><h2>What would you like to read next?</h2><p>Share an idea, ask a question, or talk about the projects in the Majestic Creations Community.</p><a className="button primary" href="https://github.com/mcographics/mcographics.github.io/discussions" target="_blank" rel="noreferrer">Join the discussion <span>↗</span></a></aside>
    </article>
    <footer className="about-footer"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps · Games · Worlds · Ideas</p><div><a href="/blog">Blog</a><a href="/community">Community</a><a href="/about">About Me</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
  </main>;
}
