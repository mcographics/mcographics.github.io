import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
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

async function waitForSite() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return response.text();
    } catch {
      // The preview may still be starting; retry until the deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("The production preview did not start in time.");
}

try {
  let html = await waitForSite();
  html = html.replaceAll('href="/', `href="${base}/`).replaceAll('src="/', `src="${base}/`);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(join(root, "dist/client"), output, { recursive: true });
  await writeFile(join(output, "index.html"), html);
  await writeFile(join(output, ".nojekyll"), "");
} finally {
  server.kill();
}
