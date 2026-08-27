import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(root, "app", "projects", "work-day-with-god", "releases.json");
const repository = "mcographics/WorkDaywithGod";
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "majestic-creations-work-day-release-sync",
};

if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN || process.env.GH_TOKEN}`;
}

const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100`, { headers });
if (!response.ok) {
  throw new Error(`GitHub returned ${response.status} while reading ${repository} releases.`);
}

const releases = await response.json();
const published = releases.filter((release) => !release.draft && release.published_at);

function findRelease(predicate, label) {
  const release = published.find(predicate);
  if (!release) throw new Error(`Could not find the current ${label} release.`);
  return release;
}

function asset(release, pattern, label) {
  const match = release.assets.find((candidate) => pattern.test(candidate.name));
  if (!match) throw new Error(`Could not find the ${label} asset in ${release.tag_name}.`);
  return { name: match.name, url: match.browser_download_url, size: match.size };
}

const windows = findRelease((release) => /^v\d+\.\d+\.\d+$/.test(release.tag_name) && !release.prerelease, "Windows");
const linux = findRelease((release) => /^v\d+\.\d+\.\d+-linux-beta\.\d+$/.test(release.tag_name) && release.prerelease, "Linux");
const android = findRelease((release) => /^android-v\d+\.\d+\.\d+$/.test(release.tag_name) && !release.prerelease, "Android");

const next = {
  repository: `https://github.com/${repository}`,
  syncedAt: [windows, linux, android].map((release) => release.published_at).sort().at(-1),
  windows: {
    version: windows.tag_name.slice(1),
    tag: windows.tag_name,
    releaseUrl: windows.html_url,
    installer: asset(windows, /-Setup-\d+\.\d+\.\d+\.exe$/, "Windows installer"),
  },
  linux: {
    version: linux.tag_name.slice(1).replace("-linux-beta.", " beta."),
    tag: linux.tag_name,
    releaseUrl: linux.html_url,
    appImage: asset(linux, /\.AppImage$/, "Linux AppImage"),
    deb: asset(linux, /\.deb$/, "Linux DEB"),
    rpm: asset(linux, /\.rpm$/, "Linux RPM"),
  },
  android: {
    version: android.tag_name.replace("android-v", ""),
    tag: android.tag_name,
    releaseUrl: android.html_url,
    apk: asset(android, /\.apk$/, "Android APK"),
    checksum: asset(android, /\.apk\.sha256$/, "Android checksum"),
  },
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Synced Work Day with God releases: Windows ${next.windows.version}, Linux ${next.linux.version}, Android ${next.android.version}`);
