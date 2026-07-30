"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { STAGES } from "@/lib/horizon";
import { PILLARS, isPillarSlug, type PillarSlug } from "@/lib/pillars";
import { PILLAR_COLORS } from "@/lib/pillar-colors";
import { CONTENT_TYPES, CONTENT_TYPE_ORDER, type ContentType } from "@/lib/taxonomy";
import type { ArticleMeta } from "@/lib/articles";

type Facet = "everything" | ContentType;

export function LibraryClient({ articles }: { articles: ArticleMeta[] }) {
  const params = useSearchParams();
  const initialPillar = params.get("pillar");

  const [q, setQ] = useState("");
  const [facet, setFacet] = useState<Facet>("everything");
  const [band, setBand] = useState<string | null>(null);
  const [pillar, setPillar] = useState<PillarSlug | null>(
    initialPillar && isPillarSlug(initialPillar) ? initialPillar : null,
  );

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const activeStage = STAGES.find((s) => s.slug === band);
    return articles.filter(
      (a) =>
        (facet === "everything" || a.type === facet) &&
        (!activeStage ||
          (a.year >= activeStage.years.from && a.year <= activeStage.years.to)) &&
        (!pillar || a.pillar === pillar) &&
        (!query ||
          `${a.title} ${a.dek} ${a.stageName} ${a.type} ${a.pillar} ${a.tags.join(" ")}`
            .toLowerCase()
            .includes(query)),
    );
  }, [articles, q, facet, band, pillar]);

  const countFor = (slug: string) => {
    const s = STAGES.find((st) => st.slug === slug)!;
    return articles.filter((a) => a.year >= s.years.from && a.year <= s.years.to).length;
  };

  const chip = (active: boolean) =>
    `cursor-pointer rounded-[20px] px-[13px] py-[7px] font-mono text-[11px] uppercase tracking-[0.06em] transition-all duration-150 ${
      active
        ? "bg-accent-700 text-accent-100 shadow-edge-accent"
        : "bg-transparent text-neutral-400 shadow-edge"
    }`;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[18px] border-b border-divider px-6 pb-7 pt-14 md:px-10">
        <h1 className="m-0 text-[40px] font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          Everything, filed against the clock.
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">
          The whole archive. Narrow it by pillar, by horizon band or by what it is —
          nothing here is sorted by date, because nothing here expires.
        </p>
        <div className="flex max-w-[720px] items-center gap-3 rounded-md bg-surface px-4 py-[13px] shadow-edge-strong">
          <span className="text-[15px] text-neutral-600">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="refinance, DSCR, cost seg, waterfall…"
            className="flex-1 border-none bg-transparent text-base text-ink outline-none placeholder:text-neutral-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PILLARS.map((p) => {
            const c = PILLAR_COLORS[p.slug];
            const active = pillar === p.slug;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setPillar(active ? null : p.slug)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[20px] px-[13px] py-[7px] font-mono text-[11px] uppercase tracking-[0.06em] transition-all duration-150 ${
                  active ? `${c.badge} shadow-edge-strong` : "bg-transparent text-neutral-400 shadow-edge"
                }`}
              >
                <span aria-hidden className={`h-[5px] w-[5px] rounded-full ${c.dot} ${active ? "" : "opacity-60"}`} />
                {p.short}
              </button>
            );
          })}
          <span className="mx-1 h-5 w-px bg-divider" />
          {(["everything", ...CONTENT_TYPE_ORDER] as Facet[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFacet(f)}
              className={chip(facet === f)}
            >
              {f === "everything" ? "Everything" : CONTENT_TYPES[f].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[560px] grid-cols-1 md:grid-cols-[250px_1fr]">
        <aside className="flex flex-col gap-2.5 border-b border-divider px-6 py-7 md:border-b-0 md:border-r">
          <div className="kicker">Horizon bands</div>
          {STAGES.map((s) => {
            const active = band === s.slug;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => setBand(active ? null : s.slug)}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-md px-3.5 py-3 text-left transition-colors duration-150 ${
                  active ? "bg-accent-900 shadow-edge-accent" : "bg-transparent shadow-edge"
                }`}
              >
                <span className={`text-[15px] ${active ? "text-ink" : "text-neutral-400"}`}>
                  {s.name}
                </span>
                <span className="font-mono text-[11px] text-neutral-600">
                  {s.range} · {countFor(s.slug)} pieces
                </span>
              </button>
            );
          })}
        </aside>

        <div className="flex flex-col px-6 pb-14 pt-6 md:px-10">
          <div className="kicker pb-3.5">
            {results.length === 0
              ? "No matches"
              : `Showing ${results.length} of ${articles.length} — ordered by horizon, never by date`}
          </div>
          {results.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="-mx-3.5 grid cursor-pointer grid-cols-[44px_1fr] items-center gap-[18px] rounded-[6px] border-b border-divider-faint px-3.5 py-[15px] text-inherit no-underline transition-colors duration-150 hover:bg-panel md:grid-cols-[44px_1fr_96px_120px_96px_58px]"
            >
              <span className="font-mono text-xs text-accent">Y{a.year}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[17px] tracking-[-0.01em] [text-wrap:pretty]">
                  {a.title}
                </span>
                {a.dek ? (
                  <span className="text-xs text-neutral-600 [text-wrap:pretty]">{a.dek}</span>
                ) : null}
              </span>
              <span
                className={`hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500 md:flex`}
              >
                <span aria-hidden className={`h-[5px] w-[5px] rounded-full ${PILLAR_COLORS[a.pillar].dot}`} />
                {PILLARS.find((p) => p.slug === a.pillar)?.short}
              </span>
              <span className="hidden text-xs text-neutral-500 md:block">{a.stageName}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-accent-300 md:block">
                {CONTENT_TYPES[a.type].name}
              </span>
              <span className="hidden text-right font-mono text-[11px] text-neutral-600 md:block">
                {a.mins}m
              </span>
            </Link>
          ))}
          {results.length === 0 ? (
            <div className="py-8 text-neutral-500">
              Nothing filed under that yet — it becomes next week&rsquo;s piece.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
