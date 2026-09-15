import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPagination from "../../BlogPagination";
import PostArchive from "../../PostArchive";
import { BLOG_PAGE_SIZE, getBlogPageCount, getBlogPagePosts } from "../../posts";
import SiteHeader from "../../../SiteHeader";

type PageProps = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  const totalPages = getBlogPageCount();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = Number((await params).page);
  return Number.isInteger(page) && page >= 2 && page <= getBlogPageCount()
    ? { title: `Blog · Page ${page} | Majestic Creations`, description: `More project stories, development notes, and creative work from Majestic Creations — blog page ${page}.` }
    : {};
}

export default async function BlogPageNumber({ params }: PageProps) {
  const page = Number((await params).page);
  const totalPages = getBlogPageCount();
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  const posts = getBlogPagePosts(page);
  return <main className="journal-page" id="top">
    <SiteHeader className="journal-header" activePage="blog" actionHref="/blog" actionLabel="All articles" actionIcon="←" actionExternal={false} />
    <section className="archive-page blog-page-archive">
      <p className="section-kicker">The Majestic Journal</p>
      <h1>More from<br /><em>behind the work.</em></h1>
      <p>Continue through the archive of project stories, development notes, creative experiments, and studio reflections.</p>
      <PostArchive posts={posts} heading={`Blog page ${page}`} startIndex={(page - 1) * BLOG_PAGE_SIZE + 1} />
      <BlogPagination currentPage={page} totalPages={totalPages} />
    </section>
  </main>;
}
