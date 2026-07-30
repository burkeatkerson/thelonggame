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

const INSIDE = [
  { title: "Starting with zero capital", body: "Convert obstacles into your first deals using the resources you already have." },
  { title: "Rental portfolio strategies", body: "Build and grow income that arrives every month — and compounds for decades." },
  { title: "Creative finance techniques", body: "Move past conventional financing hurdles and open doors banks keep closed." },
  { title: "Equity-injecting strategies", body: "Force value and cashflow with smart upgrades and strategic financial moves." },
  { title: "Multifamily investing", body: "Acquire and manage the units where portfolios change gear." },
  { title: "Secret tax strategies of the wealthy", body: "Shelter, defer, and step up — the same playbook the affluent run." },
  { title: "Thriving as an accredited investor", body: "Access the high-value investing circle and excel inside it." },
  { title: "Billionaire mindsets", body: "The thought processes of the ultra-successful, made usable." },
  { title: "A reverse-engineered roadmap", body: "Your 20-year goals, mapped backwards into a path you can start this week." },
];

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
    <div className="flex flex-col gap-10 px-6 pb-20 pt-[52px] md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />

      {/* ── hero ── */}
      <header className="flex flex-col gap-4">
        <div className="kicker-accent">The book</div>
        <h1 className="m-0 max-w-[820px] text-4xl font-medium leading-[1.02] tracking-[-0.032em] md:text-[56px]">
          The Long Game
        </h1>
        <p className="m-0 max-w-[700px] text-xl leading-[1.4] text-neutral-300 [text-wrap:pretty]">
          The 20-year roadmap to building tax-free wealth through scalable real
          estate strategies.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-neutral-400">
          <span className="text-accent-300">★★★★★ 4.9 on Amazon</span>
          <span>·</span>
          <span>99 ratings</span>
          <span>·</span>
          <span>204 pages</span>
          <span>·</span>
          <span>Kindle, paperback & hardcover</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-accent px-6 py-3 text-[15px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
          >
            Get the book on Amazon →
          </a>
          <Link href="/roadmap" className="text-sm text-neutral-400 no-underline hover:text-ink">
            Or read the roadmap free, in pieces →
          </Link>
        </div>
      </header>

      {/* ── the argument ── */}
      <section className="flex max-w-[700px] flex-col gap-4">
        <div
          aria-hidden
          className="h-px"
          style={{ background: "linear-gradient(90deg, #9184d9 0%, rgba(145,132,217,0.3) 55%, transparent 100%)" }}
        />
        <p className="m-0 text-[19px] leading-[1.55] text-ink-soft [text-wrap:pretty]">
          Let&rsquo;s be realistic: get-rich-quick schemes quickly fail. Real,
          life-changing generational wealth is built on time, compounded
          decisions, grit, delegation, and strategic planning. Whether
          you&rsquo;re starting with no capital or investing as an accredited
          investor, this book carves out the route — not just to financial
          freedom, but to a legacy rich with purpose, impact, and generosity.
        </p>
        <p className="m-0 text-[15px] leading-[1.55] text-neutral-500">
          This entire site — every article, course, and calculator — is the
          book&rsquo;s roadmap, in pieces. The book is the sequence in one
          sitting.
        </p>
      </section>

      {/* ── what's inside ── */}
      <section className="flex flex-col gap-4">
        <div className="kicker">Inside the 20-year blueprint</div>
        <div className="grid max-w-[900px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INSIDE.map((item, i) => (
            <div key={item.title} className="flex flex-col gap-1.5 rounded-md bg-panel p-4 shadow-edge">
              <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] font-medium tracking-[-0.01em]">{item.title}</span>
              <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">{item.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── reviews ── */}
      <section className="flex flex-col gap-4">
        <div className="kicker">From verified readers</div>
        <div className="grid max-w-[900px] grid-cols-1 gap-3 md:grid-cols-2">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="m-0 flex flex-col gap-3 rounded-md bg-panel p-5 shadow-edge-accent-deep">
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
      </section>

      {/* ── author + closing CTA ── */}
      <section className="flex max-w-[700px] flex-col gap-4">
        <div className="kicker">The author</div>
        <p className="m-0 text-[15px] leading-[1.6] text-neutral-400 [text-wrap:pretty]">
          <Link href={authorPath()} className="text-ink no-underline hover:text-accent">
            {DEFAULT_AUTHOR.name}
          </Link>{" "}
          is an investor and entrepreneur — CEO of a turnkey fix-and-flip
          company and managing partner at Impact Investment Partners, raising
          capital for real-estate-backed investments. The book is the playbook
          he actually runs.
        </p>
        <div className="mt-2 flex flex-col items-start gap-3 rounded-md bg-panel p-6 shadow-edge-accent-deep">
          <div className="text-[19px] font-medium leading-[1.3] tracking-[-0.01em]">
            Twenty years is the only edge nobody is competing for.
          </div>
          <div className="text-sm leading-[1.5] text-neutral-500">
            One book. The whole sequence. Start the clock.
          </div>
          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-accent px-6 py-3 text-[15px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
          >
            Get The Long Game on Amazon →
          </a>
        </div>
      </section>
    </div>
  );
}
