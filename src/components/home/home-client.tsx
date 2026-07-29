"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { EmailCapture } from "@/components/email-capture";
import { useHorizon } from "@/components/horizon/provider";
import { ToolCallout } from "@/components/tool-callout";
import { TRACKS } from "@/lib/horizon";
import type { ArticleMeta } from "@/lib/articles";

export function HomeClient({ articles }: { articles: ArticleMeta[] }) {
  const { year, stage } = useHorizon();
  const near = articles.filter((a) => Math.abs(a.year - year) <= 1);
  const total = articles.length;

  const stats = [
    { n: String(total), label: "pieces, year-indexed" },
    { n: "2", label: "games — cashflow, then wealth" },
    { n: "20", label: "years on the clock" },
    { n: "0", label: "get-rich-quick posts" },
  ];

  return (
    <div className="flex flex-col">
      {/* ── hero ── */}
      <section className="grid grid-cols-1 items-end gap-16 border-b border-divider px-6 pb-16 pt-[88px] md:px-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-[22px]">
          <div className="kicker-accent tracking-[0.14em]">
            Year-indexed · no feed, no backlog
          </div>
          <h1 className="m-0 max-w-[760px] text-5xl font-medium leading-[0.98] tracking-[-0.035em] md:text-[76px]">
            Everyone else is playing this quarter.
          </h1>
          <p className="m-0 max-w-[600px] text-[19px] leading-[1.5] text-neutral-400 [text-wrap:pretty]">
            {total} pieces on real estate — from your first duplex to a triple-net
            portfolio you never visit — filed by the{" "}
            <em className="not-italic text-ink">year of the plan</em> they belong to,
            not the day they were published. Set your horizon. Read what&rsquo;s
            actually next.
          </p>
          <div className="mt-1.5 flex gap-3">
            <Link
              href="/library"
              className="rounded-sm border border-accent px-[22px] py-3 text-[15px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
            >
              Open the library
            </Link>
            <Link
              href="/tools"
              className="rounded-sm border border-neutral-800 px-[22px] py-3 text-[15px] text-neutral-400 no-underline transition-colors duration-150 hover:border-neutral-600"
            >
              Run the numbers
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 rounded-md bg-panel p-6 shadow-edge">
          <div className="kicker">Start here</div>
          <div className="text-xl font-medium leading-[1.25] tracking-[-0.015em]">
            One email a week, sequenced from Year {year} forward.
          </div>
          <div className="text-[13px] leading-[1.5] text-neutral-500">
            Not a newsletter about real estate. The next step in a twenty-year plan,
            in order, until you finish it.
          </div>
          <EmailCapture cta={`Start at Year ${year}`} compact />
          <div className="font-mono text-[11px] text-neutral-600">
            unsubscribe ruins nothing
          </div>
        </div>
      </section>

      {/* ── your year ── */}
      <section className="grid grid-cols-1 gap-14 border-b border-divider px-6 py-14 md:px-10 lg:grid-cols-[400px_1fr]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="kicker-accent">Year {year} of 20</div>
            <h2 className="m-0 text-[40px] font-medium leading-[1.05] tracking-[-0.025em]">
              {stage.name}
            </h2>
            <p className="mt-2 text-neutral-400 [text-wrap:pretty]">{stage.blurb}</p>
          </div>
          <div className="flex flex-col gap-3 border-t border-divider pt-1.5">
            <div className="kicker pt-3">
              Clear these before Year {Math.min(year + 1, 20)}
            </div>
            {stage.milestones.map((m) => (
              <div key={m} className="flex items-start gap-[11px]">
                <span className="mt-1 h-[15px] w-[15px] flex-none rounded-sm border border-neutral-600" />
                <span className="text-[15px] [text-wrap:pretty]">{m}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-[11px] leading-[1.6] text-neutral-600">
            Kept in this browser. No account until you want it on your phone at a
            walkthrough.
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <div className="kicker">
              Filed to Year {year} — {near.length} pieces
            </div>
            <Link href="/library" className="text-[13px] text-accent no-underline">
              All {total} →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {near.slice(0, 4).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
            {near.length === 0 ? (
              <div className="text-sm text-neutral-500">
                Nothing filed to this year yet — it&rsquo;s next on the writing
                roadmap.
              </div>
            ) : null}
          </div>
          <div className="mt-1">
            <ToolCallout
              title={`Put a real deal against Year ${year}`}
              dek="Cash-on-cash, cap rate and DSCR, pre-loaded with this stage's assumptions."
              href="/tools/deal-analyzer"
            />
          </div>
        </div>
      </section>

      {/* ── stat band — the one saturated field ── */}
      <section className="grid grid-cols-2 gap-8 bg-section px-6 py-11 md:px-10 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="text-[44px] font-medium leading-none tracking-[-0.03em]">
              {s.n}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-300">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── the two games ── */}
      <section className="grid grid-cols-1 gap-14 border-b border-divider px-6 py-16 md:px-10 lg:grid-cols-2">
        {(Object.keys(TRACKS) as Array<keyof typeof TRACKS>).map((key) => (
          <div key={key} className="flex flex-col gap-[18px]">
            <div className="kicker-accent">
              {key === "cashflow" ? "The first game" : "The second game"}
            </div>
            <h2 className="m-0 text-4xl font-medium leading-[1.08] tracking-[-0.025em]">
              {TRACKS[key].name}
            </h2>
            <p className="m-0 text-neutral-400 [text-wrap:pretty]">{TRACKS[key].blurb}</p>
            <Link
              href={`/library?track=${key}`}
              className="text-[13px] text-accent no-underline"
            >
              Read this game →
            </Link>
          </div>
        ))}
      </section>

      {/* ── closing capture ── */}
      <section className="flex flex-col items-start gap-6 px-6 pb-20 pt-16 md:px-10">
        <h2 className="m-0 max-w-[720px] text-[44px] font-medium leading-[1.05] tracking-[-0.03em]">
          Twenty years is the only edge nobody is competing for.
        </h2>
        <div className="w-full max-w-[520px]">
          <EmailCapture cta={`Start at Year ${year}`} />
        </div>
        <div className="font-mono text-[11px] text-neutral-600">
          One email a week · nothing sold that you can&rsquo;t already read here
        </div>
      </section>
    </div>
  );
}
