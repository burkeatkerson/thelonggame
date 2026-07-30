import Link from "next/link";
import type { Metadata } from "next";
import { DEFAULT_AUTHOR, authorPath, authorUrl } from "@/lib/authors";
import { siteConfig } from "@/lib/site";

const AMAZON_URL = "https://a.co/d/0aHPXSpX";

export const metadata: Metadata = {
  title: "The Long Game — the book",
  description:
    "The 20-Year Roadmap to Building Tax-Free Wealth Through Scalable Real Estate Strategies. 4.9 stars on Amazon. The book this entire site is built on.",
  alternates: { canonical: "/book" },
};

/* ── copy data ─────────────────────────────────────────────────────────── */

const REVIEWS = [
  {
    quote:
      "What sets this book apart is its emphasis on realistic, long-term strategies rather than get-rich-quick schemes… From starting with zero capital to emerging as a seasoned investor, the book provides a step-by-step roadmap.",
    name: "Shawn Torre",
    title: "A comprehensive blueprint for building wealth!",
  },
  {
    quote:
      "If you're looking for a quick 60 or 90 day path to wealth this book isn't for you. It also talks about why you shouldn't have that mindset… particularly good for someone who's been working a 9-5 and is looking for a lifestyle beyond corporate.",
    name: "Pope",
    title: "Excellent book on creating financial freedom",
  },
  {
    quote:
      "With a clear, long-term roadmap, it simplifies what could be a complex real estate investment strategy.",
    name: "Jeff Groudan",
    title: "Great book to develop a long-term strategy",
  },
  {
    quote:
      "Mindset and perspective as well as practical how-to… more than just nuts and bolts.",
    name: "B. Michaloski",
    title: "More than just nuts and bolts",
  },
];

/** The nine promises, regrouped as the four acts of the 20-year arc. */
const ACTS = [
  {
    years: "Years 0–2",
    act: "Act I · Start from zero",
    line: "The part every other book skips: what to do when you have no capital, no track record, and no rich uncle.",
    items: [
      {
        title: "Starting with zero capital",
        body: "Convert obstacles into your first deals using the resources you already have — hustle, time, and other people's problems.",
      },
      {
        title: "Creative finance techniques",
        body: "Seller financing, subject-to, partnerships — the doors that stay open when the bank's is closed.",
      },
    ],
  },
  {
    years: "Years 2–8",
    act: "Act II · Build the machine",
    line: "Where cashflow stops being a spreadsheet fantasy and starts paying your bills.",
    items: [
      {
        title: "Rental portfolio strategies",
        body: "Build income that arrives every month whether you get out of bed or not — and compounds for decades.",
      },
      {
        title: "Equity-injecting strategies",
        body: "Force value with smart upgrades and strategic refinances, so every property funds the next one.",
      },
      {
        title: "Multifamily investing",
        body: "The gear change: acquire and manage the buildings where portfolios go from hobby to enterprise.",
      },
    ],
  },
  {
    years: "Years 8–15",
    act: "Act III · Keep what you make",
    line: "The chapters that pay for the book a hundred times over.",
    items: [
      {
        title: "Secret tax strategies of the wealthy",
        body: "Depreciation, 1031s, stepped-up basis — the entirely legal playbook the affluent run while everyone else tips the IRS.",
      },
      {
        title: "Thriving as an accredited investor",
        body: "Cross the threshold into syndications and funds — and know how to judge a deal once you're inside the room.",
      },
    ],
  },
  {
    years: "Years 15–20",
    act: "Act IV · The long game",
    line: "The view from the finish line — and how to reverse-engineer every step back to this week.",
    items: [
      {
        title: "Billionaire mindsets",
        body: "The thought processes of the ultra-successful, stripped of the mysticism and made usable on a Tuesday.",
      },
      {
        title: "A reverse-engineered roadmap",
        body: "Your 20-year outcome, mapped backwards into the phone call you can make tomorrow morning.",
      },
    ],
  },
];

const FOR_YOU = [
  "You have a 9-to-5 and a nagging sense it isn't the whole plan.",
  "You've saved something — or nothing — and want a sequence, not a lottery ticket.",
  "You can delay a payoff for a decade if the math is honest.",
  "You'd rather read one ordered plan than 400 contradictory threads.",
];

const NOT_FOR_YOU = [
  "You want to flip your way to a Lamborghini by Labor Day.",
  "You need someone to promise it's easy.",
  "You'd rather debate strategies forever than run one for twenty years.",
];

