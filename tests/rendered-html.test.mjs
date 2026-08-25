import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repositoryStatus = JSON.parse(await readFile(new URL("../app/repository-status.json", import.meta.url), "utf8"));
const expectedPrivateProjects = Object.values(repositoryStatus.repositories).filter((repository) => repository.visibility === "PRIVATE").length;

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

test("server-renders the Majestic Creations portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Majestic Creations \| Apps, Games, Worlds &amp; Ideas<\/title>/i);
  assert.match(html, /property="og:type" content="website"/i);
  assert.match(html, /property="og:site_name" content="Majestic Creations"/i);
  assert.match(html, /property="og:image" content="http:\/\/localhost:3000\/og\.png"/i);
  assert.match(html, /property="og:image:width" content="1200"/i);
  assert.match(html, /property="og:image:height" content="630"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /name="twitter:image" content="http:\/\/localhost:3000\/og\.png"/i);
  assert.match(html, /Turning bold ideas/);
  assert.match(html, /Connect \/ View Portfolios/);
  assert.match(html, /href="https:\/\/ko-fi\.com\/cmdrstriker"/);
  assert.match(html, /Ko-fi Donate/);
  assert.match(html, /href="https:\/\/paypal\.me\/mcographics\?locale\.x=en_US&amp;country\.x=CA"/);
  assert.match(html, /PayPal Donate/);
  assert.doesNotMatch(html, /Direct donation options will be added here soon/);
  assert.match(html, /into digital reality\./);
  assert.doesNotMatch(html, /Building useful/);
  assert.match(html, /All<br\/><em>projects\.<\/em>/);
  assert.match(html, /Work Day with God/);
  assert.match(html, /src="\/projects\/work-day-with-god-featured\.png"/);
  assert.match(html, /alt="Work Day with God logo artwork"/);
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
  assert.equal((html.match(/Release available/g) ?? []).length, 2);
  assert.doesNotMatch(html, />Released</);
  assert.doesNotMatch(html, /Active release/);
  assert.doesNotMatch(html, /Active development/);
  assert.match(html, /project-status status-release-available/);
  assert.match(html, /project-status status-in-development/);
  assert.match(html, /src="\/brand\/github-invertocat-white\.png"/);
  assert.doesNotMatch(html, /aria-label="Open [^"]+">↗<\/a>/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/Re-TUI"/);
  assert.doesNotMatch(html, /href="https:\/\/re-tui\.pages\.dev"/);
  assert.equal((html.match(/project-lock private/g) ?? []).length, expectedPrivateProjects);
  assert.equal((html.match(/>Private<\/span>/g) ?? []).length, expectedPrivateProjects);
  assert.equal((html.match(/>Studio project<\/span>/g) ?? []).length, 1);
  assert.equal((html.match(/version availability/g) ?? []).length, 16);
  assert.match(html, /Work Day with God version availability/);
  assert.match(html, /Linux version available/);
  assert.match(html, /DEB · RPM · AppImage/);
  assert.match(html, /Android version available/);
  assert.match(html, /iOS version not available/);
  assert.match(html, /alt="Project Database project preview"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/ProjectDatabase"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
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
