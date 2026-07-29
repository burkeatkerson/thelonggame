# The Long Game — website

A real estate content and education center built around one idea: certain
strategies build cashflow and capital, others build generational wealth — and
the first game exists to fund the second. Everything on the site is filed
against the **year of a twenty-year plan** it belongs to, not the day it was
published.

Next.js 16 (App Router) · Tailwind v4 · MDX. Design follows the **Nocturne**
system in `Example design/_ds/` (dark ground, Inter + JetBrains Mono, blurple
accent as line and glow, never flood).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## The content model

| Concept | Where | What |
| --- | --- | --- |
| **Horizon** | `src/lib/horizon.ts` | The 20-year clock and its six stages (Foundation Y1–2, First door Y3–5, Scaling Y6–10, Syndication Y11–15, Commercial Y16–18, Legacy Y19–20). Each stage belongs to a track: `cashflow` or `wealth`. |
| **Types** | `src/lib/taxonomy.ts` | What a piece is: roadmap, deep-dive, case-study, template, glossary, mindset. |
| **Articles** | `src/content/articles/*.mdx` | Filed by `year` (1–20); stage and track derive from it. |
| **Courses** | `src/content/courses/<slug>/` | `course.json` + `lessons/NN-slug.mdx`, ordered by numeric prefix. |
| **Tools** | `src/lib/tools.ts` | Calculator registry; each tool is a page under `src/app/tools/<slug>/` with its component in `src/components/tools/`. |

The reader's own position ("your horizon", Y1–20) lives in localStorage via
`src/components/horizon/provider.tsx`, scrubbed from the header tick bar, and
drives the home page, the library and the calculators' framing.

## Writing an article

Add an `.mdx` file to `src/content/articles/`. The filename is the URL slug.

```mdx
---
title: "Cash-out refi as an engine, not an exit"
dek: "One sentence under the title, also used in listings and meta tags."
year: 7            # 1–20 — where on the plan this piece is filed (required)
type: deep-dive    # roadmap | deep-dive | case-study | template | glossary | mindset
tags: [refinance, scaling]
draft: false       # true hides it everywhere except `npm run dev`
---

Body. Markdown, GFM tables and React components (register them in
src/mdx-components.tsx) all work.
```

`title` and `year` are required; stage, track and reading time are computed.
Glossary entries are just articles with `type: glossary` — they also appear
alphabetically at `/glossary`.

## Adding a course

```
src/content/courses/first-raise/
  course.json                  # { "title", "dek", "year", "draft" }
  lessons/01-the-documents.mdx # frontmatter: title, dek
  lessons/02-the-raise.mdx
```

## Adding a calculator

1. Build the component in `src/components/tools/`.
2. Add a page at `src/app/tools/<slug>/page.tsx`.
3. Register it in `src/lib/tools.ts` with `ready: true` and the stages it
   serves. Unready tools show as "on the bench" on `/tools`.

## Routes

`/` (horizon home) · `/library` (search + facets + horizon bands) ·
`/articles/[slug]` · `/courses[...]` · `/tools[...]` · `/glossary` ·
`/start` (set your horizon) · `/about` · `/sitemap.xml` · `/feed.xml`.

## Deployment

Vercel. Set `NEXT_PUBLIC_SITE_URL` to the live domain — it drives canonical
URLs, Open Graph, the sitemap and the RSS feed. The email-capture forms are
visual only until a newsletter provider is wired in
(`src/components/email-capture.tsx`).
