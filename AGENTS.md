<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The Long Game

Real estate content/education site. Core framework: four pillars in funding
order — Building Mindset, Building Capital, Building Cashflow, Building
Wealth (`src/lib/pillars.ts`, the primary axis) — laid over a twenty-year
horizon (`src/lib/horizon.ts`, the sequencing layer). Content is never filed
by publish date. See README.md for the content model and authoring workflow.

- Design system: Nocturne — reference in `Example design/_ds/readme.md`.
  Tokens live in `src/app/globals.css` `@theme`. Dark-only. Accent (#9184d9)
  is used as a line/outline/glow, never a flood; the only saturated fill is
  `bg-section` (stat bands, tool callouts). Buttons are outlined, not filled.
  Headings never exceed weight 500. Mono kickers use `.kicker` / `.kicker-accent`.
- The horizon model (`src/lib/horizon.ts`) is the source of truth for stages;
  articles carry only `year` — stage and track are derived.
- `Example design/` is reference-only: excluded from ESLint, never imported.
- Turbopack MDX: plugins in `next.config.ts` must be string-named with
  serializable options (imported plugin functions break the build).
- Building inside Dropbox occasionally throws EBUSY on `.next` — retry once.
- Push to origin when a piece of work is finished (owner's standing request).
