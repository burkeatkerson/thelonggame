"use client";

import Link from "next/link";
import { EmailCapture } from "@/components/email-capture";
import { useHorizon } from "@/components/horizon/provider";
import { STAGES } from "@/lib/horizon";
import { pillarBySlug } from "@/lib/pillars";

/**
 * Set your horizon — the reader places themselves on the twenty-year clock
 * by picking the stage that sounds like their life, not by knowing a year.
 */
export function StartClient() {
  const { year, stage, setYear } = useHorizon();

  return (
    <div className="flex flex-col gap-8 px-6 pb-20 pt-[52px] md:px-10">
      <div className="flex flex-col gap-3">
        <div className="kicker-accent">Set your horizon</div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          Where are you on the twenty-year clock?
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">
          Pick the stage that sounds like your life right now — not where you want to
          be. The whole site files itself against your answer. Kept in this browser;
          change it any time from the bar above.
        </p>
      </div>

      <div className="grid max-w-[900px] grid-cols-1 gap-2.5 md:grid-cols-2">
        {STAGES.map((s) => {
          const active = stage.slug === s.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => setYear(s.years.from)}
              className={`flex cursor-pointer flex-col gap-1.5 rounded-md p-5 text-left transition-colors duration-150 ${
                active ? "bg-accent-900 shadow-edge-accent" : "bg-panel shadow-edge hover:shadow-edge-strong"
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                {s.range} · {s.focus.map((f) => pillarBySlug(f)?.short).join(" + ")}
              </span>
              <span className="text-[19px] font-medium tracking-[-0.015em]">{s.name}</span>
              <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
                {s.blurb}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex max-w-[520px] flex-col gap-4 rounded-md bg-panel p-6 shadow-edge-accent-deep">
        <div className="text-xl font-medium tracking-[-0.015em]">
          Year {year} it is — {stage.name}.
        </div>
        <div className="text-[13px] leading-[1.5] text-neutral-500">
          One email a week, sequenced from here forward. Or skip it and just{" "}
          <Link href="/library" className="text-accent">
            open the library
          </Link>{" "}
          — it&rsquo;s already filtered to where you stand.
        </div>
        <EmailCapture cta={`Start at Year ${year}`} compact />
      </div>
    </div>
  );
}
