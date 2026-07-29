import Link from "next/link";
import type { Metadata } from "next";
import { stageBySlug } from "@/lib/horizon";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "The numbers",
  description:
    "Calculators and worksheets — the same numbers every lender runs, filed against the year of the roadmap they belong to.",
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-7 px-6 pb-20 pt-[52px] md:px-10">
      <div className="flex flex-col gap-3">
        <div className="kicker-accent">The numbers</div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          A deal is not good or bad. It is early or late.
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">
          The same numbers every lender runs — no signup, nothing saved anywhere but
          this browser. Each tool is filed against the years of the roadmap where it
          earns its keep.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const stages = tool.stages
            .map((s) => stageBySlug(s)?.short)
            .filter(Boolean)
            .join(" · ");
          const inner = (
            <>
              <span className="flex items-center gap-2">
                <span className="rounded-sm bg-accent-900 px-[7px] py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-accent-300">
                  {tool.kind}
                </span>
                <span className="font-mono text-[11px] text-neutral-600">
                  Y{tool.year} · {stages}
                </span>
              </span>
              <span className="text-[19px] font-medium leading-[1.22] tracking-[-0.015em]">
                {tool.name}
              </span>
              <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
                {tool.dek}
              </span>
              {!tool.ready ? (
                <span className="mt-auto font-mono text-[11px] text-neutral-600">
                  On the bench — being built
                </span>
              ) : null}
            </>
          );
          return tool.ready ? (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="flex cursor-pointer flex-col gap-2.5 rounded-md bg-surface p-[22px] text-inherit no-underline shadow-edge transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-edge-accent"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={tool.slug}
              className="flex flex-col gap-2.5 rounded-md bg-surface p-[22px] opacity-60 shadow-edge"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
