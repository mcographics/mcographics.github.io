import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const statusPath = join(root, "app", "repository-status.json");
const tracked = [
  "Islamic-Dilemma-Test-Builds",
  "ProjectDatabase",
  "CreativeWhiteboard",
  "WordsofYeshua",
  "REALLIFENEWS--GTA-STYLED-",
];
const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "majestic-creations-portfolio-release-sync" };
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.PORTFOLIO_REPO_STATUS_TOKEN;
if (token) headers.Authorization = `Bearer ${token}`;

function labelForAsset(name) {
  if (/\.apk$/i.test(name)) return "Android APK";
  if (/\.exe$/i.test(name)) return "Windows EXE";
  if (/\.AppImage$/i.test(name)) return "Linux AppImage";
  if (/\.deb$/i.test(name)) return "Linux DEB";
  if (/\.rpm$/i.test(name)) return "Linux RPM";
  return name;
}

function platformForAsset(name) {
  if (/\.apk$/i.test(name)) return "android";
  if (/\.exe$/i.test(name) || /(?:win32|windows)/i.test(name) && /\.(zip|7z)$/i.test(name)) return "windows";
  if (/\.(AppImage|deb|rpm)$/i.test(name)) return "linux";
  return null;
}

function versionLabelForTag(tag) {
  if (/^android-v/i.test(tag)) return tag.replace(/^android-/i, "");
  return tag.startsWith("v") ? tag : `v${tag}`;
}

const current = JSON.parse(await readFile(statusPath, "utf8"));
const next = { repositories: {} };
for (const [name, repository] of Object.entries(current.repositories)) next.repositories[name] = { ...repository };

for (const name of tracked) {
  const response = await fetch(`https://api.github.com/repos/mcographics/${encodeURIComponent(name)}/releases?per_page=30`, { headers });
  if (!response.ok) throw new Error(`GitHub returned ${response.status} while reading ${name} releases.`);
  const releases = (await response.json()).filter((release) => !release.draft && release.published_at);
  if (!releases.length) continue;
  const release = releases[0];
  const assetsByPlatform = new Map();
  for (const candidate of releases) {
    for (const asset of candidate.assets.filter((item) => !/\.(blockmap|sha256|yml)$/i.test(item.name))) {
      const platform = platformForAsset(asset.name);
      if (!platform) continue;
      if (!assetsByPlatform.has(platform)) assetsByPlatform.set(platform, { asset, release: candidate });
    }
  }
  const assets = [...assetsByPlatform.values()];
  next.repositories[name] = {
    ...next.repositories[name],
    releaseUrl: release.html_url,
    releaseVersions: assets.map(({ asset, release: assetRelease }) => ({ label: `${labelForAsset(asset.name)} · ${versionLabelForTag(assetRelease.tag_name)}`, url: asset.browser_download_url })),
    ...(assets[0] ? { downloadUrl: assets[0].asset.browser_download_url, downloadLabel: `Download ${labelForAsset(assets[0].asset.name)}` } : {}),
  };
}

await writeFile(statusPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Synchronized portfolio releases for ${tracked.length} public repositories.`);
