import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostArchive from "../../PostArchive";
import { blogTags, postsWithTag } from "../../posts";
import SiteHeader from "../../../SiteHeader";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return blogTags.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const slug = (await params).slug; const tag = blogTags.find((item) => item.slug === slug); return tag ? { title: `${tag.name} | Majestic Creations Blog`, description: `Majestic Creations articles tagged ${tag.name}.` } : {}; }
export default async function TagPage({ params }: PageProps) { const slug = (await params).slug; const tag = blogTags.find((item) => item.slug === slug); if (!tag) notFound(); const posts = postsWithTag(slug); return <main className="journal-page"><SiteHeader className="journal-header" activePage="blog" actionHref="/blog" actionLabel="All articles" actionIcon="←" actionExternal={false} /><section className="archive-page"><p className="section-kicker">Topic</p><h1>{tag.name}</h1><p>{posts.length} {posts.length === 1 ? "article" : "articles"} with this tag.</p><PostArchive posts={posts} heading={tag.name} /></section></main>; }
