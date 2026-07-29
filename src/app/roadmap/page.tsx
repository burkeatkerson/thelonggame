import Link from "next/link";
import type { Metadata } from "next";
import { STAGES } from "@/lib/horizon";
import { PILLARS, pillarBySlug } from "@/lib/pillars";

export const metadata: Metadata = {
  title: "The roadmap",
  description:
    "Four pillars over twenty years — the framework behind the book and every piece on this site.",
};

export default function RoadmapPage() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-[18px] border-b border-divider px-6 pb-10 pt-14 md:px-10">
        <div className="kicker-accent">The roadmap</div>
        <h1 className="m-0 max-w-[820px] text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
          Four pillars. Twenty years. One sequence.
        </h1>
        <p className="m-0 max-w-[680px] text-lg text-neutral-400 [text-wrap:pretty]">
          Mindset is the operating system. Capital strategies turn effort into cash.
          Cashflow strategies turn cash into income. Wealth strategies turn income
          into something generational. Each pillar exists to fund the next — and the
          twenty-year clock tells you which one carries the plan right now.
        </p>
      </header>

      {/* the four pillars */}
      <section className="grid grid-cols-1 gap-4 border-b border-divider px-6 py-10 md:grid-cols-2 md:px-10 xl:grid-cols-4">
        {PILLARS.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="flex cursor-pointer flex-col gap-2.5 rounded-md bg-surface p-[22px] text-inherit no-underline shadow-edge transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-edge-accent"
          >
            <span className="kicker-accent">
              Pillar {p.order} · {p.years}
            </span>
            <span className="text-[21px] font-medium leading-[1.2] tracking-[-0.015em]">
              {p.name}
            </span>
            <span className="text-sm text-neutral-400">{p.tagline}.</span>
            <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
              {p.dek}
            </span>
            <span className="mt-auto pt-2 font-mono text-[11px] text-neutral-600">
              {p.sections.length} strategy areas →
            </span>
          </Link>
        ))}
      </section>

      {/* the sequence — stages with their pillar focus */}
      <section className="flex flex-col gap-6 border-b border-divider px-6 py-10 md:px-10">
        <div className="flex flex-col gap-2">
          <div className="kicker">The sequence</div>
          <h2 className="m-0 max-w-[680px] text-[28px] font-medium leading-[1.15] tracking-[-0.02em]">
            The book walks the twenty years in order. The site files everything
            against them.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {STAGES.map((stage) => (
            <div
              key={stage.slug}
              className="grid grid-cols-1 gap-4 rounded-md bg-panel p-5 shadow-edge md:grid-cols-[120px_240px_1fr]"
            >
              <span className="font-mono text-sm text-accent">{stage.range}</span>
              <span className="flex flex-col gap-1">
                <span className="text-[17px] font-medium tracking-[-0.01em]">
                  {stage.name}
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {stage.focus.map((f) => {
                    const p = pillarBySlug(f)!;
                    return (
                      <Link
                        key={f}
                        href={`/${f}`}
                        className="rounded-sm bg-accent-900 px-[7px] py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-accent-300 no-underline"
                      >
                        {p.short}
                      </Link>
                    );
                  })}
                </span>
              </span>
              <span className="text-sm leading-[1.5] text-neutral-400 [text-wrap:pretty]">
                {stage.blurb}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* the book */}
      <section className="grid grid-cols-1 gap-10 px-6 py-14 md:px-10 lg:grid-cols-2">
        <div className="flex flex-col gap-[18px]">
          <div className="kicker-accent">The book</div>
          <h2 className="m-0 text-[32px] font-medium leading-[1.1] tracking-[-0.025em] md:text-4xl">
            The Long Game: the 20-year roadmap to building wealth through scalable
            real estate investing strategies.
          </h2>
          <p className="m-0 max-w-[560px] text-neutral-400 [text-wrap:pretty]">
            The site is the roadmap in pieces. The book is the roadmap in order — the
            argument for sequencing mindset, capital, cashflow and wealth instead of
            grabbing whichever strategy is loudest this quarter.
          </p>
          <div className="mt-1 flex gap-3">
            <Link
              href="/start"
              className="rounded-sm border border-accent px-5 py-[11px] text-sm text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
            >
              Find your place on the roadmap
            </Link>
            <Link
              href="/library"
              className="rounded-sm border border-neutral-800 px-5 py-[11px] text-sm text-neutral-400 no-underline transition-colors duration-150 hover:border-neutral-600"
            >
              Open the library
            </Link>
          </div>
        </div>
        <div className="flex h-[260px] items-center justify-center rounded-md shadow-edge [background-image:repeating-linear-gradient(135deg,#1c1f30_0_10px,#232532_10px_20px)]">
          <span className="kicker">Book cover · drop image</span>
        </div>
      </section>
    </div>
  );
}
