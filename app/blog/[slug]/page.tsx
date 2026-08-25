import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "../posts";
import SiteHeader from "../../SiteHeader";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | Majestic Creations`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: `${post.date}T12:00:00Z`, tags: post.tags, images: [{ url: post.coverImage, alt: post.coverAlt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  return <main className="journal-page article-page" id="top">
    <SiteHeader className="journal-header" activePage="blog" actionHref="/blog" actionLabel="All articles" actionIcon="←" actionExternal={false} />
    <article className="article-shell">
      <a className="article-back" href="/blog">← Back to the journal</a>
      <p className="post-meta"><a href={`/blog/category/${post.categorySlug}`}>{post.category}</a> {post.displayDate} · {post.readingTime}</p>
      <h1>{post.title}</h1><p className="article-deck">{post.description}</p>
      <img className="article-cover" src={post.coverImage} alt={post.coverAlt} />
      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <div className="article-tags"><span>Filed under</span>{post.tags.map((tag, index) => <a href={`/blog/tag/${post.tagSlugs[index]}`} key={tag}>{tag}</a>)}</div>
      <aside className="article-conversation"><p className="section-kicker">Continue the conversation</p><h2>What would you like to read next?</h2><p>Share an idea, ask a question, or talk about the projects in the Majestic Creations Community.</p><a className="button primary" href="https://github.com/mcographics/mcographics.github.io/discussions" target="_blank" rel="noreferrer">Join the discussion <span>↗</span></a></aside>
    </article>
    <footer className="about-footer"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><p>Apps · Games · Worlds · Ideas</p><div><a href="/blog">Blog</a><a href="/community">Community</a><a href="/about">About Me</a></div><small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small></footer>
  </main>;
}
