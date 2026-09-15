import blogData from "./generated-posts.json";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  displayDate: string;
  category: string;
  categorySlug: string;
  tags: string[];
  tagSlugs: string[];
  coverImage: string;
  coverAlt: string;
  bannerImage: string;
  bannerAlt: string;
  readingTime: string;
  featured: boolean;
  contentHtml: string;
};

export type BlogTaxonomy = { name: string; slug: string };

export const blogPosts = blogData.posts as BlogPost[];
export const blogCategories = blogData.categories as BlogTaxonomy[];
export const blogTags = blogData.tags as BlogTaxonomy[];
export const BLOG_PAGE_SIZE = 8;

export function getBlogArchivePosts() {
  const featuredSlug = blogPosts.find((post) => post.featured)?.slug;
  return blogPosts.filter((post) => post.slug !== featuredSlug);
}

export function getBlogPageCount() {
  return Math.max(1, Math.ceil(getBlogArchivePosts().length / BLOG_PAGE_SIZE));
}

export function getBlogPagePosts(page: number) {
  const safePage = Math.max(1, Math.floor(page));
  const archivePosts = getBlogArchivePosts();
  const start = (safePage - 1) * BLOG_PAGE_SIZE;
  return archivePosts.slice(start, start + BLOG_PAGE_SIZE);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function postsInCategory(slug: string) {
  return blogPosts.filter((post) => post.categorySlug === slug);
}

export function postsWithTag(slug: string) {
  return blogPosts.filter((post) => post.tagSlugs.includes(slug));
}
