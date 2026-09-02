import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repositoryStatus = JSON.parse(await readFile(new URL("../app/repository-status.json", import.meta.url), "utf8"));
const scriptureVerses = JSON.parse(await readFile(new URL("../app/scripture-verses.json", import.meta.url), "utf8"));
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const homepageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
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

test("locks the mobile page and header to the viewport", () => {
  assert.match(globalStyles, /html,body\{[^}]*max-width:100%;overflow-x:hidden;overscroll-behavior-x:none\}/);
  assert.match(globalStyles, /@media\(max-width:760px\)\{\.site-header\{position:fixed;top:0;right:0;bottom:auto;left:0;width:100%;max-width:100%;transform:none\}/);
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
  const contact = primaryNav.indexOf('>Contact Us</a>');
  assert.ok(projects < blog && blog < community && community < about && about < studio && studio < support && support < contact, "navigation should follow the portfolio-first order");
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
  assert.match(html, /Portfolios &amp; Socials/);
  assert.doesNotMatch(html, /Connect \/ View Portfolios/);
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
  assert.match(html, /href="\/projects\/work-day-with-god"/);
  assert.match(html, /href="\/projects\/bible-recorder-note-taker"/);
  assert.match(html, /Explore the full project/);
  assert.match(html, /class="hero-feature"/);
  assert.match(html, /aria-label="Featured releases carousel"/);
  assert.match(html, /class="feature-slideshow featured-release-card featured-release-card-0 is-active"/);
  assert.match(html, /class="feature-slideshow featured-release-card featured-release-card-1 is-next"/);
  assert.match(html, /class="feature-slideshow featured-release-card featured-release-card-4 is-previous"/);
  assert.match(html, /href="\/projects\/words-of-yeshua"/);
  assert.match(html, /href="\/projects\/public-nuisance"/);
  assert.match(html, /aria-label="Featured application control"/);
  assert.match(html, /aria-label="Select previous featured application"/);
  assert.match(html, /aria-label="Select next featured application"/);
  assert.match(html, /aria-label="Choose a featured application"/);
  assert.match(html, /App Control/);
  assert.match(globalStyles, /\.hero-feature\{left:-25%;width:min\(460px,100%\);padding:0;background:transparent;border:0;box-shadow:none;transform:scale\(1\.2\);transform-origin:50% 50%/);
  assert.match(globalStyles, /\.hero-feature:hover\{transform:scale\(1\.2\)/);
  assert.match(globalStyles, /\.hero-feature \.featured-release-card\.is-active\{[^}]*translateZ\(75px\) scale\(1\)/);
  assert.match(globalStyles, /\.hero-feature \.featured-release-card\.is-previous\{[^}]*rotateY\(30deg\) scale\(\.72\)/);
  assert.match(globalStyles, /\.hero-feature \.featured-release-card\.is-next\{[^}]*rotateY\(-30deg\) scale\(\.72\)/);
  assert.match(globalStyles, /\.featured-orbit-base\{[^}]*left:50%[^}]*bottom:-83px[^}]*width:480px[^}]*height:480px[^}]*overflow:visible[^}]*clip-path:none/);
  assert.match(globalStyles, /\.featured-orbit-base-image\{[^}]*left:12px[^}]*top:12px[^}]*width:456px[^}]*height:456px[^}]*clip-path:none/);
  assert.match(globalStyles, /\.featured-orbit-system:after\{[^}]*left:50%[^}]*width:468px[^}]*transform:translateX\(-50%\)/);
  assert.match(globalStyles, /\.featured-orbit-base\{width:620px;height:620px;bottom:-116px\}/);
  assert.match(globalStyles, /\.featured-orbit-base-image\{width:596px;height:596px\}/);
  assert.match(globalStyles, /\.featured-orbit-system:after\{width:600px;height:138px;bottom:28px\}/);
  assert.match(globalStyles, /\.hero-feature\{top:25%\}/);
  assert.match(globalStyles, /\.featured-orbital-stage\{height:560px;min-height:560px\}/);
  assert.match(globalStyles, /\.hero-feature \.featured-release-card\{width:250px;max-width:250px;height:auto;aspect-ratio:2040\/4000\}/);
  assert.match(globalStyles, /@media\(max-width:760px\)\{\.hero-feature\{left:0;display:block/);
  assert.match(html, /Featured release/);
  assert.match(html, /data-dark-src="\/projects\/work-day-with-god-slides\/viewingmode\/darkmode\/01-todays-devotional\.png"/);
  assert.match(html, /data-light-src="\/projects\/work-day-with-god-slides\/viewingmode\/lightmode\/01-todays-devotional\.png"/);
  assert.match(html, /data-dark-src="\/projects\/work-day-with-god-slides\/00-work-day-with-god-cover\.png" data-light-src="\/projects\/work-day-with-god-slides\/00-work-day-with-god-cover\.png"/);
  assert.match(html, /data-light-src="\/projects\/words-of-yeshua-slides\/viewingmode\/lightmode\/words_of_yeshua_01_cropped\.png"/);
  assert.match(html, /data-dark-src="\/projects\/words-of-yeshua-featured\.png" data-light-src="\/projects\/words-of-yeshua-featured\.png"/);
  assert.match(html, /Words of Yeshua/);
  assert.match(html, /Public Nuisance/);
  assert.match(html, /05(?:<!-- -->)? cards/);
  assert.match(html, /data-dark-src="\/projects\/bible-recorder-splash\.png" data-light-src="\/projects\/bible-recorder-splash\.png"/);
  assert.match(html, /data-dark-src="\/projects\/bible-recorder-banner\.png" data-light-src="\/projects\/bible-recorder-banner\.png"/);
  assert.match(html, /href="\/projects\/bible-recorder-note-taker"/);
  assert.match(html, /data-dark-src="\/projects\/public-nuisance-featured\.png" data-light-src="\/projects\/public-nuisance-featured\.png"/);
  assert.match(html, /data-dark-src="\/projects\/chainbreaker-splash\.png" data-light-src="\/projects\/chainbreaker-splash\.png"/);
  assert.doesNotMatch(globalStyles, /\.featured-release-card-2::after/);
  assert.doesNotMatch(globalStyles, /featured-card-track-spin/);
  assert.match(homepageSource, /setSelectedReleaseIndex\(\(current\) => \(current \+ 1\) % featuredReleaseSlides\.length\)/);
  assert.match(homepageSource, /setFeaturedSlide\(\(current\) => \(current \+ 1\) % slideCount\)/);
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
  assert.match(html, /Public Nuisance/);
  assert.match(html, /src="\/projects\/public-nuisance-banner\.png"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/REALLIFENEWS--GTA-STYLED-"/);
  assert.match(html, /aria-label="Download Public Nuisance"/);
  assert.match(html, /Character Profile Maker/);
  assert.match(html, /src="\/projects\/character-profile-maker\.png"/);
  assert.match(html, /alt="Character Profile Maker project preview"/);
  const characterCardStart = html.indexOf('data-project-title="Character Profile Maker"');
  const characterCardEnd = html.indexOf("</article>", characterCardStart);
  assert.ok(characterCardStart >= 0 && characterCardEnd > characterCardStart, "Character Profile Maker card should be rendered");
  assert.match(html.slice(characterCardStart, characterCardEnd), /class="project-lock private"[^>]*>Private<\/span>/);
  assert.match(html, /Releases Available/);
  const releaseFilter = html.indexOf('data-filter="Releases Available"');
  const allFilter = html.indexOf('data-filter="All"');
  const appsFilter = html.indexOf('data-filter="Apps"');
  const creativeFilter = html.indexOf('data-filter="Creative"');
  const gameDevFilter = html.indexOf('data-filter="Game Dev"');
  const experimentsFilter = html.indexOf('data-filter="Experiments"');
  const faithBasedFilter = html.indexOf('data-filter="Faith-Based"');
  const automotiveFilter = html.indexOf('data-filter="Automotive"');
  assert.ok(releaseFilter < allFilter && allFilter < appsFilter && appsFilter < creativeFilter && creativeFilter < gameDevFilter && gameDevFilter < experimentsFilter && experimentsFilter < faithBasedFilter && faithBasedFilter < automotiveFilter, "filters should follow the release-first portfolio order");
  assert.equal((html.match(/data-categories="[^"]*Apps[^"]*"/g) ?? []).length, 19);
  assert.match(html, /data-project-title="ChainBreaker"/);
  assert.match(html, /ChainBreaker-0\.0\.4\.apk/);
  const projectCards = [...html.matchAll(/<article class="project-card"[\s\S]*?<\/article>/g)].map((match) => match[0]);
  assert.ok(projectCards.length > 1, "project cards should be rendered");
  assert.equal(projectCards.filter((card) => /class="site-share project-share"/.test(card)).length, projectCards.length - 1, "every project card except TanyaOS should offer sharing");
  const tanyaCard = projectCards.find((card) => /data-project-title="TanyaOS"/.test(card));
  assert.ok(tanyaCard, "TanyaOS card should be rendered");
  assert.doesNotMatch(tanyaCard, /class="site-share project-share"/);
  const chainBreakerCard = projectCards.find((card) => /data-project-title="ChainBreaker"/.test(card)) ?? "";
  assert.match(chainBreakerCard, /aria-label="Share ChainBreaker \| Majestic Creations"[^>]*>Share<\/button>/);
  assert.doesNotMatch(chainBreakerCard, /aria-label="Share ChainBreaker \| Majestic Creations"[^>]*>[^<]*↗/);
  assert.match(html, /data-filter="Automotive"[^>]*>Automotive<span class="filter-count">1<\/span>/);
  assert.match(html, /data-project-title="FieroLink GT" data-categories="Apps Automotive"/);
  assert.match(html, /src="\/projects\/fierolink-gt\.png"/);
  const fieroCardStart = html.indexOf('data-project-title="FieroLink GT"');
  const fieroCardEnd = html.indexOf("</article>", fieroCardStart);
  assert.match(html.slice(fieroCardStart, fieroCardEnd), /class="project-lock private"[^>]*>Private<\/span>/);
  assert.match(html, /local-first Windows Fiero telemetry prototype/);
  assert.match(html, /receive-only ALDL serial transport, raw capture monitoring/);
  assert.match(html, /href="mailto:majesticcreationsottawa@outlook\.com\?subject=FieroLink%20GT%20access%20request"[^>]*aria-label="Request access to FieroLink GT"/);
  assert.match(html, />Request Required<\/a>/);
  assert.match(html, /data-project-title="TanyaOS" data-categories="Experiments"/);
  assert.match(html, /data-project-title="BridgeForge" data-categories="Game Dev"/);
  assert.doesNotMatch(html, /data-project-title="(?:TanyaOS|BridgeForge)" data-categories="[^"]*Apps/);
  assert.match(html, /data-project-title="Creative Whiteboard" data-categories="Creative Apps"/);
  assert.match(html, /data-project-title="Work Day with God" data-categories="Faith-Based Apps"/);
  assert.match(html, /class="release-label full">Releases Available/);
  assert.match(html, /class="release-label short">Releases/);
  assert.equal((html.match(/project-status status-release-available/g) ?? []).length, 5);
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
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Netrunner-Launcher"/);
  assert.match(html, /src="\/projects\/netrunner-launcher-banner-v1\.png"/);
  assert.doesNotMatch(html, /href="https:\/\/github\.com\/mcographics\/Re-TUI"/);
  assert.doesNotMatch(html, /href="https:\/\/re-tui\.pages\.dev"/);
  assert.equal((html.match(/project-lock private/g) ?? []).length, expectedPrivateProjects);
  assert.equal((html.match(/>Private<\/span>/g) ?? []).length, expectedPrivateProjects);
  assert.equal((html.match(/project-lock public/g) ?? []).length, Object.values(repositoryStatus.repositories).filter((repository) => repository.visibility === "PUBLIC").length);
  assert.equal((html.match(/>Public<\/span>/g) ?? []).length, Object.values(repositoryStatus.repositories).filter((repository) => repository.visibility === "PUBLIC").length);
  assert.equal((html.match(/>Studio project<\/span>/g) ?? []).length, 0);
  assert.equal((html.match(/version availability/g) ?? []).length, 21);
  assert.equal((html.match(/Windows version available/g) ?? []).length, 15);
  assert.equal((html.match(/Windows version not available/g) ?? []).length, 6);
  assert.equal((html.match(/Android version available/g) ?? []).length, 7);
  assert.match(html, /The Islamic Dilemma/);
  assert.match(html, /src="\/projects\/islamic-dilemma-banner\.png"/);
  assert.match(html, /Android test build/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Islamic-Dilemma-Test-Builds\/releases\/download\/test-build-0\.1\.1-test\.4\/Islamic-Dilemma-0\.1\.1-test\.4\.apk"/);
  assert.match(html, /Netrunner-Launcher version availability[\s\S]{0,900}Windows version not available[\s\S]{0,900}Android version available/);
  assert.match(html, /TanyaOS version availability[\s\S]{0,1500}Windows version not available[\s\S]{0,1500}Linux version not available[\s\S]{0,1500}Android version not available[\s\S]{0,1500}iOS version not available/);
  assert.match(html, /Work Day with God version availability/);
  assert.match(html, /aria-label="Choose a version of Work Day with God"/);
  assert.match(html, /aria-label="The Islamic Dilemma version availability"/);
  assert.match(html, /aria-label="Android version available"/);
  for (const slug of ["the-islamic-dilemma", "unified-ai-studio", "fierolink-gt", "creative-whiteboard", "comic-organizer", "dossier-builder", "truth-news", "netrunner-launcher", "bridgeforge", "grace-seek", "space-eye", "tanyaos", "workspaces", "project-database", "gamingbible", "character-profile-maker", "bible-recorder-note-taker"]) {
    assert.match(html, new RegExp(`href="/projects/${slug}"`), slug);
  }
  assert.match(html, /aria-label="Choose a version of Words of Yeshua"/);
  assert.match(homepageSource, /id: "words-of-yeshua", title: "Words of Yeshua", eyebrow: "Scripture study application", href: "\/projects\/words-of-yeshua"/);
  assert.match(homepageSource, /words-of-yeshua-featured\.png/);
  assert.match(homepageSource, /words_of_yeshua_10_cropped\.png/);
  assert.equal((html.match(/class="project-download"/g) ?? []).length, 8);
  assert.equal((html.match(/>Download<\/a>/g) ?? []).length, 4);
  assert.equal((html.match(/>Choose Version<\/button>/g) ?? []).length, 4);
  assert.doesNotMatch(html, /class="project-download">↓/);
  assert.match(homepageSource, /title: "FieroLink GT"/);
  assert.match(homepageSource, /workDayReleases\.windows\.version/);
  assert.match(homepageSource, /workDayReleases\.android\.version/);
  assert.match(homepageSource, /workDayReleases\.linux\.version/);
  assert.match(globalStyles, /\.project-download\{[^}]*padding:0;border:0;background:transparent/);
  assert.match(globalStyles, /\.project-actions>a:not\(\.project-download\):not\(\.project-lock\)\{/);
  assert.match(globalStyles, /\.project-share \.site-share-toggle\{width:auto;min-width:62px;height:36px/);
  assert.match(globalStyles, /\.project-card:has\(\.project-share \.share-menu\)\{z-index:20;overflow:visible\}/);
  assert.doesNotMatch(globalStyles, /\.project-download\{[^}]*border:1px/);
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
  assert.match(globalStyles, /--night:#efede7/);
  assert.match(globalStyles, /--ink:#102b5f/);
  assert.match(globalStyles, /--gold:#b98822/);
  assert.match(globalStyles, /linear-gradient\(135deg,#efede7 0%,#e4e8ec 46%,#c5d1e2 100%\)/);
  assert.doesNotMatch(globalStyles, /html\[data-theme="light"\] body\{background:#f8fbff/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.filter-bar button\{background:#eceae4/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.filter-bar button\.active\{background:#cdd7e4/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.filter-bar button\.release-filter\{background:#e2e8df/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.hero-actions \.button\.ghost\{color:#111/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.hero-actions \.button\.ghost:hover\{color:#111/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.support \.button\.ghost\{color:#111/);
  assert.match(globalStyles, /html\[data-theme="light"\] \.support \.button\.ghost:hover\{color:#111/);
  assert.match(globalStyles, /\.theme-toggle\{height:38px/);
});

test("provides persistent visual accessibility preferences", async () => {
  const html = await (await render()).text();
  assert.match(html, /Skip to main content/);
  assert.match(html, /id="main-content" tabindex="-1"/);
  assert.match(globalStyles, /html\[data-high-contrast\]/);
  assert.match(globalStyles, /html\[data-color-vision="protanopia"\] #main-content\{filter:url\(#color-filter-protanopia\)\}/);
  assert.match(globalStyles, /html\[data-color-vision="deuteranopia"\] #main-content\{filter:url\(#color-filter-deuteranopia\)\}/);
  assert.match(globalStyles, /html\[data-color-vision="tritanopia"\] #main-content\{filter:url\(#color-filter-tritanopia\)\}/);
  assert.match(html, /color-filter-protanopia/);
  const colorMatrices = [...html.matchAll(/<filter id="color-filter-(?:protanopia|deuteranopia|tritanopia)"[^>]*><feColorMatrix values="([^"]+)"/g)];
  assert.equal(colorMatrices.length, 3);
  for (const [, values] of colorMatrices) {
    const matrix = values.trim().split(/\s+/).map(Number);
    assert.equal(matrix.length, 20);
    assert.deepEqual(matrix.slice(15), [0, 0, 0, 1, 0], "color-vision filters must preserve source opacity");
  }
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
  assert.match(html, /Portfolios &amp; Socials/);
  assert.doesNotMatch(html, /Connect \/ View Portfolios/);
});

test("renders the Contact Us form and delivery target", async () => {
  const response = await render("/contact");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /<title>Contact Us \| Majestic Creations<\/title>/i);
  assert.match(html, /<h1 id="contact-heading">Contact<br[^>]*><em>us\.<\/em><\/h1>/);
  assert.match(html, /<form class="contact-form" action="https:\/\/formsubmit\.co\/majesticcreationsottawa@outlook\.com" method="POST">/);
  assert.match(html, /name="name"/);
  assert.match(html, /id="contact-name"[^>]*required/);
  assert.match(html, /name="email"/);
  assert.match(html, /id="contact-email"[^>]*type="email"[^>]*required/);
  assert.match(html, /name="project"/);
  assert.match(html, /name="message"/);
  assert.match(html, /id="contact-message"[^>]*required/);
  assert.match(html, /name="_next" value="https:\/\/mcographics\.github\.io\/contact\?sent=1#contact-form-heading"/);
  assert.match(html, /majesticcreationsottawa@outlook\.com/);
  assert.match(html, /href="\/contact">Contact Us<\/a>/);
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
  assert.match(html, /Public Nuisance v1\.1\.1: Real Headlines, Questionable Commentary/);
  assert.match(html, /src="\/projects\/public-nuisance-banner\.png"/);
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

test("uses the Work Day with God banner for origin story entry 07", async () => {
  const response = await render("/blog/work-day-with-god-before-the-website");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="article-cover" src="\/projects\/work-day-with-god\.png"/);
  assert.doesNotMatch(html, /article-cover[^>]+work-day-with-god-featured\.png/);
  assert.match(globalStyles, /\.article-cover\[src\$="work-day-with-god\.png"\]\{aspect-ratio:auto;height:auto;object-fit:contain/);
});

test("renders the complete Work Day with God product page", async () => {
  const response = await render("/projects/work-day-with-god");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/projects\/work-day-with-god\.png"/i);
  assert.match(html, /name="twitter:image" content="http:\/\/localhost:3000\/projects\/work-day-with-god\.png"/i);
  assert.doesNotMatch(html, /property="og:image" content="http:\/\/localhost:3000\/og\.png"/i);
  assert.match(html, /<title>Work Day with God — Offline Christian Devotional App \| Majestic Creations<\/title>/i);
  assert.match(html, /rel="canonical" href="http:\/\/localhost:3000\/projects\/work-day-with-god\/"/i);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"operatingSystem":"Windows 10 or newer; Android 7\.0 or newer; Linux x64 testing preview"/);
  assert.match(html, /"price":"0","priceCurrency":"CAD"/);
  assert.match(html, /Your devotional life is not a dataset/);
  assert.match(html, /Work Day with God platform availability/);
  assert.match(html, /Windows x64/);
  assert.match(html, /Android 7\.0\+/);
  assert.match(html, /Linux x64/);
  assert.match(html, /iOS 15\+/);
  assert.match(html, /Work-Day-with-God-Setup-1\.4\.9\.exe/);
  assert.match(html, /Work-Day-with-God-Android-1\.0\.4\.apk/);
  assert.match(html, /aria-label="Quick download options"/);
  assert.match(html, /class="platform-download" href="https:\/\/github\.com\/mcographics\/WorkDaywithGod\/releases\/download\/v1\.4\.9\/Work-Day-with-God-Setup-1\.4\.9\.exe">Download EXE/);
  assert.match(html, /class="platform-download" href="https:\/\/github\.com\/mcographics\/WorkDaywithGod\/releases\/download\/android-v1\.0\.4\/Work-Day-with-God-Android-1\.0\.4\.apk">Download APK/);
  assert.match(html, /class="platform-download" href="#linux-downloads">Choose package/);
  assert.match(html, /id="linux-downloads"/);
  assert.match(html, /Work-Day-with-God-Android-1\.0\.4\.apk\.sha256/);
  assert.match(html, /Work-Day-with-God-1\.4\.4-linux-x86_64\.AppImage/);
  assert.match(html, /data-dark-src="\/projects\/work-day-with-god-slides\/viewingmode\/darkmode\/01-todays-devotional\.png"/);
  assert.match(html, /data-light-src="\/projects\/work-day-with-god-slides\/viewingmode\/lightmode\/01-todays-devotional\.png"/);
  assert.match(html, /href="\.\.\/\.\.\/blog\/work-day-with-god-before-the-website\//);
});

test("uses the Public Nuisance banner for its journal and project connection", async () => {
  const articleResponse = await render("/blog/public-nuisance-v1-1-1");
  assert.equal(articleResponse.status, 200);
  const articleHtml = await articleResponse.text();
  assert.match(articleHtml, /<title>Public Nuisance v1\.1\.1: Real Headlines, Questionable Commentary \| Majestic Creations<\/title>/i);
  assert.match(articleHtml, /class="article-cover" src="\/projects\/public-nuisance-banner\.png"/);
  assert.match(articleHtml, /href="https:\/\/github\.com\/mcographics\/REALLIFENEWS--GTA-STYLED-\/releases\/tag\/v1\.1\.1"/);
  assert.match(globalStyles, /\.article-cover\[src\$="public-nuisance-banner\.png"\]\{aspect-ratio:auto;height:auto;object-fit:contain/);

  const projectResponse = await render("/projects/public-nuisance");
  assert.equal(projectResponse.status, 200);
  const projectHtml = await projectResponse.text();
  assert.match(projectHtml, /href="\/blog\/public-nuisance-v1-1-1\/">Read the project journal/);
  assert.match(projectHtml, /src="\/projects\/public-nuisance-banner\.png"/);
});

test("uses the supplied ChainBreaker banner for its journal", async () => {
  const articleResponse = await render("/blog/chainbreaker-android-mvp");
  assert.equal(articleResponse.status, 200);
  const articleHtml = await articleResponse.text();
  assert.match(articleHtml, /<title>ChainBreaker 0\.0\.1: Break the Chains\. Build the Man\. \| Majestic Creations<\/title>/i);
  assert.match(articleHtml, /class="article-cover" src="\/projects\/chainbreaker-blog-banner\.png"/);
  assert.match(globalStyles, /\.article-cover\[src\$="chainbreaker-blog-banner\.png"\]\{aspect-ratio:auto;height:auto;object-fit:contain/);
});

test("uses a wide 16:9 cover frame for the new project pages", async () => {
  assert.match(globalStyles, /\.generic-product \.product-cover\{width:min\(560px,100%\)\}/);
  assert.match(globalStyles, /\.generic-product \.product-cover img,\.generic-product \.product-cover>\.generated-visual\{aspect-ratio:16\/9;object-fit:contain\}/);
});

test("renders the complete Words of Yeshua product page", async () => {
  const response = await render("/projects/words-of-yeshua");
  assert.equal(response.status, 200);
  const html = await response.text();
  assertSharedMobileNavigation(html);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/projects\/words-of-yeshua\.png"/i);
  assert.match(html, /name="twitter:image" content="http:\/\/localhost:3000\/projects\/words-of-yeshua\.png"/i);
  assert.doesNotMatch(html, /property="og:image" content="http:\/\/localhost:3000\/og\.png"/i);
  assert.match(html, /<title>Words of Yeshua — Christ-Centred Scripture Study App \| Majestic Creations<\/title>/i);
  assert.match(html, /rel="canonical" href="http:\/\/localhost:3000\/projects\/words-of-yeshua\/"/i);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"softwareVersion":"0\.5\.5 \(Windows\), 0\.1\.2 \(Android\)"/);
  assert.match(html, /Words of Yeshua platform availability/);
  assert.match(html, /Words-of-Yeshua-Setup-0\.5\.5\.exe/);
  assert.match(html, /Words-of-Yeshua-Android-0\.1\.2\.apk/);
  assert.match(html, /Words-of-Yeshua-Android-0\.1\.2\.apk\.sha256/);
  assert.match(html, /Android 7\.0\+/);
  assert.match(html, /src="\/projects\/words-of-yeshua-android-home\.png"/);
  assert.match(html, /src="\/projects\/words-of-yeshua-android-home-scroll-02\.png"/);
  assert.match(html, /src="\/projects\/words-of-yeshua-android-explore-scroll-01\.png"/);
  assert.match(html, /src="\/projects\/words-of-yeshua-android-settings\.png"/);
  assert.match(html, /aria-label="Words of Yeshua screenshot gallery"/);
  assert.match(html, /viewingmode\/lightmode\/words_of_yeshua_08_cropped\.png/);
  assert.match(html, /href="\/blog\/words-of-yeshua-android-v0-1-2"/);
});

test("renders a full project page for every formerly card-only project", async () => {
  const projects = [
    ["the-islamic-dilemma", "The Islamic Dilemma", "islamic-dilemma-banner.png"], ["unified-ai-studio", "Unified AI Studio", "unified-ai-studio-logo.png"], ["fierolink-gt", "FieroLink GT", "fierolink-gt.png"], ["creative-whiteboard", "Creative Whiteboard", "creative-whiteboard.png"],
    ["comic-organizer", "Comic Organizer", "comic-organizer.png"], ["dossier-builder", "Dossier Builder", "dossier-builder.png"], ["truth-news", "Truth News", "truth-news.jpg"], ["netrunner-launcher", "Netrunner-Launcher", "netrunner-launcher-banner-v1.png"],
    ["bridgeforge", "BridgeForge", "bridgeforge.png"], ["grace-seek", "Grace Seek", "grace-seek.png"], ["space-eye", "Space Eye", "space-eye.png"], ["tanyaos", "TanyaOS", "tanya-os.png"],
    ["workspaces", "WorkSpaces", "workspaces.png"], ["project-database", "Project Database", "project-database.png"], ["gamingbible", "GamingBible", "gamingbible.png"], ["character-profile-maker", "Character Profile Maker", "character-profile-maker.png"],
  ];
  for (const [slug, title, image] of projects) {
    const response = await render(`/projects/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    assertSharedMobileNavigation(html);
    assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")} \\| Majestic Creations<\\/title>`, "i"));
    assert.ok(html.includes(`<meta property="og:image" content="http://localhost:3000/projects/${image}"`), `${slug} should use its card artwork for og:image`);
    assert.ok(html.includes(`<meta name="twitter:image" content="http://localhost:3000/projects/${image}"`), `${slug} should use its card artwork for twitter:image`);
    assert.doesNotMatch(html, /property="og:image" content="http:\/\/localhost:3000\/og\.png"/i);
    assert.match(html, /class="product-page generic-product"/);
    assert.match(html, /class="product-back"/);
    assert.match(html, /href="\.\.\/\.\.\/#work"/);
    assert.match(html, /A clear place for the idea to take shape\./);
    assert.match(html, /class="product-feature-grid"/);
    assert.match(html, /class="product-related"/);
  }
});

test("renders the Bible Recorder & Note Taker release page and captured workflow", async () => {
  const response = await render("/projects/bible-recorder-note-taker");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Bible Recorder &amp; Note Taker \| Majestic Creations<\/title>/i);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/projects\/bible-recorder-banner\.png"/i);
  assert.match(html, /Bible Recorder &amp; Note Taker 1\.0\.2 is available/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Bible-Recorder-Note-Taker\/releases\/download\/v1\.0\.2\/Bible-Recorder-Note-Taker-1\.0\.2\.apk"/);
  for (const name of ["01-recording", "02-bible-reader", "03-notes", "04-search"]) {
    assert.match(html, new RegExp(`/projects/bible-recorder-note-taker-screens/${name}\\.png`));
  }
  assert.match(html, /href="\/blog\/bible-recorder-note-taker-1-0-0\//);
  assert.match(html, /no sample study or fake notes are seeded/i);
});

test("labels Netrunner-Launcher as Kenneth's customized upstream fork", async () => {
  const response = await render("/projects/netrunner-launcher");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Netrunner-Launcher \| Majestic Creations<\/title>/i);
  assert.match(html, /Kenneth Salmon[^<]*customized fork of DvilSpawn[^<]*Re:TUI/i);
  assert.match(html, /Francesco Andreuzzi[^<]*original T-UI Console Launcher/i);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Netrunner-Launcher"/);
  assert.match(html, /href="https:\/\/github\.com\/DvilSpawn\/Re-TUI"/);
  assert.match(html, /Original developer repository/);
  assert.match(html, /src="\/projects\/netrunner-launcher-banner-v1\.png"/);
  assert.match(html, /alt="Red and black Netrunner-Launcher cyberpunk terminal banner"/);

  const redirect = await readFile(new URL("../public/projects/re-tui/index.html", import.meta.url), "utf8");
  assert.match(redirect, /url=\/projects\/netrunner-launcher\//);
  assert.match(redirect, /rel="canonical" href="https:\/\/mcographics\.github\.io\/projects\/netrunner-launcher\/"/);

  const banner = await readFile(new URL("../public/projects/netrunner-launcher-banner-v1.png", import.meta.url));
  assert.equal(createHash("sha256").update(banner).digest("hex"), "9b8166f0d79857935979b3b4ad273088a22c3328199b273591e792402291f053");
  assert.match(globalStyles, /data-project-title="Netrunner-Launcher"[^}]*background:#050000/);
  assert.match(globalStyles, /data-project-title="Netrunner-Launcher"[^}]*object-fit:contain;object-position:center/);
});

test("keeps FieroLink GT behind request-required special access", async () => {
  const response = await render("/projects/fierolink-gt");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>FieroLink GT \| Majestic Creations<\/title>/i);
  assert.match(html, /src="\/projects\/fierolink-gt-banner\.png"/);
  assert.match(html, /Request required/);
  assert.match(html, /href="mailto:majesticcreationsottawa@outlook\.com\?subject=FieroLink%20GT%20access%20request"/);
  assert.match(html, />Read first/);
  assert.match(html, /Special access only: a request is required before access can be granted\./);
  assert.match(html, /Experimental vehicle access/);
  assert.match(html, /READ FIRST/);
  assert.match(html, /What is ready today\?/);
  assert.match(html, /Continue with Request/);
  assert.match(html, /No real Fiero vehicle test has been completed/);
  assert.match(html, /Send an inquiry through Contact Us/);
  assert.match(html, /Windows COM-port and adapter discovery/);
  assert.doesNotMatch(html, /<p>A local-first Windows vehicle intelligence platform[^<]*<\/p>[^]*<p>A local-first Windows vehicle intelligence platform/);
  assert.doesNotMatch(html, /GitHub repository/);
  assert.doesNotMatch(html, /href="https:\/\/github\.com\/mcographics\/FieroLink/);
});

test("renders the captured Islamic Dilemma app screenshots", async () => {
  const response = await render("/projects/the-islamic-dilemma");
  const html = await response.text();
  assert.match(html, /Captured from the Android test build/);
  assert.match(html, /aria-labelledby="project-screenshots-heading"/);
  for (const name of ["01-home", "02-dilemmas", "03-compare", "04-evidence"]) {
    assert.match(html, new RegExp(`/projects/islamic-dilemma-screens/${name}\\.png`));
  }
});

test("renders the fresh ChainBreaker 0.0.4 app screenshots", async () => {
  const response = await render("/projects/chainbreaker");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /ChainBreaker 0\.0\.4 running on a connected Samsung phone/);
  for (const name of ["01-onboarding", "02-home", "03-word", "04-brotherhood", "05-build", "06-my-journey", "07-brotherhood-article", "08-battle", "09-battle-detail", "10-settings"]) {
    assert.match(html, new RegExp(`/projects/chainbreaker-screens-v0\\.0\\.4/${name}\\.png`));
  }
  assert.match(html, /ChainBreaker-0\.0\.4\.apk/);
});

test("keeps the Islamic Dilemma screenshot gallery readable on mobile", () => {
  assert.match(globalStyles, /@media\(max-width:760px\)\{\.project-screenshot-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\);gap:12px;margin-top:38px\}/);
  assert.match(globalStyles, /@media\(max-width:460px\)\{\.project-screenshot-grid\{grid-template-columns:1fr\}\}/);
});

test("keeps the site-wide secondary pages readable on mobile", () => {
  assert.match(globalStyles, /body\{[^}]*overflow-x:hidden/);
  assert.match(globalStyles, /main\{overflow:visible\}/);
  assert.match(globalStyles, /\.journal-hero h1\{font-size:clamp\(52px,15\.5vw,82px\)/);
  assert.match(globalStyles, /\.community-hero h1\{font-size:clamp\(52px,15\.5vw,82px\)/);
  assert.match(globalStyles, /\.about-intro h1\{font-size:clamp\(52px,15\.5vw,82px\)/);
  assert.match(globalStyles, /\.article-body h2\{font-size:31px\}/);
});

test("hardens the shared mobile layout for touch screens", () => {
  assert.match(globalStyles, /@media\(max-width:760px\)\{\s*html\{scroll-padding-top:70px;-webkit-text-size-adjust:100%\}/);
  assert.match(globalStyles, /\.site-header \.mobile-nav-panel\{max-height:calc\(100svh - 70px\);overflow-y:auto/);
  assert.match(globalStyles, /\.project-heading\{flex-direction:column;gap:14px\}/);
  assert.match(globalStyles, /\.product-gallery-thumbnails button\{min-height:82px\}/);
  assert.match(globalStyles, /@media\(max-width:560px\)\{\s*\.contact-form-row\{grid-template-columns:1fr\}/);
});

test("gives banner visuals consistent rounded edges", () => {
  assert.match(globalStyles, /\.project-media,\.hero-feature,\.featured-post img,\.post-card>img,\.article-cover,\.product-cover,\.product-related>img\{border-radius:18px\}/);
  assert.match(globalStyles, /\.product-cover img\{border-radius:12px\}/);
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
    ["fierolink-gt-vehicle-intelligence", "FieroLink GT: Building a Vehicle Intelligence Workspace for the Pontiac Fiero"],
    ["words-of-yeshua-android-v0-1-0", "Words of Yeshua Android v0.1.0: A Phone-First Way to Read His Words"],
    ["words-of-yeshua-android-v0-1-2", "Words of Yeshua Android v0.1.2: A Production-Signed Update Path"],
    ["bible-recorder-note-taker-1-0-0", "Bible Recorder &amp; Note Taker 1.0.0: Record What Matters, Keep the Moment"],
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
  assert.equal(generated.posts.length, 23);
  const postsBySlug = new Map(generated.posts.map((post) => [post.slug, post]));
  assert.deepEqual([...postsBySlug.keys()].sort(), [
    "bible-recorder-note-taker-1-0-0",
    "chainbreaker-android-mvp",
    "creative-whiteboard-alpha",
    "dossier-builder-local-first-workspace",
    "featured-release-orbit-artwork-update",
    "fierolink-gt-vehicle-intelligence",
    "islamic-dilemma-0-1-1-test-4-github-updater",
    "portfolio-accessibility-and-app-categories",
    "project-database-v0-1-0",
    "public-nuisance-v1-1-1",
    "responsive-verse-card-design",
    "site-maintenance-update-august-2026",
    "smart-app-control-work-day-with-god",
    "unified-ai-studio-v1",
    "welcome-to-majestic-creations",
    "words-of-yeshua-android-v0-1-0",
    "words-of-yeshua-android-v0-1-2",
    "words-of-yeshua-v0-5-2",
    "work-day-with-god-1-4-9-android-1-0-3-update",
    "work-day-with-god-before-the-website",
    "work-day-with-god-linux-1-4-4-preview",
    "work-day-with-god-windows-1-4-4-display-scaling",
    "work-day-with-god-windows-linux-installation",
  ]);
  assert.match(postsBySlug.get("welcome-to-majestic-creations").contentHtml, /<h2>What you will find here<\/h2>/);
  assert.deepEqual(postsBySlug.get("welcome-to-majestic-creations").tags, ["Majestic Creations", "Creative Technology", "Building in Public"]);
  assert.match(postsBySlug.get("work-day-with-god-before-the-website").contentHtml, /<h2>A devotional for the whole year<\/h2>/);
  assert.match(postsBySlug.get("portfolio-accessibility-and-app-categories").contentHtml, /<h2>Accessibility preferences across the site<\/h2>/);
  assert.match(postsBySlug.get("fierolink-gt-vehicle-intelligence").contentHtml, /<h2>A modern diagnostic layer for an older car<\/h2>/);
  assert.match(postsBySlug.get("work-day-with-god-1-4-9-android-1-0-3-update").contentHtml, /<h2>Android now has its own update channel<\/h2>/);
  assert.match(postsBySlug.get("words-of-yeshua-android-v0-1-0").contentHtml, /<h2>A phone-first reader, not a shrunken desktop window<\/h2>/);
  assert.match(postsBySlug.get("words-of-yeshua-android-v0-1-0").contentHtml, /src="\/projects\/words-of-yeshua-android-home\.png"/);
  assert.match(postsBySlug.get("words-of-yeshua-android-v0-1-0").contentHtml, /src="\/projects\/words-of-yeshua-android-settings-scroll-02\.png"/);
  assert.match(postsBySlug.get("words-of-yeshua-android-v0-1-2").contentHtml, /<h2>What the corrective path exposed<\/h2>/);
  assert.deepEqual(postsBySlug.get("portfolio-accessibility-and-app-categories").tags, ["Majestic Creations", "Accessibility", "App Development", "Website Updates"]);

  const rss = await readFile(new URL("../public/rss.xml", import.meta.url), "utf8");
  assert.match(rss, /<rss version="2\.0">/);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/welcome-to-majestic-creations\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/work-day-with-god-before-the-website\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/project-database-v0-1-0\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/portfolio-accessibility-and-app-categories\//);
  assert.match(rss, /https:\/\/mcographics\.github\.io\/blog\/fierolink-gt-vehicle-intelligence\//);

  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/category\/studio-journal\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/category\/faith-and-technology\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/tag\/creative-technology\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/work-day-with-god-before-the-website\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/projects\/work-day-with-god\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/projects\/fierolink-gt\//);
  assert.match(sitemap, /https:\/\/mcographics\.github\.io\/blog\/fierolink-gt-vehicle-intelligence\//);
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
