import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const contentDirectory = join(root, "content", "blog");
const outputFile = join(root, "app", "blog", "generated-posts.json");
const publicDirectory = join(root, "public");
const siteUrl = "https://mcographics.github.io";
const now = new Date();
const today = now.toISOString().slice(0, 10);
const errors = [];

const xml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const slugify = (value) => value.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const requiredString = (data, field, file) => {
  if (typeof data[field] !== "string" || !data[field].trim()) errors.push(`${file}: ${field} must be a non-empty string`);
};

marked.use({ gfm: true, breaks: false });

const files = (await readdir(contentDirectory)).filter((file) => file.endsWith(".md") && file !== "README.md").sort();
const seenSlugs = new Set();
const posts = [];

for (const file of files) {
  const slug = basename(file, ".md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${file}: filename must be a lowercase URL slug`);
  if (seenSlugs.has(slug)) errors.push(`${file}: duplicate slug ${slug}`);
  seenSlugs.add(slug);

  const source = await readFile(join(contentDirectory, file), "utf8");
  const { data, content } = matter(source);
  for (const field of ["title", "description", "date", "category", "coverImage", "coverAlt"]) requiredString(data, field, file);
  if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) errors.push(`${file}: tags must be a non-empty string list`);
  if (typeof data.published !== "boolean") errors.push(`${file}: published must be true or false`);
  if (typeof data.featured !== "boolean") errors.push(`${file}: featured must be true or false`);
  const date = new Date(`${data.date}T12:00:00Z`);
  if (Number.isNaN(date.valueOf()) || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) errors.push(`${file}: date must use YYYY-MM-DD`);
  if (typeof data.coverImage === "string" && !data.coverImage.startsWith("/")) errors.push(`${file}: coverImage must begin with /`);
  if (!content.trim()) errors.push(`${file}: article body is empty`);
  if (/<script\b|<iframe\b|\son\w+\s*=/i.test(content)) errors.push(`${file}: unsafe embedded HTML is not allowed`);

  const words = content.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>|[#>*_`\[\]()!-]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  posts.push({
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    displayDate: Number.isNaN(date.valueOf()) ? data.date : new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date),
    category: data.category,
    categorySlug: slugify(data.category ?? ""),
    tags: Array.isArray(data.tags) ? data.tags : [],
    tagSlugs: Array.isArray(data.tags) ? data.tags.map(slugify) : [],
    coverImage: data.coverImage,
    coverAlt: data.coverAlt,
    featured: data.featured,
    published: data.published,
    scheduled: Boolean(data.published && !Number.isNaN(date.valueOf()) && data.date > today),
    readingTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
    contentHtml: await marked.parse(content),
  });
}

const visiblePosts = posts.filter((post) => post.published && !post.scheduled).sort((a, b) => b.date.localeCompare(a.date));
if (visiblePosts.filter((post) => post.featured).length > 1) errors.push("Only one published post may be featured at a time");
for (const post of posts) {
  if (typeof post.coverImage === "string") {
    try { await readFile(join(publicDirectory, post.coverImage.replace(/^\//, ""))); } catch { errors.push(`${post.slug}: coverImage does not exist at public${post.coverImage}`); }
  }
}
if (errors.length) throw new Error(`Blog validation failed:\n- ${errors.join("\n- ")}`);

const categories = [...new Map(visiblePosts.map((post) => [post.categorySlug, { name: post.category, slug: post.categorySlug }])).values()].sort((a, b) => a.name.localeCompare(b.name));
const tags = [...new Map(visiblePosts.flatMap((post) => post.tags.map((name, index) => [post.tagSlugs[index], { name, slug: post.tagSlugs[index] }]))).values()].sort((a, b) => a.name.localeCompare(b.name));
await writeFile(outputFile, `${JSON.stringify({ posts: visiblePosts, categories, tags }, null, 2)}\n`);

const rssItems = visiblePosts.map((post) => `<item><title>${xml(post.title)}</title><link>${siteUrl}/blog/${post.slug}/</link><guid>${siteUrl}/blog/${post.slug}/</guid><pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate><description>${xml(post.description)}</description><category>${xml(post.category)}</category></item>`).join("");
await writeFile(join(publicDirectory, "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Majestic Creations Journal</title><link>${siteUrl}/blog/</link><description>Project stories, development notes, creative experiments, and ideas from Majestic Creations.</description><language>en-ca</language>${rssItems}</channel></rss>\n`);

const projectSlugs = ["the-islamic-dilemma", "work-day-with-god", "unified-ai-studio", "fierolink-gt", "creative-whiteboard", "comic-organizer", "dossier-builder", "words-of-yeshua", "truth-news", "re-tui", "bridgeforge", "grace-seek", "space-eye", "tanyaos", "workspaces", "project-database", "gamingbible", "character-profile-maker"];
const sitemapPaths = ["/", "/about/", "/blog/", "/community/", ...projectSlugs.map((slug) => `/projects/${slug}/`), ...visiblePosts.map((post) => `/blog/${post.slug}/`), ...categories.map((category) => `/blog/category/${category.slug}/`), ...tags.map((tag) => `/blog/tag/${tag.slug}/`)];
await writeFile(join(publicDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapPaths.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join("")}</urlset>\n`);
await mkdir(join(publicDirectory, "blog"), { recursive: true });
console.log(`Blog ready: ${visiblePosts.length} published, ${posts.filter((post) => !post.published).length} drafts, ${posts.filter((post) => post.scheduled).length} scheduled.`);
