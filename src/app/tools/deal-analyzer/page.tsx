import type { Metadata } from "next";
import { DealAnalyzer } from "@/components/tools/deal-analyzer";

export const metadata: Metadata = {
  title: "Deal analyzer",
  description:
    "Cash-on-cash, cap rate and DSCR — with a verdict on which year of the roadmap the deal belongs to.",
};

export default function DealAnalyzerPage() {
  return (
    <div className="flex flex-col gap-7 px-6 pb-20 pt-[52px] md:px-10">
      <div className="flex flex-col gap-3">
        <div className="kicker-accent">The numbers · Deal analyzer</div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          Same three numbers every lender runs.
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">
          Change one input and watch which year of the roadmap this deal actually
          belongs to.
        </p>
      </div>
      <DealAnalyzer />
    </div>
  );
}
