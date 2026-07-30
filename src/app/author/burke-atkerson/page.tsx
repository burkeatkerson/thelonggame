import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { DEFAULT_AUTHOR, authorUrl } from "@/lib/authors";
import { getAllCourses } from "@/lib/courses";
import { PILLARS } from "@/lib/pillars";
import { siteConfig } from "@/lib/site";
import { CONTENT_TYPES } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: `${DEFAULT_AUTHOR.name} — ${DEFAULT_AUTHOR.title}`,
  description: DEFAULT_AUTHOR.bio,
  alternates: { canonical: "/author/burke-atkerson" },
};

export default function AuthorPage() {
  const articles = getAllArticles();
  const courses = getAllCourses();
  const latest = articles.slice(0, 6);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: DEFAULT_AUTHOR.name,
      url: authorUrl(),
      description: DEFAULT_AUTHOR.bio,
      jobTitle: "Real estate investor & author",
      worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      knowsAbout: [
        "Real estate investing",
        "House flipping",
        "Rental property",
        "1031 exchanges",
        "Real estate syndication",
        "Real estate tax strategy",
      ],
    },
  };

  return (
    <div className="flex flex-col gap-8 px-6 pb-20 pt-[52px] md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <header className="flex flex-col gap-3.5">
        <div className="kicker-accent">Author</div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          {DEFAULT_AUTHOR.name}
        </h1>
        <p className="m-0 max-w-[680px] text-xl leading-[1.45] text-neutral-400 [text-wrap:pretty]">
          {DEFAULT_AUTHOR.title} — every article, course and calculator on this
          site, filed against the twenty-year plan.
        </p>
      </header>

      <div className="prose prose-invert prose-longgame max-w-[680px] text-[17px] leading-[1.62]">
        <p>
          Burke Atkerson is a real estate investor and the author of{" "}
          <Link href="/book">
            <em>
              The Long Game: the 20-year roadmap to building tax-free wealth
              through scalable real estate strategies
            </em>
          </Link>
          . The book&rsquo;s argument — and this site&rsquo;s — is that real estate
          strategies aren&rsquo;t competing, they&rsquo;re <strong>sequential</strong>:
          four pillars, in the order they fund each other, laid over a twenty-year
          clock.
        </p>
        <p>
          The writing here holds itself to two standards at once. It is{" "}
          <strong>hopeful about the long term</strong>, because the twenty-year math
          genuinely rewards ordinary discipline. And it is{" "}
          <strong>blunt about the short term</strong> — the loss rates, the leverage
          lessons, the fact that nothing in this business is passive: not the flips,
          not the rentals, not even the &ldquo;mailbox money.&rdquo; If a strategy has
          a failure mode, you&rsquo;ll find it named in the article, next to the
          defense.
        </p>
        <p>
          Start with <Link href="/start">where you are on the clock</Link>, read{" "}
          <Link href="/about">why the site is built this way</Link>, or go straight
          to <Link href="/roadmap">the roadmap</Link>.
        </p>
      </div>

      <div className="grid max-w-[780px] grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5 shadow-edge">
          <span className="text-[32px] font-medium leading-none tracking-[-0.03em]">
            {articles.length}
          </span>
          <span className="kicker mt-1.5">Articles</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5 shadow-edge">
          <span className="text-[32px] font-medium leading-none tracking-[-0.03em]">
            {courses.length}
          </span>
          <span className="kicker mt-1.5">Courses</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5 shadow-edge">
          <span className="text-[32px] font-medium leading-none tracking-[-0.03em]">
            {PILLARS.length}
          </span>
          <span className="kicker mt-1.5">Pillars, in funding order</span>
        </div>
      </div>

      <section className="flex max-w-[780px] flex-col gap-3">
        <div className="kicker">Latest writing</div>
        <div className="flex flex-col gap-2">
          {latest.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="flex cursor-pointer flex-col gap-[5px] rounded-md bg-panel p-4 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                Y{a.year} · {CONTENT_TYPES[a.type].name}
              </span>
              <span className="text-[16px] leading-[1.3] [text-wrap:pretty]">{a.title}</span>
            </Link>
          ))}
        </div>
        <Link href="/library" className="text-sm text-accent no-underline">
          Everything, filed by pillar and year →
        </Link>
      </section>
    </div>
  );
}
