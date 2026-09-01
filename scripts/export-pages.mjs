import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "pages-dist");
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repository.endsWith(".github.io");
const base = repository && !isUserSite ? `/${repository}` : "";
const port = 4179;
const server = spawn(process.execPath, [join(root, "node_modules/vinext/dist/cli.js"), "start", "--port", String(port)], {
  cwd: root,
  env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForSite(path = "/") {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}${path}`);
      if (response.ok) return response.text();
    } catch {
      // The preview may still be starting; retry until the deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("The production preview did not start in time.");
}

try {
  const blogData = JSON.parse(await readFile(join(root, "app", "blog", "generated-posts.json"), "utf8"));
  let html = await waitForSite();
  let aboutHtml = await waitForSite("/about");
  let contactHtml = await waitForSite("/contact");
  let blogHtml = await waitForSite("/blog");
  let communityHtml = await waitForSite("/community");
  let workDayHtml = await waitForSite("/projects/work-day-with-god");
  let wordsOfYeshuaHtml = await waitForSite("/projects/words-of-yeshua");
  const projectSlugs = ["the-islamic-dilemma", "chainbreaker", "unified-ai-studio", "fierolink-gt", "creative-whiteboard", "comic-organizer", "dossier-builder", "truth-news", "public-nuisance", "netrunner-launcher", "bridgeforge", "grace-seek", "space-eye", "tanyaos", "workspaces", "project-database", "gamingbible", "character-profile-maker"];
  html = html.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  aboutHtml = aboutHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  contactHtml = contactHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  blogHtml = blogHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  communityHtml = communityHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  workDayHtml = workDayHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  wordsOfYeshuaHtml = wordsOfYeshuaHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(join(root, "dist/client"), output, { recursive: true });
  await writeFile(join(output, "index.html"), html);
  await mkdir(join(output, "about"), { recursive: true });
  await writeFile(join(output, "about", "index.html"), aboutHtml);
  await mkdir(join(output, "contact"), { recursive: true });
  await writeFile(join(output, "contact", "index.html"), contactHtml);
  await mkdir(join(output, "blog"), { recursive: true });
  await writeFile(join(output, "blog", "index.html"), blogHtml);
  const dynamicRoutes = [
    ...blogData.posts.map((post) => `/blog/${post.slug}`),
    ...blogData.categories.map((category) => `/blog/category/${category.slug}`),
    ...blogData.tags.map((tag) => `/blog/tag/${tag.slug}`),
  ];
  for (const route of dynamicRoutes) {
    let routeHtml = await waitForSite(route);
    routeHtml = routeHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
    const routeDirectory = join(output, ...route.split("/").filter(Boolean));
    await mkdir(routeDirectory, { recursive: true });
    await writeFile(join(routeDirectory, "index.html"), routeHtml);
  }
  await mkdir(join(output, "community"), { recursive: true });
  await writeFile(join(output, "community", "index.html"), communityHtml);
  await mkdir(join(output, "projects", "work-day-with-god"), { recursive: true });
  await writeFile(join(output, "projects", "work-day-with-god", "index.html"), workDayHtml);
  await mkdir(join(output, "projects", "words-of-yeshua"), { recursive: true });
  await writeFile(join(output, "projects", "words-of-yeshua", "index.html"), wordsOfYeshuaHtml);
  for (const slug of projectSlugs) {
    let projectHtml = await waitForSite(`/projects/${slug}`);
    projectHtml = projectHtml.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
    const projectDirectory = join(output, "projects", slug);
    await mkdir(projectDirectory, { recursive: true });
    await writeFile(join(projectDirectory, "index.html"), projectHtml);
  }
  await cp(join(root, "public", "robots.txt"), join(output, "robots.txt"));
  await writeFile(join(output, ".nojekyll"), "");
} finally {
  server.kill();
}
