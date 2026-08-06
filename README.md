# The Long Game — website

A real estate content and education center built on **four pillars, in the
order they fund each other** — mirroring the book (*The Long Game: the 20-year
roadmap to building wealth through scalable real estate investing strategies*):

1. **Building Mindset** — the operating system
2. **Building Capital** — turn effort into chunks of cash (flips, wholesaling, BRRRR, development)
3. **Building Cashflow** — turn capital into income streams (rentals, multifamily, STR, lending)
4. **Building Wealth** — make it scalable and generational (syndication, commercial, tax strategy, legacy)

Every piece is also filed against the **year of a twenty-year plan** it
belongs to (the horizon), never the day it was published.

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
| **Pillars** | `src/lib/pillars.ts` | The primary axis: four pillars, each with ~6 declared sections (strategy areas). Sections with no content show as "being built" — the map exists before the territory. Hubs at `/mindset`, `/capital`, `/cashflow`, `/wealth`; sections at `/<pillar>/<section>`. |
| **Horizon** | `src/lib/horizon.ts` | The sequencing layer: the 20-year clock in six stages (Foundation Y1–2 … Legacy Y19–20), each declaring which pillars it leans on (`focus`). `/roadmap` shows the pillars laid over the clock. |
| **Types** | `src/lib/taxonomy.ts` | What a piece is: roadmap, deep-dive, case-study, template, glossary, mindset. |
| **Articles** | `src/content/articles/*.mdx` | Filed by `pillar` (+ optional validated `section`) and `year` (1–20); stage derives from year. |
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
pillar: capital    # mindset | capital | cashflow | wealth (required)
section: brrrr-and-value-add  # optional — validated against src/lib/pillars.ts
type: deep-dive    # roadmap | deep-dive | case-study | template | glossary | mindset
tags: [refinance, scaling]
draft: false       # true hides it everywhere except `npm run dev`
---

Body. Markdown, GFM tables and React components (register them in
src/mdx-components.tsx) all work.
```

`title`, `year` and `pillar` are required; stage and reading time are computed.
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

1. Build the client component in `src/components/tools/` using the shared
   kit (`src/components/tools/ui.tsx`: `SliderInput`, `MetricTile`,
   `VerdictPanel`, `LiveBars`, `LiveLines`) and the math in
   `src/lib/finance.ts` — never inline duplicate finance formulas.
2. Map slug → component in `src/components/tools/registry.tsx` (this also
   makes it embeddable in any MDX article, e.g. `<BrrrrCalculator />`).
3. Register metadata in `src/lib/tools.ts` (`headline`, `intro`, pillar,
   stages, `ready: true`). The page at `/tools/<slug>`, the `/tools` index,
   and the pillar hubs all pick it up automatically.

Live calculators: Long Game (RE vs stocks), deal analyzer, flip/70% rule,
BRRRR, house hack (incl. FHA self-sufficiency), refinance timer, waterfall
visualizer, 1031 exchange, assumption arbitrage, portfolio velocity
simulator, note yield, cost segregation planner, exit strategy comparator.
Each is embedded inside its matching articles.

## Routes

`/` (horizon home) · `/roadmap` (the framework) · `/mindset` `/capital`
`/cashflow` `/wealth` (+ `/<pillar>/<section>`) · `/library` (search +
facets + horizon bands) · `/articles/[slug]` · `/courses[...]` ·
`/tools[...]` · `/glossary` · `/start` · `/about` · `/sitemap.xml` ·
`/feed.xml`.

## Deployment

Vercel. Set `NEXT_PUBLIC_SITE_URL` to the live domain — it drives canonical
URLs, Open Graph, the sitemap and the RSS feed. The email-capture forms are
visual only until a newsletter provider is wired in
(`src/components/email-capture.tsx`).
