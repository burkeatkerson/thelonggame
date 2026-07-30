"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useHorizon } from "@/components/horizon/provider";
import { TickBar } from "@/components/horizon/tick-bar";

import { PILLAR_COLORS } from "@/lib/pillar-colors";
import type { PillarSlug } from "@/lib/pillars";

const NAV: Array<{ label: string; href: string; pillar?: PillarSlug }> = [
  { label: "Horizon", href: "/" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Mindset", href: "/mindset", pillar: "mindset" },
  { label: "Capital", href: "/capital", pillar: "capital" },
  { label: "Cashflow", href: "/cashflow", pillar: "cashflow" },
  { label: "Wealth", href: "/wealth", pillar: "wealth" },
  { label: "Library", href: "/library" },
  { label: "Numbers", href: "/tools" },
  { label: "Book", href: "/book" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ articleCount }: { articleCount: number }) {
  const pathname = usePathname();
  const { year, stage, setYear } = useHorizon();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="sticky top-0 z-20 border-b border-divider bg-[rgba(22,24,38,0.94)] backdrop-blur-[10px]">
      <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-10">
        <div className="flex min-w-0 items-center gap-5 lg:gap-10">
          <Link
            href="/"
            className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.015em] text-ink no-underline"
          >
            The Long&nbsp;Game
          </Link>
          <nav className="hidden gap-4 text-sm lg:flex xl:gap-[26px]">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              const activeBorder = item.pillar
                ? PILLAR_COLORS[item.pillar].border
                : "border-accent";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 border-b pb-[3px] no-underline transition-colors duration-150 hover:text-ink ${
                    active ? `${activeBorder} text-ink` : "border-transparent text-neutral-400"
                  }`}
                >
                  {item.pillar ? (
                    <span
                      aria-hidden
                      className={`h-[5px] w-[5px] rounded-full ${PILLAR_COLORS[item.pillar].dot} ${
                        active ? "" : "opacity-60"
                      }`}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-neutral-600 xl:inline">
            {articleCount} filed
          </span>
          <Link
            href="/start"
            className="hidden rounded-sm border border-accent px-4 py-2 text-[13px] text-accent-300 no-underline transition-colors duration-150 hover:bg-accent-900 lg:inline-block"
          >
            Set your horizon
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-divider text-ink lg:hidden"
          >
            {open ? (
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            ) : (
              <span aria-hidden className="flex flex-col gap-[5px]">
                <span className="block h-px w-[18px] bg-ink" />
                <span className="block h-px w-[18px] bg-ink" />
                <span className="block h-px w-[18px] bg-ink" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open ? (
        <nav className="flex flex-col border-t border-divider px-4 pb-4 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`flex items-center gap-2 border-b border-divider-faint py-3 text-[15px] no-underline ${
                isActive(pathname, item.href) ? "text-accent" : "text-ink"
              }`}
            >
              {item.pillar ? (
                <span
                  aria-hidden
                  className={`h-[5px] w-[5px] rounded-full ${PILLAR_COLORS[item.pillar].dot}`}
                />
              ) : null}
              {item.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-4">
            <Link
              href="/start"
              onClick={close}
              className="rounded-sm border border-accent px-4 py-2 text-[13px] text-accent-300 no-underline"
            >
              Set your horizon
            </Link>
            <span className="font-mono text-xs text-neutral-600">{articleCount} filed</span>
          </div>
        </nav>
      ) : null}

      <div className="flex items-center gap-3 border-t border-[rgba(233,233,237,0.06)] px-4 pb-3 pt-2.5 md:gap-5 md:px-10">
        <span className="kicker hidden whitespace-nowrap sm:inline">Your horizon</span>
        <TickBar selected={year} onPick={setYear} />
        <span className="whitespace-nowrap text-right font-mono text-xs text-accent-300 sm:w-[150px]">
          Y{year}
          <span className="hidden sm:inline"> · {stage.short}</span>
        </span>
      </div>
    </div>
  );
}
