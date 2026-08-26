import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repositoryStatus = JSON.parse(await readFile(new URL("../app/repository-status.json", import.meta.url), "utf8"));
const scriptureVerses = JSON.parse(await readFile(new URL("../app/scripture-verses.json", import.meta.url), "utf8"));
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const expectedPrivateProjects = Object.values(repositoryStatus.repositories).filter((repository) => repository.visibility === "PRIVATE").length;

test("preserves the complete supplied Scripture ticker collection", () => {
  assert.equal(scriptureVerses.length, 100);
  assert.equal(scriptureVerses.filter((verse) => verse.wordsOfChrist).length, 37);
  assert.deepEqual(scriptureVerses[0], {
    reference: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble.",
    wordsOfChrist: false,
  });
});

test("keeps the mobile navigation available while scrolling sections", () => {
  assert.match(globalStyles, /@media\(max-width:760px\)\{\.site-header\{[^}]*position:fixed/);
  assert.match(globalStyles, /\.work,\.studio,\.support\{scroll-margin-top:70px\}/);
});

test("keeps the homepage hero statement proportionate across screen sizes", () => {
  assert.match(globalStyles, /\.hero h1\{font-size:clamp\(62px,7\.5vw,116px\);line-height:\.86\}/);
  assert.match(globalStyles, /@media\(max-width:760px\)\{\.hero h1\{font-size:clamp\(52px,15\.5vw,82px\)\}\}/);
});

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function assertSharedMobileNavigation(html) {
  assert.match(html, /aria-label="Open navigation menu"/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /id="mobile-navigation" class="mobile-nav-panel"/);
  assert.match(html, /aria-label="Mobile navigation"/);
  assert.match(html, /aria-label="Share this page"/);
  assert.match(html, /class="site-share mobile-share"/);
  assert.match(html, /class="site-share desktop-share"/);
  assert.match(html, /class="theme-toggle"/);
  assert.match(html, /aria-label="Switch to light mode"/);
  assert.match(html, /class="accessibility-menu"/);
  assert.match(html, /aria-label="Accessibility settings"/);
  const accessibility = html.indexOf('class="accessibility-menu"');
  const theme = html.indexOf('class="theme-toggle"');
  const share = html.indexOf('class="site-share desktop-share"');
  assert.ok(accessibility < theme && theme < share, "accessibility and theme controls should sit to the left of Share");
  const primaryNav = html.match(/<nav aria-label="Primary navigation">(.*?)<\/nav>/)?.[1] ?? "";
  const projects = primaryNav.indexOf('>Projects</a>');
  const blog = primaryNav.indexOf('>Blog</a>');
  const community = primaryNav.indexOf('>Community</a>');
  const about = primaryNav.indexOf('>About Me</a>');
  const studio = primaryNav.indexOf('>Studio</a>');
  const support = primaryNav.indexOf('>Support</a>');
  assert.ok(projects < blog && blog < community && community < about && about < studio && studio < support, "navigation should follow the portfolio-first order");
  assert.doesNotMatch(primaryNav, />Releases<\/a>/);
}

test("server-renders the Majestic Creations portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /<title>Majestic Creations \| Apps, Games, Worlds &amp; Ideas<\/title>/i);
  assert.match(html, /<html lang="en" data-theme="dark"/i);
  assert.match(html, /property="og:type" content="website"/i);
  assert.match(html, /property="og:site_name" content="Majestic Creations"/i);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/og\.png"/i);
  assert.match(html, /property="og:image:width" content="1200"/i);
  assert.match(html, /property="og:image:height" content="630"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /name="twitter:image" content="http:\/\/localhost:3000\/og\.png"/i);
  assert.match(html, /rel="shortcut icon" href="\/favicon-32x32\.png"/i);
  assert.match(html, /rel="icon" href="\/favicon-32x32\.png" sizes="32x32" type="image\/png"/i);
  assert.match(html, /rel="icon" href="\/icon-192x192\.png" sizes="192x192" type="image\/png"/i);
  assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png" sizes="180x180" type="image\/png"/i);
  assert.doesNotMatch(html, /rel="(?:shortcut icon|icon|apple-touch-icon)" href="\/brand\/majestic-lion\.png"/i);
  assert.match(html, /<link rel="alternate" type="application\/rss\+xml" title="Majestic Creations Journal" href="\/rss\.xml"/i);
  assert.match(html, /Turning bold ideas/);
  assert.match(html, /aria-label="Bible verses of encouragement"/);
  assert.match(html, /God is our refuge and strength/);
  assert.match(html, /Psalm 46:1(?:<!-- -->)? · KJV/);
  assert.doesNotMatch(html, /aria-label="Previous Bible verse"/);
  assert.doesNotMatch(html, /aria-label="Next Bible verse"/);
  assert.match(html, /Connect \/ View Portfolios/);
  assert.match(html, /aria-label="Open navigation menu"/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, /id="mobile-navigation" class="mobile-nav-panel"/);
  assert.match(html, /aria-label="Mobile navigation"/);
  assert.match(html, /href="https:\/\/ko-fi\.com\/cmdrstriker"/);
  assert.match(html, /Ko-fi Donate/);
  assert.match(html, /href="https:\/\/paypal\.me\/mcographics\?locale\.x=en_US&amp;country\.x=CA"/);
  assert.match(html, /PayPal Donate/);
  assert.doesNotMatch(html, /Direct donation options will be added here soon/);
  assert.match(html, /into digital reality\./);
  assert.doesNotMatch(html, /Building useful/);
  assert.match(html, /All<br\/><em>projects\.<\/em>/);
  assert.match(html, /Work Day with God/);
  assert.match(html, /src="\/projects\/work-day-with-god-slides\/00-work-day-with-god-cover\.png"/);
  assert.match(html, /alt="Work Day with God — Work, Faith, Purpose cover artwork"/);
  assert.equal((html.match(/src="\/projects\/work-day-with-god-slides\//g) ?? []).length, 9);
  assert.match(html, /src="\/projects\/work-day-with-god-slides\/07-light-mode-runtime\.png"/);
  assert.match(html, /alt="Work Day with God daily devotional running in light mode on Android"/);
  assert.match(html, /src="\/projects\/work-day-with-god-slides\/08-dark-mode-runtime\.png"/);
  assert.match(html, /alt="Work Day with God daily devotional running in dark mode on Android"/);
  assert.match(html, /Work Day with God slideshow controls/);
  assert.match(html, /aria-label="Previous slide"/);
  assert.match(html, /aria-label="Next slide"/);
  assert.equal((html.match(/aria-label="Show slide [1-9]"/g) ?? []).length, 9);
  assert.match(html, /01(?:<!-- -->)? \/ (?:<!-- -->)?09/);
  assert.match(html, /Words of Yeshua/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/WordsofYeshua"/);
  assert.match(html, /src="\/projects\/unified-ai-studio-logo\.png"/);
  assert.match(html, /alt="Unified AI Studio project preview"/);
  assert.match(html, /src="\/projects\/space-eye\.png"/);
  assert.match(html, /alt="Space Eye project preview"/);
  assert.match(html, /Creative Whiteboard/);
  assert.match(html, /src="\/projects\/creative-whiteboard\.png"/);
  assert.match(html, /alt="Creative Whiteboard project preview"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/CreativeWhiteboard"/);
  assert.match(html, /Dossier Builder/);
  assert.match(html, /In development/);
  assert.match(html, /src="\/projects\/dossier-builder\.png"/);
  assert.match(html, /alt="Dossier Builder project preview"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Dosseir-Builder"/);
  assert.match(html, /Project Database/);
  assert.match(html, /src="\/projects\/project-database\.png"/);
  assert.match(html, /GamingBible/);
  assert.match(html, /src="\/projects\/gamingbible\.png"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/GamingBible"/);
  assert.match(html, /Character Profile Maker/);
  assert.match(html, /src="\/projects\/character-profile-maker\.png"/);
  assert.match(html, /alt="Character Profile Maker project preview"/);
  assert.match(html, /Releases Available/);
  const releaseFilter = html.indexOf('data-filter="Releases Available"');
  const allFilter = html.indexOf('data-filter="All"');
  const appsFilter = html.indexOf('data-filter="Apps"');
  const creativeFilter = html.indexOf('data-filter="Creative"');
  const gameDevFilter = html.indexOf('data-filter="Game Dev"');
  const experimentsFilter = html.indexOf('data-filter="Experiments"');
  assert.ok(releaseFilter < allFilter && allFilter < appsFilter && appsFilter < creativeFilter && creativeFilter < gameDevFilter && gameDevFilter < experimentsFilter, "filters should follow the release-first portfolio order");
  assert.equal((html.match(/data-categories="[^"]*Apps[^"]*"/g) ?? []).length, 15);
  assert.match(html, /data-project-title="TanyaOS" data-categories="Experiments"/);
  assert.match(html, /data-project-title="BridgeForge" data-categories="Game Dev"/);
  assert.doesNotMatch(html, /data-project-title="(?:TanyaOS|BridgeForge)" data-categories="[^"]*Apps/);
  assert.match(html, /data-project-title="Creative Whiteboard" data-categories="Creative Apps"/);
  assert.match(html, /data-project-title="Work Day with God" data-categories="Faith-Based Apps"/);
  assert.match(html, /class="release-label full">Releases Available/);
  assert.match(html, /class="release-label short">Releases/);
  assert.equal((html.match(/project-status status-release-available/g) ?? []).length, 2);
  assert.match(html, /class="project-status-list"/);
  assert.match(html, /class="project-status-group group-release-available"/);
  assert.match(html, /id="status-release-available">Release available/);
  assert.match(html, /id="status-public-project">Public project/);
  assert.match(html, /id="status-in-development">In development/);
  assert.match(html, /id="status-building">Building/);
  assert.match(html, /id="status-research-project">Research project/);
  assert.doesNotMatch(html, />Released</);
  assert.doesNotMatch(html, /Active release/);
  assert.doesNotMatch(html, /Active development/);
  assert.match(html, /project-status status-release-available/);
  assert.match(html, /project-status status-in-development/);
  const lastRelease = html.lastIndexOf("project-status status-release-available");
  const firstPublic = html.indexOf("project-status status-public-project");
  const firstDevelopment = html.indexOf("project-status status-in-development");
  const firstBuilding = html.indexOf("project-status status-building");
  const firstResearch = html.indexOf("project-status status-research-project");
  assert.ok(lastRelease < firstPublic, "release cards should appear before public projects");
  assert.ok(firstPublic < firstDevelopment, "public projects should appear before development projects");
  assert.ok(firstDevelopment < firstBuilding, "development projects should appear before building projects");
  assert.ok(firstBuilding < firstResearch, "building projects should appear before research projects");
  assert.match(html, /src="\/brand\/github-invertocat-white\.png"/);
  assert.doesNotMatch(html, /aria-label="Open [^"]+">↗<\/a>/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Re-TUI"/);
  assert.doesNotMatch(html, /href="https:\/\/re-tui\.pages\.dev"/);
  assert.equal((html.match(/project-lock private/g) ?? []).length, expectedPrivateProjects);
  assert.equal((html.match(/>Private<\/span>/g) ?? []).length, expectedPrivateProjects);
  assert.equal((html.match(/>Studio project<\/span>/g) ?? []).length, 1);
  assert.equal((html.match(/version availability/g) ?? []).length, 17);
  assert.equal((html.match(/Windows version available/g) ?? []).length, 14);
  assert.equal((html.match(/Windows version not available/g) ?? []).length, 3);
  assert.equal((html.match(/Android version available/g) ?? []).length, 3);
  assert.match(html, /The Islamic Dilemma/);
  assert.match(html, /src="\/projects\/islamic-dilemma-banner\.png"/);
  assert.match(html, /Android test build/);
  assert.match(html, /Re:TUI version availability[\s\S]{0,900}Windows version not available[\s\S]{0,900}Android version available/);
  assert.match(html, /TanyaOS version availability[\s\S]{0,1500}Windows version not available[\s\S]{0,1500}Linux version not available[\s\S]{0,1500}Android version not available[\s\S]{0,1500}iOS version not available/);
  assert.match(html, /Work Day with God version availability/);
  assert.match(html, /Dossier Builder version availability/);
  assert.match(html, /Character Profile Maker version availability/);
  assert.match(html, /Linux version available/);
  assert.match(html, /DEB · RPM · AppImage/);
  assert.match(html, /Android version available/);
  assert.match(html, /iOS version not available/);
  assert.match(html, /alt="Project Database project preview"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/ProjectDatabase"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("provides a persistent celestial light theme while keeping dark as default", () => {
  assert.match(globalStyles, /html\[data-theme="light"\]\{color-scheme:light;/);
  assert.match(globalStyles, /--ink:#102b5f/);
  assert.match(globalStyles, /--gold:#b98822/);
  assert.match(globalStyles, /linear-gradient\(135deg,#fdfefe 0%,#edf5ff 46%,#cddfff 100%\)/);
  assert.match(globalStyles, /\.theme-toggle\{height:38px/);
});

test("provides persistent visual accessibility preferences", async () => {
  const html = await (await render()).text();
  assert.match(html, /Skip to main content/);
  assert.match(html, /id="main-content" tabindex="-1"/);
  assert.match(globalStyles, /html\[data-high-contrast\]/);
  assert.match(globalStyles, /html\[data-color-vision\]/);
  assert.match(globalStyles, /html\[data-link-underline\]/);
  assert.match(globalStyles, /html\[data-reduce-motion\]/);
  assert.match(globalStyles, /html\[data-text-size="large"\] body\{zoom:1\.125\}/);
  assert.match(globalStyles, /\.accessibility-switch>button\[aria-checked="true"\]/);
  assert.match(globalStyles, /:where\(a,button,input,select\):focus-visible/);
});

test("keeps complete project artwork visible on phones", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@media\(max-width:760px\).*?\.project-media,.featured \.project-media\{height:auto;aspect-ratio:16\/9;/s);
  assert.match(css, /\.project-media>img,.featured \.project-media>img\{object-fit:contain!important;object-position:center!important;transform:none!important\}/);
  assert.doesNotMatch(css, /@media\(max-width:480px\).*?\.project-media,.featured \.project-media\{height:290px\}/s);
});

test("renders the supplied BridgeForge screenshot", async () => {
  const html = await (await render()).text();
  assert.match(html, /src="\/projects\/bridgeforge\.png"/);
  assert.match(html, /alt="BridgeForge project preview"/);
});

test("renders the About Me biography page", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /<title>About Me \| Majestic Creations<\/title>/i);
  assert.match(html, /src="\/about\/kenneth-salmon\.png"/);
  assert.match(html, /alt="Portrait of Kenneth Salmon"/);
  assert.match(html, /href="https:\/\/x\.com\/Cmdr_Striker"/);
  assert.match(html, /@Cmdr_Striker/);
  assert.match(html, /Follow Kenneth Salmon on X at Cmdr Striker/);
  assert.match(html, /multidisciplinary digital creative/);
  assert.match(html, /Creative Digital Media/);
  assert.match(html, /2012 through 2024/);
  assert.match(html, /Beginning in 2025/);
  assert.match(html, /take an idea, learn what is necessary to build it, and turn it into something real/);
  assert.doesNotMatch(html, /Biography content to be supplied|Absolutely — this version/);
  assert.doesNotMatch(html, /<strong>/);
  assert.doesNotMatch(html, /Photograph coming soon|Biography photograph placeholder/);
  assert.match(html, /aria-current="page">About Me<\/a>/);
  assert.match(html, /Connect \/ View Portfolios/);
});

test("renders the Majestic Creations blog", async () => {
  const response = await render("/blog");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /<title>Blog \| Majestic Creations<\/title>/i);
  assert.match(html, /The Majestic/);
  assert.match(html, /Journal\./);
  assert.match(html, /Welcome to the Majestic Creations Journal/);
  assert.match(html, /href="\/blog\/welcome-to-majestic-creations"/);
  assert.match(html, /Ideas · Process · Progress/);
  assert.match(html, /href="\/blog\/category\/studio-journal"/);
  assert.match(html, /href="\/blog\/tag\/creative-technology"/);
  assert.match(html, /href="\/rss\.xml"/);
  assert.doesNotMatch(html, /comments|giscus/i);
});

test("renders an individual blog article", async () => {
  const response = await render("/blog/welcome-to-majestic-creations");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /<title>Welcome to the Majestic Creations Journal \| Majestic Creations<\/title>/i);
  assert.match(html, /The portfolio shows the finished work/);
  assert.match(html, /What you will find here/);
  assert.match(html, /<blockquote>/);
  assert.match(html, /1 min read/);
  assert.match(html, /property="og:type" content="article"/i);
  assert.match(html, /property="article:published_time" content="2026-08-25T12:00:00Z"/i);
  assert.match(html, /Continue the conversation/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/mcographics\.github\.io\/discussions"/);
});

test("renders every new project journal article", async () => {
  const articles = [
    ["portfolio-accessibility-and-app-categories", "A More Accessible Portfolio: New Display Controls and Clearer App Categories"],
    ["creative-whiteboard-alpha", "Creative Whiteboard v0.1.0 Alpha: Making Ideas Spatial"],
    ["dossier-builder-local-first-workspace", "Dossier Builder: Professional Documents Without Giving Up Control"],
    ["project-database-v0-1-0", "Project Database v0.1.0: Give Every Project a Place"],
    ["unified-ai-studio-v1", "Unified AI Studio v1.0.0: One Home for Creative AI Tools"],
    ["words-of-yeshua-v0-5-2", "Words of Yeshua v0.5.2: Reading His Words in Context"],
    ["work-day-with-god-before-the-website", "Work Day with God: The App That Came Before the Website"],
  ];

  for (const [slug, title] of articles) {
    const response = await render(`/blog/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assertSharedMobileNavigation(html);
    assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\| Majestic Creations<\\/title>`, "i"));
    assert.match(html, /property="og:type" content="article"/i);
    assert.match(html, /Continue the conversation/);
  }
});

test("renders generated category and tag archives", async () => {
  const categoryResponse = await render("/blog/category/studio-journal");
  assert.equal(categoryResponse.status, 200);
  const categoryHtml = await categoryResponse.text();
  assertSharedMobileNavigation(categoryHtml);
  assert.match(categoryHtml, /<title>Studio Journal \| Majestic Creations Blog<\/title>/i);
  assert.match(categoryHtml, /Welcome to the Majestic Creations Journal/);

  const tagResponse = await render("/blog/tag/creative-technology");
  assert.equal(tagResponse.status, 200);
  const tagHtml = await tagResponse.text();
  assertSharedMobileNavigation(tagHtml);
  assert.match(tagHtml, /<title>Creative Technology \| Majestic Creations Blog<\/title>/i);
  assert.match(tagHtml, /Welcome to the Majestic Creations Journal/);
});

test("generates blog discovery files", async () => {
  const generated = JSON.parse(await readFile(new URL("../app/blog/generated-posts.json", import.meta.url), "utf8"));
  assert.equal(generated.posts.length, 8);
  const postsBySlug = new Map(generated.posts.map((post) => [post.slug, post]));
  assert.deepEqual([...postsBySlug.keys()].sort(), [
    "creative-whiteboard-alpha",
    "dossier-builder-local-first-workspace",
    "portfolio-accessibility-and-app-categories",
    "project-database-v0-1-0",
    "unified-ai-studio-v1",
    "welcome-to-majestic-creations",
    "words-of-yeshua-v0-5-2",
    "work-day-with-god-before-the-website",
  ]);
  assert.match(postsBySlug.get("welcome-to-majestic-creations").contentHtml, /<h2>What you will find here<\/h2>/);
  assert.deepEqual(postsBySlug.get("welcome-to-majestic-creations").tags, ["Majestic Creations", "Creative Technology", "Building in Public"]);
  assert.match(postsBySlug.get("work-day-with-god-before-the-website").contentHtml, /<h2>A devotional for the whole year<\/h2>/);
  assert.match(postsBySlug.get("portfolio-accessibility-and-app-categories").contentHtml, /<h2>Accessibility preferences across the site<\/h2>/);
  assert.deepEqual(postsBySlug.get("portfolio-accessibility-and-app-categories").tags, ["Majestic Creations", "Accessibility", "App Development", "Website Updates"]);

  const rss = await readFile(new URL("../public/rss.xml", import.meta.url), "utf8");
  assert.match(rss, /<rss version="2\.0">/);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/welcome-to-majestic-creations\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/work-day-with-god-before-the-website\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/project-database-v0-1-0\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/portfolio-accessibility-and-app-categories\//);

  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/category\/studio-journal\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/category\/faith-and-technology\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/tag\/creative-technology\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/work-day-with-god-before-the-website\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/portfolio-accessibility-and-app-categories\//);

  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/mcographics\.github\.io\/sitemap\.xml/);
});

test("renders the community gateway", async () => {
  const response = await render("/community");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /<title>Community \| Majestic Creations<\/title>/i);
  assert.match(html, /Your ideas\./);
  assert.match(html, /Our community\./);
  assert.match(html, /Announcements/);
  assert.match(html, /Ideas &amp; Feedback/);
  assert.match(html, /Questions &amp; Support/);
  assert.match(html, /A free GitHub account is required/);
});
