import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const statusPath = join(root, "app", "repository-status.json");
const token = process.env.PORTFOLIO_REPO_STATUS_TOKEN || process.env.GH_TOKEN;

if (!token) {
  throw new Error("PORTFOLIO_REPO_STATUS_TOKEN is required to inspect both public and private repositories.");
}

const current = JSON.parse(await readFile(statusPath, "utf8"));
const next = { repositories: {} };
const changes = [];

for (const name of Object.keys(current.repositories).sort((a, b) => a.localeCompare(b))) {
  const response = await fetch(`https://api.github.com/repos/mcographics/${encodeURIComponent(name)}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "majestic-creations-portfolio-visibility-check",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while checking mcographics/${name}. No status file was changed.`);
  }

  const repository = await response.json();
  const visibility = repository.private ? "PRIVATE" : "PUBLIC";
  const previous = current.repositories[name];
  next.repositories[name] = { ...previous, visibility, url: repository.html_url };

  if (previous.visibility !== visibility || previous.url !== repository.html_url) {
    changes.push(`${name}: ${previous.visibility} -> ${visibility}`);
  }
}

await writeFile(statusPath, `${JSON.stringify(next, null, 2)}\n`);

if (changes.length) {
  console.log("Repository visibility changes detected:");
  for (const change of changes) console.log(`- ${change}`);
} else {
  console.log("No repository visibility changes detected.");
}
