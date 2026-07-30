import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Terms defined the way they behave on an actual closing statement — each filed to the year of the plan where you first need it.",
};

export default function GlossaryPage() {
  const entries = getAllArticles()
    .filter((a) => a.type === "glossary")
    .sort((a, b) => a.title.localeCompare(b.title));

  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${siteConfig.name} glossary`,
    url: `${siteConfig.url}/glossary`,
    hasDefinedTerm: entries.map((a) => ({
      "@type": "DefinedTerm",
      name: a.title,
      description: a.dek,
      url: `${siteConfig.url}/articles/${a.slug}`,
    })),
  };

  return (
    <div className="flex flex-col gap-7 px-6 pb-20 pt-[52px] md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      <div className="flex flex-col gap-3">
        <div className="kicker-accent">Glossary</div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          Words mean money here.
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">
          Every term defined the way it behaves on a closing statement, not the way a
          textbook rounds it off — and filed to the year of the plan where you first
          need it.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-md bg-panel p-6 text-neutral-500 shadow-edge">
          The glossary fills as pieces are filed. Add an article with{" "}
          <code className="text-accent-300">type: glossary</code> and it appears here
          alphabetically.
        </div>
      ) : (
        <div className="flex max-w-[780px] flex-col">
          {entries.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="-mx-3.5 grid cursor-pointer grid-cols-[1fr_58px] items-baseline gap-4 rounded-[6px] border-b border-divider-faint px-3.5 py-[13px] text-inherit no-underline transition-colors duration-150 hover:bg-panel"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-[17px] tracking-[-0.01em]">{a.title}</span>
                {a.dek ? (
                  <span className="text-xs text-neutral-600 [text-wrap:pretty]">{a.dek}</span>
                ) : null}
              </span>
              <span className="text-right font-mono text-xs text-accent">Y{a.year}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
