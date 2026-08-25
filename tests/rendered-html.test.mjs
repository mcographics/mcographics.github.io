import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
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
  assert.match(html, /Building useful/);
  assert.match(html, /All<br\/><em>projects\.<\/em>/);
  assert.match(html, /Work Day with God/);
  assert.match(html, /Words of Yeshua/);
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
  assert.match(html, /alt="Project Database project preview"/);
  assert.match(html, /href="https:\/\/github\.com\/mcographics\/ProjectDatabase"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("renders the supplied BridgeForge screenshot", async () => {
  const html = await (await render()).text();
  assert.match(html, /src="\/projects\/bridgeforge\.png"/);
  assert.match(html, /alt="BridgeForge project preview"/);
});
