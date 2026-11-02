import { Marked, Renderer } from "marked";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function isSafeMarkdownUrl(value, { image = false } = {}) {
  if (typeof value !== "string" || [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  })) return false;
  const href = value.trim();
  if (!href) return false;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(href)?.[1]?.toLowerCase();
  if (!scheme) return true;
  return image
    ? scheme === "http" || scheme === "https"
    : ["http", "https", "mailto", "tel"].includes(scheme);
}

export function createSafeMarkdownParser() {
  const renderer = new Renderer();
  renderer.html = ({ text }) => escapeHtml(text);
  renderer.link = function ({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    if (!isSafeMarkdownUrl(href)) return label;
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<a href="${escapeHtml(href)}"${titleAttribute}>${label}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    if (!isSafeMarkdownUrl(href, { image: true })) return escapeHtml(text);
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${titleAttribute}>`;
  };
  return new Marked({ gfm: true, breaks: false, renderer });
}

export async function renderSafeMarkdown(source) {
  return createSafeMarkdownParser().parse(source);
}
