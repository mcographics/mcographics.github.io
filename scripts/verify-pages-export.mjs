import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const output = join(process.cwd(), "pages-dist");
const requiredRoutes = [
  { path: "index.html", label: "home page", title: "<title>Majestic Creations" },
  { path: "projects/forgemcp/index.html", label: "ForgeMCP page", title: "<title>ForgeMCP" },
  { path: "projects/forgeai/index.html", label: "ForgeAI page", title: "<title>ForgeAI | Intelligent 3D Creation" },
  { path: "collaborations/index.html", label: "collaborations page", title: "<title>Collaborations | Majestic Creations" },
  { path: "collaborations/journey-with-jesus/index.html", label: "Journey with Jesus collaboration", title: "<title>Journey with Jesus | Collaborations | Majestic Creations" },
];

for (const route of requiredRoutes) {
  const file = join(output, route.path);
  await access(file);
  const html = await readFile(file, "utf8");
  if (!html.includes(route.title)) {
    throw new Error(`The exported ${route.label} is missing its expected title: ${route.path}`);
  }
  if (html.length === 0) throw new Error(`The exported ${route.label} is empty: ${route.path}`);
  console.log(`Verified ${route.path}`);
}

const homeHtml = await readFile(join(output, "index.html"), "utf8");
for (const href of ["/projects/forgemcp/", "/projects/forgeai/"]) {
  if (!homeHtml.includes(`href="${href}"`)) {
    throw new Error(`The home page is missing the ${href} project navigation link.`);
  }
  console.log(`Verified home navigation link ${href}`);
}

const forgeaiHtml = await readFile(join(output, "projects/forgeai/index.html"), "utf8");
const requiredBrandAssets = [
  "/projects/forgeai/banner-1086.webp",
  "/projects/forgeai/banner-1916.webp",
  "/projects/forgeai/orbit-emblem-320.webp",
  "/projects/forgeai/orbit-emblem-640.webp",
];

for (const assetUrl of requiredBrandAssets) {
  if (!forgeaiHtml.includes(assetUrl)) {
    throw new Error(`The exported ForgeAI page does not reference ${assetUrl}`);
  }
  await access(join(output, assetUrl.slice(1)));
  console.log(`Verified ${assetUrl}`);
}

const collaborationsHtml = await readFile(join(output, "collaborations/journey-with-jesus/index.html"), "utf8");
for (const phrase of ["Eric Oberhausen", "Kenneth Salmon", "Editor", "journey-with-jesus-creative-collaboration"]) {
  if (!collaborationsHtml.includes(phrase)) throw new Error(`The collaboration page is missing ${phrase}`);
}
if (!homeHtml.includes("Collaborations")) throw new Error("The home navigation is missing Collaborations.");
console.log("Verified Journey with Jesus collaboration content and navigation");
