import Link from "next/link";
import type { Metadata } from "next";
import { PILLARS } from "@/lib/pillars";

export const metadata: Metadata = {
  title: "About",
  description: "Why this site is built on four pillars and a twenty-year clock.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 px-6 pb-20 pt-[52px] md:px-10">
      <div className="kicker-accent">About</div>
      <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
        Most real estate advice answers the wrong question.
      </h1>
      <div className="prose prose-invert prose-longgame max-w-[680px] text-[17px] leading-[1.62]">
        <p>
          It answers <em>&ldquo;which strategy is best?&rdquo;</em> — and the honest
          answer is that they are not competing. They are sequential. This site is
          built on four pillars, in the order they fund each other:
        </p>
        <ul>
          {PILLARS.map((p) => (
            <li key={p.slug}>
              <strong>{p.name}</strong> — {p.tagline.toLowerCase()}.
            </li>
          ))}
        </ul>
        <p>
          Flips build capital but pay tax at the worst rates. Rentals build cashflow
          but plateau at the limits of your own money and hours. The scalable
          strategies — raising capital, commercial, multifamily, the tax
          architecture of holding — are where life-changing, generational wealth
          actually comes from. Nobody tells you the first three pillars exist to
          fund the fourth, so most people play one of them forever, harder and
          harder, and call the fatigue progress.
        </p>
        <p>
          The book — <em>The Long Game: the 20-year roadmap to building wealth
          through scalable real estate investing strategies</em> — walks the
          sequence in order. The site is the same roadmap in pieces: every article,
          course and calculator filed by pillar and by the year of the plan it
          belongs to, so wherever you are, you read what&rsquo;s actually next.
        </p>
        <p>
          It&rsquo;s not an overnight journey. That&rsquo;s the point.{" "}
          <Link href="/roadmap">See the whole roadmap →</Link>
        </p>
      </div>
    </div>
  );
}
