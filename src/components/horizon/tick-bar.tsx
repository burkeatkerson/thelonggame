"use client";

import { HORIZON_YEARS } from "@/lib/horizon";

/**
 * The twenty-year tick bar — the site's signature mark. Interactive when
 * given onPick (the header scrubber), static when not (article rails).
 */
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
        const tick = (
          <span
            className="block w-full rounded-t-[2px] transition-[height,background-color] duration-150"
            style={{
              height: state === "on" ? "100%" : state === "past" ? "52%" : "34%",
              background:
                state === "on" ? "#9184d9" : state === "past" ? "#5d5294" : "#3f424d",
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
