import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostArchive from "../../PostArchive";
import { blogTags, postsWithTag } from "../../posts";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return blogTags.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const slug = (await params).slug; const tag = blogTags.find((item) => item.slug === slug); return tag ? { title: `${tag.name} | Majestic Creations Blog`, description: `Majestic Creations articles tagged ${tag.name}.` } : {}; }
export default async function TagPage({ params }: PageProps) { const slug = (await params).slug; const tag = blogTags.find((item) => item.slug === slug); if (!tag) notFound(); const posts = postsWithTag(slug); return <main className="journal-page"><header className="site-header journal-header"><a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a><nav><a href="/blog" aria-current="page">Blog</a><a href="/community">Community</a><a href="/about">About Me</a></nav><a className="header-cta" href="/blog">All articles <span>←</span></a></header><section className="archive-page"><p className="section-kicker">Topic</p><h1>{tag.name}</h1><p>{posts.length} {posts.length === 1 ? "article" : "articles"} with this tag.</p><PostArchive posts={posts} heading={tag.name} /></section></main>; }
