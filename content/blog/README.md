# Majestic Creations Blog

Create one Markdown file per article in this folder. The filename becomes the public URL slug; for example, `building-work-day-with-god.md` publishes at `/blog/building-work-day-with-god/`.

Copy this front matter to start a post:

```yaml
---
title: "Article title"
description: "One concise summary used on cards, feeds, and social previews."
date: "2026-09-01"
category: "Project Updates"
tags:
  - Work Day with God
  - Development
coverImage: "/blog/article-cover.jpg"
coverAlt: "Description of the cover image"
# Optional wide artwork used by the blog archive cards. Falls back to coverImage.
bannerImage: "/blog/article-banner.jpg"
bannerAlt: "Description of the wide archive banner"
featured: false
published: false
---
```

Write the article below the closing `---` using Markdown headings, paragraphs, lists, quotes, links, emphasis, images, and code blocks.

- `published: false` keeps a draft off the public site.
- `published: true` publishes the post when its date arrives.
- A future date schedules the post for the daily GitHub Pages rebuild.
- Use only one `featured: true` published article at a time.
- `bannerImage` and `bannerAlt` are optional wide artwork for archive cards; if omitted, the article cover is used.
- Store article artwork under `public/blog/` and reference it with a path beginning `/blog/`.
- Filenames must contain lowercase letters, numbers, and hyphens only.

Run `npm run blog:check` to validate posts without building the full site. Run `npm run build:pages` for the complete production export.
