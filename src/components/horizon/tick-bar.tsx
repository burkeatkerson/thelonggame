"use client";

import { HORIZON_YEARS } from "@/lib/horizon";
import { PILLAR_COLORS, pillarForYear } from "@/lib/pillar-colors";

/**
 * The twenty-year tick bar — the site's signature mark. Interactive when
 * given onPick (the header scrubber), static when not (article rails).
 *
 * Each tick is tinted by the pillar that carries that year — violet
 * foundation, amber capital years, green cashflow years, gold wealth
 * years — so the bar doubles as a passive legend for the whole framework.
 */

/** dimmed future ticks, per pillar */
const FUTURE: Record<string, string> = {
  mindset: "rgba(145, 132, 217, 0.26)",
  capital: "rgba(217, 162, 95, 0.24)",
  cashflow: "rgba(79, 201, 154, 0.22)",
  wealth: "rgba(212, 192, 120, 0.22)",
};
export function TickBar({
  selected,
  onPick,
  height = 26,
}: {
  selected: number;
  onPick?: (year: number) => void;
  height?: number;
}) {
  const ticks = Array.from({ length: HORIZON_YEARS }, (_, i) => i + 1);
  return (
    <div className="flex flex-1 items-end gap-[3px]" style={{ height }}>
      {ticks.map((n) => {
        const state = n === selected ? "on" : n < selected ? "past" : "future";
        const pillar = pillarForYear(n);
        const { base, deep } = PILLAR_COLORS[pillar].hex;
        const tick = (
          <span
            className="block w-full rounded-t-[2px] transition-[height,background-color] duration-150"
            style={{
              height: state === "on" ? "100%" : state === "past" ? "52%" : "34%",
              background: state === "on" ? base : state === "past" ? deep : FUTURE[pillar],
              boxShadow: state === "on" ? `0 0 10px ${base}66` : undefined,
            }}
          />
        );
        return onPick ? (
          <button
            key={n}
            type="button"
            title={`Year ${n}`}
            aria-label={`Set horizon to year ${n}`}
            aria-pressed={n === selected}
            onClick={() => onPick(n)}
            className="flex h-full flex-1 cursor-pointer items-end"
          >
            {tick}
          </button>
        ) : (
          <span key={n} title={`Year ${n}`} className="flex h-full flex-1 items-end">
            {tick}
          </span>
        );
      })}
    </div>
  );
}
