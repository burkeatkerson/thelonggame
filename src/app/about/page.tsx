import type { Metadata } from "next";
import { TRACKS } from "@/lib/horizon";

export const metadata: Metadata = {
  title: "About",
  description: "Why this site is filed against a twenty-year clock.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 px-6 pb-20 pt-[52px] md:px-10">
      <div className="kicker-accent">About</div>
      <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
        Real estate is two games wearing one name.
      </h1>
      <div className="prose prose-invert prose-longgame max-w-[680px] text-[17px] leading-[1.62]">
        <p>
          The first game is <strong>{TRACKS.cashflow.name.toLowerCase()}</strong>:
          house hacks, boring rentals, a refinance rhythm. It builds income and a
          capital base, and almost all real estate content is about it — because it
          has quick wins to sell.
        </p>
        <p>
          The second game is <strong>{TRACKS.wealth.name.toLowerCase()}</strong>:
          sponsorship, term over doors, 1031 chains, the step-up in basis. It is
          quieter, slower, and it is where life-changing wealth actually comes from.
        </p>
        <p>
          Nobody tells you that the first game exists to fund the second — so most
          people play the first one forever, harder and harder, and call the fatigue
          progress. This site is the correction: every article, course and calculator
          is filed against the year of a twenty-year plan it belongs to, so wherever
          you are, you read what&rsquo;s actually next.
        </p>
        <p>
          It&rsquo;s not an overnight journey. That&rsquo;s the point. Twenty years is
          the only edge nobody is competing for.
        </p>
      </div>
    </div>
  );
}