const FAQS = [
  {
    q: "I'm starting with almost no money. Is this still for me?",
    a: "It's written for you first. Act I of the book exists precisely because most real estate books start at “now take your $100k of capital” — and most readers don't have it. The zero-capital chapters come before anything else, because that's the order real life runs in.",
  },
  {
    q: "Isn't all of this on the internet somewhere?",
    a: "Most of it, yes — including on this site, free. What you can't Google is the sequence: what to do second, what to skip until Year 8, which moves quietly wreck the tax strategy you'll want in Year 12. The book is the order, in one sitting.",
  },
  {
    q: "Twenty years? I was hoping for faster.",
    a: "Everyone is — which is exactly why the twenty-year lane is empty. The book's argument is that time is the one edge nobody can outbid you for. Several readers said the same thing before reading it. Check the reviews.",
  },
  {
    q: "What if I've already got a few doors?",
    a: "Then you start in Act II or III — equity moves, multifamily, and the tax playbook — and use the roadmap to pressure-test the sequence you've been improvising.",
  },
];

/* ── small pieces ──────────────────────────────────────────────────────── */

function AmazonCta({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <a
        href={AMAZON_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm border border-accent px-7 py-3.5 text-[15px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
      >
        {label}
      </a>
      <span className="font-mono text-[11px] text-neutral-600">
        {sub ?? "Kindle · paperback · hardcover — on Amazon"}
      </span>
    </div>
  );
}

/** CSS-drawn book object — no cover asset needed, stays on-system. */
function BookObject() {
  return (
    <div aria-hidden className="flex items-center justify-center py-4 [perspective:1200px]">
      <div className="relative h-[340px] w-[228px] [transform-style:preserve-3d] [transform:rotateY(-22deg)_rotateX(4deg)]">
        {/* pages edge */}
        <div className="absolute right-[-14px] top-[5px] h-[330px] w-[14px] rounded-r-[2px] bg-neutral-300 [transform:rotateY(90deg)_translateZ(7px)]" />
        {/* cover */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-r-[3px] rounded-l-[6px] border border-accent-800 bg-panel p-6"
          style={{
            boxShadow:
              "0 0 0 1px #423a6a, 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 80px -30px rgba(145,132,217,0.45)",
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="kicker-accent">A 20-year roadmap</div>
            <div className="text-[34px] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
              The
              <br />
              Long
              <br />
              Game
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* horizon tick motif */}
            <div className="flex items-end gap-[5px]">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  className="w-px bg-accent"
                  style={{ height: `${6 + i * 1.4}px`, opacity: 0.25 + i * 0.0375 }}
                />
              ))}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
              {DEFAULT_AUTHOR.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────────────────── */

export default function BookPage() {
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The Long Game: The 20-Year Roadmap to Building Tax-Free Wealth Through Scalable Real Estate Strategies",
    author: { "@type": "Person", name: DEFAULT_AUTHOR.name, url: authorUrl() },
    bookFormat: "https://schema.org/Paperback",
    numberOfPages: 204,
    url: `${siteConfig.url}/book`,
    sameAs: AMAZON_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "99",
    },
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />

      {/* ── hero: the hook ── */}
      <section className="grid grid-cols-1 items-center gap-10 border-b border-divider px-6 pb-14 pt-12 md:px-10 md:pt-16 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="flex flex-col gap-5">
          <div className="kicker-accent tracking-[0.14em]">
            The book behind everything on this site
          </div>
          <h1 className="m-0 max-w-[780px] text-[38px] font-medium leading-[1.02] tracking-[-0.032em] md:text-[60px]">
            In twenty years you&rsquo;ll own a portfolio — or an explanation.
          </h1>
          <p className="m-0 max-w-[640px] text-xl leading-[1.45] text-neutral-300 [text-wrap:pretty]">
            <em className="not-italic text-ink">The Long Game</em> is the
            complete 20-year sequence — from zero capital to a tax-sheltered
            portfolio that pays you whether you show up or not. Not a pitch. A
            roadmap, in order, in 204 pages.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-neutral-400">
            <span className="text-accent-300">★★★★★ 4.9 on Amazon</span>
            <span>·</span>
            <span>99 ratings</span>
            <span>·</span>
            <span>204 pages, zero filler</span>
          </div>
          <div className="mt-2">
            <AmazonCta label="Get the book on Amazon →" />
          </div>
        </div>
        <BookObject />
      </section>

      {/* ── the problem: agitate ── */}
      <section className="flex flex-col gap-6 border-b border-divider px-6 py-16 md:px-10">
        <div className="kicker">Be honest with yourself for a minute</div>
        <div className="flex max-w-[680px] flex-col gap-5 text-[19px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
          <p className="m-0">
            You&rsquo;ve watched the videos. The guy leaning on the rented
            Lamborghini. The &ldquo;how I made $40k in 60 days wholesaling&rdquo;
            thumbnails. The course funnels that cost more than a down payment.
          </p>
          <p className="m-0">
            And some part of you already knows the truth:{" "}
            <span className="text-ink">
              if any of that worked as advertised, they&rsquo;d be doing it
              instead of selling it.
            </span>
          </p>
          <p className="m-0">
            Meanwhile the actual playbook — the one quietly run by people who
            end up owning the buildings — is almost boring. Buy right. Force
            equity. Refinance. Repeat. Let the tax code do what it was written
            to do. Give it twenty years instead of twenty weeks.
          </p>
          <p className="m-0 text-neutral-400">
            Nobody makes that playbook go viral, because patience doesn&rsquo;t
            sell courses. But it does build portfolios. This book wrote it
            down, start to finish, in the order it actually happens.
          </p>
        </div>
      </section>

      {/* ── the shift: stat band, the one saturated field ── */}
      <section className="grid grid-cols-2 gap-8 bg-section px-6 py-11 md:px-10 lg:grid-cols-4">
        {[
          { n: "20", label: "years mapped, start to finish" },
          { n: "0", label: "capital required at page one" },
          { n: "4.9", label: "stars across 99 amazon ratings" },
          { n: "1", label: "sitting to read the whole sequence" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <div className="text-[44px] font-medium leading-none tracking-[-0.03em]">{s.n}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-300">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── inside: the journey in four acts ── */}
      <section className="flex flex-col gap-10 border-b border-divider px-6 py-16 md:px-10">
        <div className="flex flex-col gap-2">
          <div className="kicker-accent">Inside the book</div>
          <h2 className="m-0 max-w-[720px] text-4xl font-medium leading-[1.08] tracking-[-0.025em]">
            Twenty years, four acts. Each one funds the next.
          </h2>
          <p className="m-0 max-w-[620px] text-[15px] leading-[1.55] text-neutral-400 [text-wrap:pretty]">
            Most real estate books are a pile of tactics. This one is a
            sequence — you always know what comes next, and why it can&rsquo;t
            come sooner.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {ACTS.map((act) => (
            <div
              key={act.act}
              className="grid grid-cols-1 gap-5 border-t border-divider pt-6 lg:grid-cols-[300px_1fr] lg:gap-10"
            >
              <div className="flex flex-col gap-1.5">
                <div className="kicker-accent">{act.years}</div>
                <div className="text-[22px] font-medium leading-[1.2] tracking-[-0.015em]">
                  {act.act}
                </div>
                <p className="m-0 text-[14px] leading-[1.5] text-neutral-500 [text-wrap:pretty]">
                  {act.line}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {act.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1.5 rounded-md bg-panel p-4 shadow-edge"
                  >
                    <span className="text-[15px] font-medium tracking-[-0.01em]">{item.title}</span>
                    <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
                      {item.body}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <AmazonCta
          label="Start Act I this week →"
          sub="204 pages · read the zero-capital chapters tonight"
        />
      </section>

      {/* ── social proof ── */}
      <section className="flex flex-col gap-6 border-b border-divider px-6 py-16 md:px-10">
        <div className="flex flex-col gap-2">
          <div className="kicker">From verified readers</div>
          <h2 className="m-0 max-w-[720px] text-[32px] font-medium leading-[1.1] tracking-[-0.025em]">
            The readers it wasn&rsquo;t for love it most.
          </h2>
        </div>
        <div className="grid max-w-[960px] grid-cols-1 gap-3 md:grid-cols-2">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="m-0 flex flex-col gap-3 rounded-md bg-panel p-5 shadow-edge-accent-deep"
            >
              <div className="font-mono text-[11px] text-accent-300">★★★★★ · {r.title}</div>
              <blockquote className="m-0 text-[15px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-500">
                {r.name} · Verified purchase
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="font-mono text-[11px] text-neutral-600">
          ★ 4.9 average across 99 Amazon ratings — read them all on the listing
        </div>
      </section>

      {/* ── author ── */}
      <section className="grid grid-cols-1 gap-8 border-b border-divider px-6 py-16 md:px-10 lg:grid-cols-[300px_1fr] lg:gap-14">
        <div className="flex flex-col gap-1.5">
          <div className="kicker">The author</div>
          <div className="text-[22px] font-medium tracking-[-0.015em]">
            <Link href={authorPath()} className="text-ink no-underline hover:text-accent">
              {DEFAULT_AUTHOR.name}
            </Link>
          </div>
          <div className="font-mono text-[11px] leading-[1.6] text-neutral-500">
            CEO, turnkey fix-and-flip company
            <br />
            Managing partner, Impact Investment Partners
          </div>
        </div>
        <div className="flex max-w-[620px] flex-col gap-4 text-[15px] leading-[1.6] text-neutral-400 [text-wrap:pretty]">
          <p className="m-0">
            Burke isn&rsquo;t a content creator who invests on the side.
            He&rsquo;s an operator — running a turnkey fix-and-flip company and
            raising capital for real-estate-backed investments — who wrote down
            the playbook he actually runs.
          </p>
          <p className="m-0">
            That&rsquo;s why the book reads the way it does: no hedging, no
            &ldquo;consult your advisor&rdquo; padding, no chapter that exists
            to sell you the next thing.{" "}
            <span className="text-ink">
              There is no upsell at the end of this book.
            </span>{" "}
            Page 204 is a plan, not a pitch.
          </p>
        </div>
      </section>

      {/* ── self-selection: for you / not for you ── */}
      <section className="flex flex-col gap-8 border-b border-divider px-6 py-16 md:px-10">
        <h2 className="m-0 max-w-[720px] text-[32px] font-medium leading-[1.1] tracking-[-0.025em]">
          This book filters its own readers.
        </h2>
        <div className="grid max-w-[960px] grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-md bg-panel p-6 shadow-edge-accent-deep">
            <div className="kicker-accent">Get it if</div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {FOR_YOU.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[15px] leading-[1.5] text-ink-soft">
                  <span aria-hidden className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full border border-accent" />
                  <span className="[text-wrap:pretty]">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-md bg-panel p-6 shadow-edge">
            <div className="kicker">Skip it if</div>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {NOT_FOR_YOU.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[15px] leading-[1.5] text-neutral-500">
                  <span aria-hidden className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full border border-neutral-700" />
                  <span className="[text-wrap:pretty]">{line}</span>
                </li>
              ))}
            </ul>
            <p className="m-0 text-[13px] leading-[1.5] text-neutral-600">
              Genuinely — save your money. One reviewer opened with exactly
              this warning, then gave it five stars anyway.
            </p>
          </div>
        </div>
      </section>

      {/* ── the math: value framing ── */}
      <section className="flex flex-col gap-6 border-b border-divider px-6 py-16 md:px-10">
        <div className="kicker">Run the numbers on the book itself</div>
        <div className="flex max-w-[680px] flex-col gap-5 text-[19px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
          <p className="m-0">
            A single mispriced rehab, a refinance timed one year wrong, a 1031
            you didn&rsquo;t know you were eligible for —{" "}
            <span className="text-ink">
              any one of these costs five figures.
            </span>{" "}
            The book costs about as much as the inspection you&rsquo;d never
            skip.
          </p>
          <p className="m-0 text-[15px] text-neutral-400">
            And if you&rsquo;d rather audit it first: this entire site — every
            article, course, and calculator — is the book&rsquo;s roadmap,
            published free, in pieces. Read the{" "}
            <Link href="/roadmap" className="text-accent no-underline">
              roadmap
            </Link>
            , run the{" "}
            <Link href="/tools" className="text-accent no-underline">
              numbers
            </Link>
            . When you want the whole sequence in one sitting instead of
            {" "}hundreds of tabs — that&rsquo;s the book. That&rsquo;s the only
            thing it&rsquo;s for.
          </p>
        </div>
        <AmazonCta label="Get the whole sequence →" />
      </section>

      {/* ── objections ── */}
      <section className="flex flex-col gap-8 border-b border-divider px-6 py-16 md:px-10">
        <div className="flex flex-col gap-2">
          <div className="kicker">Fair questions</div>
          <h2 className="m-0 text-[32px] font-medium leading-[1.1] tracking-[-0.025em]">
            The four things people ask before buying.
          </h2>
        </div>
        <div className="flex max-w-[720px] flex-col">
          {FAQS.map((f) => (
            <div key={f.q} className="flex flex-col gap-2 border-t border-divider py-6">
              <div className="text-[17px] font-medium tracking-[-0.01em]">{f.q}</div>
              <p className="m-0 text-[15px] leading-[1.6] text-neutral-400 [text-wrap:pretty]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── final close ── */}
      <section className="flex flex-col items-start gap-6 px-6 pb-24 pt-16 md:px-10">
        <div className="kicker-accent">The clock only runs one way</div>
        <h2 className="m-0 max-w-[760px] text-[36px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[52px]">
          Twenty years from tonight arrives either way. The only variable is
          what you own when it does.
        </h2>
        <p className="m-0 max-w-[620px] text-[17px] leading-[1.55] text-neutral-400 [text-wrap:pretty]">
          Every investor you envy had a Year 0. It felt exactly like this — a
          little late, a little underfunded, a little unsure. The difference is
          they started the clock. The book is 204 pages. Year 0 starts on page
          one.
        </p>
        <AmazonCta
          label="Get The Long Game on Amazon →"
          sub="★ 4.9 · 99 ratings · Kindle, paperback & hardcover"
        />
        <Link href="/roadmap" className="text-[13px] text-neutral-500 no-underline hover:text-ink">
          Still auditing? Read the roadmap free, in pieces →
        </Link>
      </section>
    </div>
  );
}
