import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticlesForSection } from "@/lib/articles";
import { PILLARS, pillarBySlug, sectionOf } from "@/lib/pillars";
import { PILLAR_COLORS } from "@/lib/pillar-colors";
import { CONTENT_TYPES } from "@/lib/taxonomy";

type Params = { pillar: string; section: string };

export function generateStaticParams(): Params[] {
  return PILLARS.flatMap((p) =>
    p.sections.map((s) => ({ pillar: p.slug, section: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pillar: pillarSlug, section: sectionSlug } = await params;
  const pillar = pillarBySlug(pillarSlug);
  const section = pillar && sectionOf(pillar.slug, sectionSlug);
  if (!pillar || !section) return {};
  return { title: `${section.name} — ${pillar.name}`, description: section.dek };
}

export default async function SectionPage({ params }: { params: Promise<Params> }) {
  const { pillar: pillarSlug, section: sectionSlug } = await params;
  const pillar = pillarBySlug(pillarSlug);
  const section = pillar ? sectionOf(pillar.slug, sectionSlug) : undefined;
  if (!pillar || !section) notFound();

  const articles = getArticlesForSection(pillar.slug, section.slug);
  const siblings = pillar.sections.filter((s) => s.slug !== section.slug);

  return (
    <div className="flex flex-col">
      <header
        className={`flex flex-col gap-3.5 border-b border-divider px-6 pb-10 pt-14 md:px-10 ${PILLAR_COLORS[pillar.slug].wash}`}
      >
        <div className="flex items-center gap-2.5">
          <Link
            href={`/${pillar.slug}`}
            className={`font-mono text-[11px] uppercase tracking-[0.1em] no-underline ${PILLAR_COLORS[pillar.slug].text}`}
          >
            ← {pillar.name}
          </Link>
        </div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          {section.name}
        </h1>
        <p className="m-0 max-w-[680px] text-lg text-neutral-400 [text-wrap:pretty]">
          {section.dek}
        </p>
      </header>

      <section className="flex min-h-[280px] flex-col gap-1 border-b border-divider px-6 py-10 md:px-10">
        {articles.length === 0 ? (
          <div className="max-w-[620px] rounded-md bg-panel p-6 text-neutral-500 shadow-edge [text-wrap:pretty]">
            This section is on the writing roadmap — the map exists before the
            territory is filled in. The{" "}
            <Link href="/library" className="text-accent">
              library
            </Link>{" "}
            has everything filed so far.
          </div>
        ) : (
          <>
            <div className="kicker pb-3.5">
              {articles.length} pieces, ordered by horizon
            </div>
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="-mx-3.5 grid cursor-pointer grid-cols-[44px_1fr] items-center gap-[18px] rounded-[6px] border-b border-divider-faint px-3.5 py-[13px] text-inherit no-underline transition-colors duration-150 hover:bg-panel md:grid-cols-[44px_1fr_96px_58px]"
              >
                <span className="font-mono text-xs text-accent">Y{a.year}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[17px] tracking-[-0.01em] [text-wrap:pretty]">
                    {a.title}
                  </span>
                  {a.dek ? (
                    <span className="text-xs text-neutral-600 [text-wrap:pretty]">{a.dek}</span>
                  ) : null}
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-accent-300 md:block">
                  {CONTENT_TYPES[a.type].name}
                </span>
                <span className="hidden text-right font-mono text-[11px] text-neutral-600 md:block">
                  {a.mins}m
                </span>
              </Link>
            ))}
          </>
        )}
      </section>

      <section className="flex flex-col gap-4 px-6 py-10 md:px-10">
        <div className="kicker">More in {pillar.short}</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/${pillar.slug}/${s.slug}`}
              className="flex cursor-pointer flex-col gap-1 rounded-md bg-panel p-4 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
            >
              <span className="text-[15px] font-medium tracking-[-0.01em]">{s.name}</span>
              <span className="text-xs leading-[1.4] text-neutral-500 [text-wrap:pretty]">
                {s.dek}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
