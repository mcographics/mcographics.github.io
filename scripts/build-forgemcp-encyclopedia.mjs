import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, basename, posix } from 'node:path';
import { createHash } from 'node:crypto';
import { Marked } from 'marked';

// Explicit local snapshot. Never crawl Saved, registrations, logs, or nested clones.
const source = resolve(process.argv[2] || '../ForgeMCP/ForgeMCP_Encyclopedia');
const destination = resolve('public/projects/forgemcp/encyclopedia/records');
const escape = (s) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const files = [];
for (const folder of await readdir(source, { withFileTypes: true })) {
  if (!folder.isDirectory()) continue;
  for (const file of await readdir(resolve(source, folder.name), { withFileTypes: true })) {
    if (file.isFile() && file.name.endsWith('.md')) files.push(`${folder.name}/${file.name}`);
  }
}
files.sort();
const ids = new Map(files.map(p => [p, createHash('sha256').update(p).digest('hex').slice(0,16)]));
await mkdir(destination, { recursive: true });
const records = [];
for (const path of files) {
  const bytes = await readFile(resolve(source,path));
  let markdown = bytes.toString('utf8');
  // Published derivatives omit workstation paths and credential-shaped assignments.
  markdown = markdown.replace(/(?:[A-Za-z]:[\\/])[^\s`"<>|)]+/g, '[local path]')
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,})\b/g, '[redacted credential]')
    .replace(/((?:["']?(?:token|password|api_key|authorization)["']?)\s*[:=]\s*)["']?[^\s,}\n"']+["']?/gi, '$1"[redacted]"');
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.replaceAll('**','') || basename(path,'.md').replaceAll('_',' ');
  const headings = [];
  const parser = new Marked({ gfm:true, renderer: {
    html({text}) { return escape(text); },
    image({text}) { return `<span class="enc-unavailable">[Image: ${escape(text)}]</span>`; },
    heading({tokens,depth}) { const text = this.parser.parseInline(tokens); const id = `section-${headings.length}`; headings.push({id,text:text.replace(/<[^>]+>/g,''),depth}); return `<h${depth} id="${id}">${text}</h${depth}>`; },
    link({href,tokens}) {
      const label = this.parser.parseInline(tokens);
      if (/^https:\/\//i.test(href)) return `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
      if (href.startsWith('#')) return `<span>${label}</span>`;
      const target = posix.normalize(posix.join(posix.dirname(path),href.split('#')[0])).replace(/^15_Saved\//,'14_Saved/');
      const id = ids.get(target);
      return id ? `<a href="?record=${id}">${label}</a>` : `<span class="enc-unavailable" title="Referenced file is outside this published snapshot">${label} [not indexed]</span>`;
    }
  }});
  const html = parser.parse(markdown);
  const id = ids.get(path);
  const date = markdown.match(/(?:Checked |Date:\s*|Updated:\s*)([^\n]{5,45})/i)?.[1] || null;
  const status = path.includes('Terrain_Acceptance_Verification') ? 'Blocked' : 'Archived';
  const record = {id,title,path,category:path.split('/')[0].replace(/^\d+_/,'').replaceAll('_',' '),status,date,sha256:createHash('sha256').update(bytes).digest('hex'),excerpt:markdown.replace(/[#*`|[\]]/g,'').replace(/\s+/g,' ').slice(0,220)};
  records.push(record);
  await writeFile(resolve(destination,`${id}.json`),JSON.stringify({...record,html,headings}));
}
await writeFile(resolve('app/projects/forgemcp/encyclopedia/catalog.json'),JSON.stringify({snapshot:'2026-10-24',scope:'Direct Markdown records in the local encyclopedia category folders. Nested Saved archives, raw logs, JSON catalogs and runtime registrations are not published.',records},null,2));
console.log(`Indexed ${records.length} Markdown records. Source SHA-256 retained; published text redacts local paths and credentials.`);
