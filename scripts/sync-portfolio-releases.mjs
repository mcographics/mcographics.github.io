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

const current = JSON.parse(await readFile(statusPath, "utf8"));
const next = { repositories: {} };
for (const [name, repository] of Object.entries(current.repositories)) next.repositories[name] = { ...repository };

for (const name of tracked) {
  const response = await fetch(`https://api.github.com/repos/mcographics/${encodeURIComponent(name)}/releases?per_page=30`, { headers });
  if (!response.ok) throw new Error(`GitHub returned ${response.status} while reading ${name} releases.`);
  const releases = (await response.json()).filter((release) => !release.draft && release.published_at);
  if (!releases.length) continue;
  const release = releases[0];
  const assets = release.assets.filter((asset) => !/\.(blockmap|sha256|yml)$/i.test(asset.name));
  next.repositories[name] = {
    ...next.repositories[name],
    releaseUrl: release.html_url,
    releaseVersions: assets.map((asset) => ({ label: `${labelForAsset(asset.name)} · v${release.tag_name.replace(/^v/, "")}`, url: asset.browser_download_url })),
    ...(assets[0] ? { downloadUrl: assets[0].browser_download_url, downloadLabel: `Download ${labelForAsset(assets[0].name)}` } : {}),
  };
}

await writeFile(statusPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Synchronized portfolio releases for ${tracked.length} public repositories.`);
