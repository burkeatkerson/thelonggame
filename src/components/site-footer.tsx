import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Glossary", href: "/glossary" },
  { label: "Tools", href: "/tools" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
];

export function SiteFooter({ articleCount }: { articleCount: number }) {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-divider px-6 py-9 md:px-10">
      <span className="font-mono text-[11px] text-neutral-600">
        The Long Game · {articleCount} pieces · year-indexed, not date-indexed
      </span>
      <nav className="flex gap-5 text-[13px]">
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-neutral-500 no-underline transition-colors duration-150 hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
