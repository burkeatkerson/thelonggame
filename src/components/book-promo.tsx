import Link from "next/link";

/**
 * Book promo blocks — quiet by design. The site's job is to be worth
 * reading; these leave a thread hanging that the book resolves. Every
 * variant points to /book (the sales page), never straight to Amazon.
 */

/**
 * Inline open-loop hook for article bodies (registered in mdx-components).
 * Usage in MDX: <BookHook>One sentence that leaves the loop open.</BookHook>
 */
export function BookHook({ children }: { children: React.ReactNode }) {
  return (
    <aside className="not-prose my-7 flex flex-col gap-2 border-l-2 border-[rgba(145,132,217,0.45)] py-1 pl-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
        From the long game — the book
      </div>
      <div className="text-[15px] leading-[1.55] text-neutral-300 [text-wrap:pretty]">{children}</div>
      <Link href="/book" className="self-start text-[13px] text-accent no-underline">
        The whole sequence, in one sitting →
      </Link>
    </aside>
  );
}

/**
 * Larger closing panel for hub articles and course endings.
 * Usage in MDX: <BookCta /> or <BookCta line="Custom hook line." />
 */
export function BookCta({ line }: { line?: string }) {
  return (
    <aside className="not-prose my-8 flex flex-col items-start gap-2.5 rounded-md bg-panel p-6 shadow-edge-accent-deep">
      <div className="kicker-accent">The book</div>
      <div className="text-[19px] font-medium leading-[1.3] tracking-[-0.01em] text-ink [text-wrap:pretty]">
        {line ??
          "This article is one mile of a twenty-year road. The book drives it end to end — in order, in one sitting."}
      </div>
      <div className="font-mono text-[11px] text-neutral-500">
        ★ 4.9 on Amazon · 204 pages · the roadmap this site is built on
      </div>
      <Link href="/book" className="text-sm text-accent no-underline">
        The Long Game, by Burke Atkerson →
      </Link>
    </aside>
  );
}

const AMAZON_URL = "https://a.co/d/0aHPXSpX";

/**
 * Amazon-direct variants — for the bottom-funnel articles that skip the
 * /book sales page and send the reader straight to the listing.
 * Usage in MDX: <AmazonHook>Open-loop sentence.</AmazonHook> / <AmazonCloser />
 */
export function AmazonHook({ children }: { children: React.ReactNode }) {
  return (
    <aside className="not-prose my-7 flex flex-col gap-2 border-l-2 border-[rgba(145,132,217,0.45)] py-1 pl-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
        From the long game — the book
      </div>
      <div className="text-[15px] leading-[1.55] text-neutral-300 [text-wrap:pretty]">{children}</div>
      <a
        href={AMAZON_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-[13px] text-accent no-underline"
      >
        The Long Game on Amazon — ★ 4.9 · 204 pages →
      </a>
    </aside>
  );
}

export function AmazonCloser({ line }: { line?: string }) {
  return (
    <aside className="not-prose my-8 flex flex-col items-start gap-3 rounded-md bg-panel p-6 shadow-edge-accent-deep">
      <div className="kicker-accent">The book</div>
      <div className="text-[19px] font-medium leading-[1.3] tracking-[-0.01em] text-ink [text-wrap:pretty]">
        {line ??
          "Everything in this article is one chapter of a twenty-year sequence. The Long Game runs it end to end — in order, in one sitting."}
      </div>
      <div className="font-mono text-[11px] text-neutral-500">
        ★ 4.9 on Amazon · 99 ratings · 204 pages · Kindle, paperback & hardcover
      </div>
      <a
        href={AMAZON_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm border border-accent px-5 py-2.5 text-[14px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
      >
        Get The Long Game on Amazon →
      </a>
    </aside>
  );
}

/** Compact sidebar unit for the article rail — present, never loud. */
export function BookRail() {
  return (
    <Link
      href="/book"
      className="flex cursor-pointer flex-col gap-[7px] rounded-md bg-panel p-[18px] text-inherit no-underline shadow-edge transition-[box-shadow] duration-150 hover:shadow-edge-accent"
    >
      <span className="kicker">The book behind the site</span>
      <span className="text-[15px] font-medium leading-[1.3] tracking-[-0.01em]">
        The Long Game — the twenty-year sequence, in one sitting.
      </span>
      <span className="font-mono text-[11px] text-neutral-500">★ 4.9 on Amazon · 204 pages</span>
    </Link>
  );
}
