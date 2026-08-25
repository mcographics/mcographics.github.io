import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostArchive from "../../PostArchive";
import { blogCategories, postsInCategory } from "../../posts";
import SiteHeader from "../../../SiteHeader";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return blogCategories.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const slug = (await params).slug; const category = blogCategories.find((item) => item.slug === slug); return category ? { title: `${category.name} | Majestic Creations Blog`, description: `Majestic Creations articles filed under ${category.name}.` } : {}; }
export default async function CategoryPage({ params }: PageProps) { const slug = (await params).slug; const category = blogCategories.find((item) => item.slug === slug); if (!category) notFound(); const posts = postsInCategory(slug); return <main className="journal-page"><SiteHeader className="journal-header" activePage="blog" actionHref="/blog" actionLabel="All articles" actionIcon="←" actionExternal={false} /><section className="archive-page"><p className="section-kicker">Category</p><h1>{category.name}</h1><p>{posts.length} {posts.length === 1 ? "article" : "articles"} in this collection.</p><PostArchive posts={posts} heading={category.name} /></section></main>; }
