import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookRail } from "@/components/book-promo";
import { EmailCapture } from "@/components/email-capture";
import { TickBar } from "@/components/horizon/tick-bar";
import { ToolCallout } from "@/components/tool-callout";
import { getAllArticles, getArticle, getNextOnRoadmap } from "@/lib/articles";
import { authorPath, authorUrl } from "@/lib/authors";
import { stageForYear } from "@/lib/horizon";
import { pillarBySlug, sectionOf } from "@/lib/pillars";
import { PILLAR_COLORS } from "@/lib/pillar-colors";
import { siteConfig } from "@/lib/site";
import { CONTENT_TYPES } from "@/lib/taxonomy";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.dek,
    authors: [{ name: article.author, url: authorUrl() }],
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      url: `/articles/${slug}`,
      authors: [article.author],
      tags: article.tags,
      modifiedTime: article.updated,
      ...(article.date ? { publishedTime: article.date } : {}),
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.dek,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { default: Content } = await import(`../../../content/articles/${slug}.mdx`);
  const stage = stageForYear(article.year);
  const section = article.section ? sectionOf(article.pillar, article.section) : undefined;
  const nextUp = getNextOnRoadmap(article.year).filter((a) => a.slug !== slug);

  const pillar = pillarBySlug(article.pillar);
  const articleUrl = `${siteConfig.url}/articles/${slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: { "@type": "Person", name: article.author, url: authorUrl() },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(article.date ? { datePublished: article.date } : {}),
    dateModified: article.updated,
    articleSection: section ? `${pillar?.name} / ${section.name}` : pillar?.name,
    timeRequired: `PT${article.mins}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords: article.tags.join(", "),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: pillar?.name ?? article.pillar,
        item: `${siteConfig.url}/${article.pillar}`,
      },
      ...(section
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: section.name,
              item: `${siteConfig.url}/${article.pillar}/${article.section}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: section ? 4 : 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ── main column ── */}
      <article className="flex flex-col gap-6 px-6 pb-20 pt-[52px] md:px-14 lg:border-r lg:border-divider">
        <header className="flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={
                article.section
                  ? `/${article.pillar}/${article.section}`
                  : `/${article.pillar}`
              }
              className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] no-underline ${PILLAR_COLORS[article.pillar].text}`}
            >
              <span
                aria-hidden
                className={`h-[5px] w-[5px] rounded-full ${PILLAR_COLORS[article.pillar].dot}`}
              />
              ← {pillar?.name}
              {section ? ` / ${section.name}` : ""}
            </Link>
            <span className="kicker">
              {stage.name} · Year {article.year} · {CONTENT_TYPES[article.type].name}
            </span>
          </div>
          <h1 className="m-0 max-w-[780px] text-4xl font-medium leading-[1.02] tracking-[-0.032em] md:text-[52px]">
            {article.title}
          </h1>
          {article.dek ? (
            <p className="m-0 max-w-[680px] text-xl leading-[1.45] text-neutral-400 [text-wrap:pretty]">
              {article.dek}
            </p>
          ) : null}
          <div className="font-mono text-[11px] text-neutral-600">
            {article.mins} min ·{" "}
            <Link
              href={authorPath()}
              className="text-neutral-500 no-underline transition-colors hover:text-accent"
              rel="author"
            >
              {article.author}
            </Link>
          </div>
        </header>

        <div className="prose prose-invert prose-longgame max-w-[680px] text-[17px] leading-[1.62]">
          <Content />
        </div>

        <div className="max-w-[680px]">
          <ToolCallout
            title="Run this against your own deal"
            dek="DSCR, cash-on-cash and cap rate — the test this stage keeps coming back to."
            href="/tools/deal-analyzer"
            cta="Open →"
          />
        </div>
      </article>

      {/* ── roadmap rail ── */}
      <aside className="flex flex-col gap-7 bg-rail px-7 py-[52px]">
        <div className="flex flex-col gap-3">
          <div className="kicker">You are here</div>
          <TickBar selected={article.year} height={34} />
          <div className="text-sm leading-[1.5] text-neutral-400 [text-wrap:pretty]">
            This piece sits at Year {article.year} — {stage.name}. Read it early and it
            is theory; read it late and it is a repair job.
          </div>
        </div>

        {nextUp.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="kicker">Next on the roadmap</div>
            {nextUp.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="flex cursor-pointer flex-col gap-[5px] rounded-md bg-panel p-3.5 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                  Y{a.year} · {CONTENT_TYPES[a.type].name}
                </span>
                <span className="text-[15px] leading-[1.3] [text-wrap:pretty]">{a.title}</span>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-[9px] rounded-md bg-panel p-[18px] shadow-edge-accent-deep">
          <div className="text-[17px] font-medium leading-[1.25] tracking-[-0.01em]">
            Pick up at Year {article.year}
          </div>
          <div className="text-[13px] leading-[1.45] text-neutral-500">
            The next pieces in sequence, one a week, then it stops.
          </div>
          <EmailCapture cta="Send the sequence" compact />
        </div>

        <BookRail />
      </aside>
    </div>
  );
}
