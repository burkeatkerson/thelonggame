"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHorizon } from "@/components/horizon/provider";
import { TickBar } from "@/components/horizon/tick-bar";

const NAV = [
  { label: "Horizon", href: "/" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Mindset", href: "/mindset" },
  { label: "Capital", href: "/capital" },
  { label: "Cashflow", href: "/cashflow" },
  { label: "Wealth", href: "/wealth" },
  { label: "Library", href: "/library" },
  { label: "Numbers", href: "/tools" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ articleCount }: { articleCount: number }) {
  const pathname = usePathname();
  const { year, stage, setYear } = useHorizon();

  return (
    <div className="sticky top-0 z-20 border-b border-divider bg-[rgba(22,24,38,0.94)] backdrop-blur-[10px]">
      <div className="flex h-16 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="text-[17px] font-semibold tracking-[-0.015em] text-ink no-underline"
          >
            The Long&nbsp;Game
          </Link>
          <nav className="flex gap-4 text-sm md:gap-[26px]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`border-b pb-[3px] no-underline transition-colors duration-150 hover:text-ink ${
                  isActive(pathname, item.href)
                    ? "border-accent text-ink"
                    : "border-transparent text-neutral-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <span className="font-mono text-xs text-neutral-600">{articleCount} filed</span>
          <Link
            href="/start"
            className="rounded-sm border border-accent px-4 py-2 text-[13px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900"
          >
            Set your horizon
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-5 border-t border-[rgba(233,233,237,0.06)] px-6 pb-3 pt-2.5 md:px-10">
        <span className="kicker whitespace-nowrap">Your horizon</span>
        <TickBar selected={year} onPick={setYear} />
        <span className="w-[150px] whitespace-nowrap text-right font-mono text-xs text-accent-300">
          Y{year} · {stage.short}
        </span>
      </div>
    </div>
  );
}
