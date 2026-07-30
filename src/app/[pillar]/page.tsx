import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticlesForPillar } from "@/lib/articles";
import { getAllCourses } from "@/lib/courses";
import { getToolsForPillar } from "@/lib/tools";
import { PILLARS, pillarBySlug } from "@/lib/pillars";
import { PILLAR_COLORS } from "@/lib/pillar-colors";
import { CONTENT_TYPES } from "@/lib/taxonomy";

type Params = { pillar: string };

export function generateStaticParams(): Params[] {
  return PILLARS.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pillar: slug } = await params;
  const pillar = pillarBySlug(slug);
  if (!pillar) return {};
  return { title: pillar.name, description: pillar.dek };
}

export default async function PillarPage({ params }: { params: Promise<Params> }) {
  const { pillar: slug } = await params;
  const pillar = pillarBySlug(slug);
  if (!pillar) notFound();

  const articles = getArticlesForPillar(pillar.slug);
  const courses = getAllCourses().filter((c) => c.pillar === pillar.slug);
  const tools = getToolsForPillar(pillar.slug);
  const countFor = (section: string) =>
    articles.filter((a) => a.section === section).length;

  const others = PILLARS.filter((p) => p.slug !== pillar.slug);
  const c = PILLAR_COLORS[pillar.slug];

  return (
    <div className="flex flex-col">
      <header
        className={`flex flex-col gap-[18px] border-b border-divider px-6 pb-10 pt-14 md:px-10 ${c.wash}`}
      >
        <div className={`kicker flex items-center gap-2 ${c.text}`}>
          <span aria-hidden className={`h-[5px] w-[5px] rounded-full ${c.dot}`} />
          Pillar {pillar.order} of 4 · {pillar.years}
        </div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          {pillar.name}
        </h1>
        <p className="m-0 text-xl text-neutral-400">{pillar.tagline}.</p>
        <p className="m-0 max-w-[680px] text-neutral-400 [text-wrap:pretty]">{pillar.dek}</p>
      </header>

      {/* sections */}
      <section className="flex flex-col gap-4 border-b border-divider px-6 py-10 md:px-10">
        <div className="kicker">The strategies</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillar.sections.map((section) => {
            const count = countFor(section.slug);
            const live = count > 0;
            const inner = (
              <>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[19px] font-medium leading-[1.22] tracking-[-0.015em]">
                    {section.name}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[11px] text-neutral-600">
                    {live ? `${count} filed` : "being built"}
                  </span>
                </span>
                <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
                  {section.dek}
                </span>
              </>
            );
            return live ? (
              <Link
                key={section.slug}
                href={`/${pillar.slug}/${section.slug}`}
                className={`flex cursor-pointer flex-col gap-2.5 rounded-md bg-surface p-[22px] text-inherit no-underline shadow-edge transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 ${c.glow}`}
              >
                {inner}
              </Link>
            ) : (
              <Link
                key={section.slug}
                href={`/${pillar.slug}/${section.slug}`}
                className="flex flex-col gap-2.5 rounded-md bg-surface p-[22px] text-inherit no-underline opacity-60 shadow-edge transition-opacity duration-150 hover:opacity-90"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* filed pieces */}
      <section className="flex flex-col gap-1 border-b border-divider px-6 py-10 md:px-10">
        <div className="kicker pb-3.5">
          {articles.length > 0
            ? `Filed to this pillar — ${articles.length} pieces, ordered by horizon`
            : "Nothing filed here yet — the sections above are the map of what's coming"}
        </div>
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="-mx-3.5 grid cursor-pointer grid-cols-[44px_1fr] items-center gap-[18px] rounded-[6px] border-b border-divider-faint px-3.5 py-[13px] text-inherit no-underline transition-colors duration-150 hover:bg-panel md:grid-cols-[44px_1fr_140px_96px_58px]"
          >
            <span className={`font-mono text-xs ${c.text}`}>Y{a.year}</span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[17px] tracking-[-0.01em] [text-wrap:pretty]">{a.title}</span>
              {a.dek ? (
                <span className="text-xs text-neutral-600 [text-wrap:pretty]">{a.dek}</span>
              ) : null}
            </span>
            <span className="hidden text-xs text-neutral-500 md:block">
              {pillar.sections.find((s) => s.slug === a.section)?.name ?? ""}
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.06em] text-accent-300 md:block">
              {CONTENT_TYPES[a.type].name}
            </span>
            <span className="hidden text-right font-mono text-[11px] text-neutral-600 md:block">
              {a.mins}m
            </span>
          </Link>
        ))}
      </section>

      {/* courses + tools for this pillar */}
      {courses.length > 0 || tools.length > 0 ? (
        <section className="grid grid-cols-1 gap-8 border-b border-divider px-6 py-10 md:grid-cols-2 md:px-10">
          <div className="flex flex-col gap-3">
            <div className="kicker">Courses in this pillar</div>
            {courses.length === 0 ? (
              <div className="text-sm text-neutral-500">Being built.</div>
            ) : (
              courses.map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="flex cursor-pointer flex-col gap-1 rounded-md bg-panel p-4 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
                >
                  <span className="text-[16px] font-medium tracking-[-0.01em]">{c.title}</span>
                  <span className="font-mono text-[11px] text-neutral-600">
                    {c.lessons.length} lessons · {c.totalMins} min
                  </span>
                </Link>
              ))
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="kicker">Tools for this pillar</div>
            {tools.length === 0 ? (
              <div className="text-sm text-neutral-500">Being built.</div>
            ) : (
              tools.map((t) => (
                <Link
                  key={t.slug}
                  href={t.ready ? `/tools/${t.slug}` : "/tools"}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md bg-panel p-4 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent ${t.ready ? "" : "opacity-60"}`}
                >
                  <span className="text-[15px]">{t.name}</span>
                  <span className="font-mono text-[11px] text-neutral-600">
                    {t.ready ? t.kind : "on the bench"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      ) : null}

      {/* the other pillars */}
      <section className="flex flex-col gap-4 px-6 py-10 md:px-10">
        <div className="kicker">The other pillars</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {others.map((p) => {
            const oc = PILLAR_COLORS[p.slug];
            return (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className={`flex cursor-pointer flex-col gap-1.5 rounded-md bg-panel p-5 text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 ${oc.glow}`}
              >
                <span className={`kicker flex items-center gap-1.5 ${oc.text}`}>
                  <span aria-hidden className={`h-[5px] w-[5px] rounded-full ${oc.dot}`} />
                  Pillar {p.order}
                </span>
                <span className="text-[17px] font-medium tracking-[-0.015em]">{p.name}</span>
                <span className="text-[13px] text-neutral-500">{p.tagline}.</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
