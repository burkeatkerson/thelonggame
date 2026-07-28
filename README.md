# The Long Game — website

Next.js 16 (App Router) site with MDX-authored articles.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Writing an article

Add an `.mdx` file to `src/content/articles/`. The filename is the URL slug, so
`src/content/articles/compound-interest.mdx` is served at `/articles/compound-interest`.

```mdx
---
title: "Compound interest"
description: "One-line summary used in listings and meta tags."
date: "2026-08-01"
author: "Burke Latkerson"
tags: ["strategy"]
draft: false
---

Your article body. Markdown, GFM tables, and React components all work.
```

`title` and `date` are required; the rest are optional. `draft: true` hides an
article everywhere except `npm run dev`. Reading time is calculated automatically.

To use a custom React component in articles, register it in
`src/mdx-components.tsx` — it is then available in every `.mdx` file with no import.

## Layout

| Path                     | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| `src/app/`               | Routes: home, `/articles`, `/articles/[slug]`, `/about` |
| `src/content/articles/`  | The articles themselves                                 |
| `src/lib/articles.ts`    | Reads frontmatter, sorts, filters drafts                |
| `src/lib/site.ts`        | Site name, description, canonical URL                   |
| `src/components/`        | Shared UI                                               |
| `src/mdx-components.tsx` | Global MDX component overrides                          |
| `next.config.ts`         | MDX pipeline (GFM, slugs, autolinks, highlighting)      |

`/sitemap.xml` and `/feed.xml` are generated from the article list.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the live domain in the hosting environment — it is
used for canonical URLs, Open Graph tags, the sitemap, and the RSS feed.
