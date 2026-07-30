"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { EmailCapture } from "@/components/email-capture";
import { useHorizon } from "@/components/horizon/provider";
import { ToolCallout } from "@/components/tool-callout";
import { PILLARS } from "@/lib/pillars";
import type { ArticleMeta } from "@/lib/articles";

export function HomeClient({ articles }: { articles: ArticleMeta[] }) {
  const { year, stage } = useHorizon();
  const near = articles.filter((a) => Math.abs(a.year - year) <= 1);
  const total = articles.length;

  const stats = [
    { n: String(total), label: "pieces, each filed to its year" },
    { n: "4", label: "pillars — mindset, capital, cashflow, wealth" },
    { n: "8", label: "free calculators that talk like lenders" },
    { n: "0", label: "get-rich-quick posts" },
  ];

  const how = [
    {
      n: "01",
      title: "Set your horizon",
      body: "Tell the site which year of the plan you're in — Year 1 with no capital, Year 8 with six doors. One click on the bar above.",
    },
    {
      n: "02",
      title: "Read what's actually next",
      body: "Every article is filed to the year it belongs to, not the day it was posted. No feed, no backlog — just your next move, then the one after.",
    },
    {
      n: "03",
      title: "Run the numbers before you sign",
      body: "Eight free calculators — deal analyzer, BRRRR, flips, refis — underwrite like a lender would, pre-loaded with your stage's assumptions.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ── hero ── */}
      <section className="grid grid-cols-1 items-end gap-10 border-b border-divider px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-[88px] lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="flex flex-col gap-[22px]">
          <div className="kicker-accent tracking-[0.14em]">
            The 20-year real estate roadmap · free, in order
          </div>
          <h1 className="m-0 max-w-[820px] text-[40px] font-medium leading-[0.98] tracking-[-0.035em] sm:text-5xl md:text-[72px]">
            Ordinary income in.
            <br />
            A portfolio out.
          </h1>
          <p className="m-0 max-w-[620px] text-[19px] leading-[1.5] text-neutral-400 [text-wrap:pretty]">
            Real estate wealth is a sequence, not a secret: first deal, forced
            equity, refinance, repeat — for twenty years. This site is that
            sequence, in {total} pieces, each filed to the{" "}
            <em className="not-italic text-ink">year of the plan</em> it belongs
            to. Tell it where you are. Read what&rsquo;s actually next.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <Link
              href="/roadmap"
              className="rounded-sm border border-accent px-[22px] py-3 text-[15px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
            >
              See the whole roadmap
            </Link>
            <Link
              href="/tools"
              className="rounded-sm border border-neutral-800 px-[22px] py-3 text-[15px] text-neutral-400 no-underline transition-colors duration-150 hover:border-neutral-600"
            >
              Run a deal through the numbers
            </Link>
          </div>
          <div className="font-mono text-[11px] text-neutral-600">
            No course. No upsell funnel. The book behind it is $20 on Amazon —
            everything else is here, free.
          </div>
        </div>

        <div className="flex flex-col gap-3.5 rounded-md bg-panel p-6 shadow-edge">
          <div className="kicker">One email a week</div>
          <div className="text-xl font-medium leading-[1.25] tracking-[-0.015em]">
            Your next step, every week, starting at Year {year}.
          </div>
          <div className="text-[13px] leading-[1.5] text-neutral-500">
            Not news about real estate — the twenty-year plan, delivered in
            order from wherever you are, until you finish it.
          </div>
          <EmailCapture cta={`Start at Year ${year}`} compact />
          <div className="font-mono text-[11px] text-neutral-600">
            unsubscribe ruins nothing
          </div>
        </div>
      </section>

      {/* ── how it works — kills the "what is this site" confusion ── */}
      <section className="grid grid-cols-1 gap-6 border-b border-divider px-6 py-12 md:grid-cols-3 md:gap-10 md:px-10">
        {how.map((s) => (
          <div key={s.n} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[13px] text-accent">{s.n}</span>
              <span className="text-[17px] font-medium tracking-[-0.01em]">{s.title}</span>
            </div>
            <p className="m-0 text-[14px] leading-[1.55] text-neutral-500 [text-wrap:pretty]">
              {s.body}
            </p>
          </div>
        ))}
      </section>

      {/* ── your year ── */}
      <section className="grid grid-cols-1 gap-14 border-b border-divider px-6 py-14 md:px-10 lg:grid-cols-[400px_1fr]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="kicker-accent">You are in Year {year} of 20</div>
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
            Wrong year? Drag the bar at the top — everything on this page
            re-files itself. Kept in this browser; no account needed.
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

      {/* ── the four pillars ── */}
      <section className="flex flex-col gap-8 border-b border-divider px-6 py-16 md:px-10">
        <div className="flex flex-col gap-2">
          <div className="kicker-accent">The framework</div>
          <h2 className="m-0 max-w-[720px] text-4xl font-medium leading-[1.08] tracking-[-0.025em]">
            Four pillars, in order. Each one funds the next.
          </h2>
          <p className="m-0 max-w-[620px] text-[15px] leading-[1.55] text-neutral-400 [text-wrap:pretty]">
            Mindset makes the plan survivable. Capital strategies turn effort
            into cash. Cashflow strategies turn cash into income. Wealth
            strategies make it generational — and mostly tax-free.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PILLARS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="flex cursor-pointer flex-col gap-2 rounded-md bg-surface p-[22px] text-inherit no-underline shadow-edge transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-edge-accent"
            >
              <span className="kicker-accent">
                Pillar {p.order} · {p.years}
              </span>
              <span className="text-[19px] font-medium leading-[1.22] tracking-[-0.015em]">
                {p.name}
              </span>
              <span className="text-[13px] leading-[1.45] text-neutral-500">
                {p.tagline}.
              </span>
            </Link>
          ))}
        </div>
        <Link href="/roadmap" className="text-[13px] text-accent no-underline">
          See the pillars laid over the twenty-year clock →
        </Link>
      </section>

      {/* ── the book — quiet, in the flow ── */}
      <section className="grid grid-cols-1 items-center gap-8 border-b border-divider px-6 py-14 md:px-10 lg:grid-cols-[1fr_auto]">
        <div className="flex max-w-[620px] flex-col gap-3">
          <div className="kicker-accent">Where the roadmap comes from</div>
          <h2 className="m-0 text-[28px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[32px]">
            This whole site is one book, published in pieces.
          </h2>
          <p className="m-0 text-[15px] leading-[1.55] text-neutral-400 [text-wrap:pretty]">
            <em className="not-italic text-ink">The Long Game</em> by Burke
            Atkerson — the twenty-year sequence from zero capital to a
            tax-sheltered portfolio, in one sitting. Read it here free, in
            pieces. Or read it in order, in a weekend.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-4">
            <Link
              href="/book"
              className="rounded-sm border border-accent px-5 py-2.5 text-[14px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
            >
              About the book →
            </Link>
            <span className="font-mono text-[11px] text-neutral-500">
              ★ 4.9 on Amazon · 99 ratings · 204 pages
            </span>
          </div>
        </div>
        <div
          aria-hidden
          className="hidden h-[190px] w-[132px] flex-col justify-between rounded-r-[3px] rounded-l-[5px] border border-accent-800 bg-panel p-4 lg:flex"
          style={{
            boxShadow:
              "0 0 0 1px #423a6a, 0 20px 40px -16px rgba(0,0,0,0.6), 0 0 50px -20px rgba(145,132,217,0.4)",
          }}
        >
          <div className="text-[19px] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
            The
            <br />
            Long
            <br />
            Game
          </div>
          <div className="flex items-end gap-[3px]">
            {Array.from({ length: 20 }, (_, i) => (
              <span
                key={i}
                className="w-px bg-accent"
                style={{ height: `${4 + i * 0.9}px`, opacity: 0.25 + i * 0.0375 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── closing capture ── */}
      <section className="flex flex-col items-start gap-6 px-6 pb-20 pt-16 md:px-10">
        <div className="kicker-accent">The clock only runs one way</div>
        <h2 className="m-0 max-w-[720px] text-[32px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[44px]">
          Twenty years is the only edge nobody is competing for.
        </h2>
        <p className="m-0 max-w-[560px] text-[15px] leading-[1.55] text-neutral-400 [text-wrap:pretty]">
          In twenty years you&rsquo;ll be twenty years older either way. Start
          the plan, and you&rsquo;ll also be wealthy. One email a week, in
          sequence, from Year {year}.
        </p>
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
