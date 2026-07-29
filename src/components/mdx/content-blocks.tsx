/**
 * Content blocks available inside every MDX article (registered in
 * src/mdx-components.tsx). Server components — no client JS.
 */

/** AEO answer box — the direct answer a reader (or an AI) lifts out. */
export function KeyTakeaways({ items, title = "Key takeaways" }: { items: string[]; title?: string }) {
  return (
    <aside className="not-prose my-6 flex flex-col gap-2.5 rounded-md bg-panel p-5 shadow-edge-accent-deep">
      <div className="kicker-accent">{title}</div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] leading-[1.5] text-ink-soft">
            <span className="mt-[9px] h-[6px] w-[6px] flex-none rounded-full bg-accent" />
            <span className="[text-wrap:pretty]">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** The pull-rule box — one sentence the article exists to deliver. */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-r-md border-l-2 border-accent bg-panel px-6 py-[22px] text-[19px] leading-[1.4] text-ink [text-wrap:pretty]">
      {children}
    </aside>
  );
}

/** Numbered process — renders the steps a how-to query wants. */
export function ProcessSteps({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    <ol className="not-prose my-6 flex list-none flex-col gap-3 p-0">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4 rounded-md bg-panel p-4 shadow-edge">
          <span className="w-7 flex-none pt-0.5 font-mono text-sm text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[16px] font-medium tracking-[-0.01em] text-ink">{step.title}</span>
            <span className="text-sm leading-[1.5] text-neutral-400 [text-wrap:pretty]">{step.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Stat tiles — hero numbers with context lines. */
export function StatGrid({ stats }: { stats: Array<{ value: string; label: string; note?: string }> }) {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 rounded-md bg-surface p-5 shadow-edge">
          <span className="text-[32px] font-medium leading-none tracking-[-0.03em] text-ink">{s.value}</span>
          <span className="kicker mt-1.5">{s.label}</span>
          {s.note ? <span className="text-xs leading-[1.4] text-neutral-500">{s.note}</span> : null}
        </div>
      ))}
    </div>
  );
}

/** Two-column verdict table — "X vs Y" queries. */
export function VersusTable({
  a,
  b,
  rows,
}: {
  a: string;
  b: string;
  rows: Array<{ label: string; a: string; b: string }>;
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-md shadow-edge">
      <table className="w-full min-w-[480px] border-collapse bg-surface text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-500"></th>
            <th className="p-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-accent-300">{a}</th>
            <th className="p-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-accent-300">{b}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-divider-faint align-top">
              <td className="p-3 text-neutral-400">{row.label}</td>
              <td className="p-3 leading-[1.5] text-ink-soft">{row.a}</td>
              <td className="p-3 leading-[1.5] text-ink-soft">{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type FAQItem = { q: string; a: string };

/**
 * FAQ — renders the questions AND emits FAQPage JSON-LD so answer engines
 * can lift them. One per article, near the end.
 */
export function FAQ({ items }: { items: FAQItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="not-prose my-8 flex flex-col gap-3">
      <h2 className="m-0 text-[26px] font-medium tracking-[-0.02em] text-ink">
        Frequently asked questions
      </h2>
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-md bg-panel px-5 py-4 shadow-edge open:shadow-edge-strong"
        >
          <summary className="cursor-pointer list-none text-[16px] font-medium tracking-[-0.01em] text-ink marker:content-none">
            <span className="mr-2 font-mono text-xs text-accent transition-transform group-open:hidden">+</span>
            <span className="mr-2 hidden font-mono text-xs text-accent group-open:inline">−</span>
            {item.q}
          </summary>
          <p className="mb-0 mt-2.5 text-[15px] leading-[1.6] text-neutral-300 [text-wrap:pretty]">{item.a}</p>
        </details>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
