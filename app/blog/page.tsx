import type { Metadata } from "next";
import PostArchive from "./PostArchive";
import { blogCategories, blogPosts, blogTags } from "./posts";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Blog | Majestic Creations",
  description: "Project stories, development notes, creative experiments, and ideas from Majestic Creations.",
};

export default function BlogPage() {
  const featured = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const remainingPosts = blogPosts.filter((post) => post.slug !== featured?.slug);
  return (
    <main className="journal-page" id="top">
      <SiteHeader className="journal-header" activePage="blog" />

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
          <img src={featured.bannerImage} alt={featured.bannerAlt} />
        </a>}
        {remainingPosts.length > 0 && <PostArchive posts={remainingPosts} />}
        <div className="blog-taxonomy"><div><p className="section-kicker">Categories</p>{blogCategories.map((category) => <a href={`/blog/category/${category.slug}`} key={category.slug}>{category.name}</a>)}</div><div><p className="section-kicker">Topics</p>{blogTags.map((tag) => <a href={`/blog/tag/${tag.slug}`} key={tag.slug}>{tag.name}</a>)}</div><a className="rss-link" href="/rss.xml">RSS Feed <span>↗</span></a></div>
        <div className="journal-coming"><span>More stories are being written.</span><p>New project journals, development updates, and creative insights will be published here.</p></div>
      </section>

      <footer className="about-footer"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps · Games · Worlds · Ideas</p><div><a href="/">Home</a><a href="/community">Community</a><a href="/about">About Me</a><a href="/contact">Contact Us</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
    </main>
  );
}
