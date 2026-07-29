"use client";

import Link from "next/link";
import { money, moneyShort } from "@/lib/finance";

/**
 * Shared calculator UI — inputs, result tiles, verdicts, and client-side
 * chart primitives in the validated Nocturne series palette.
 */

export const SERIES = ["#8d7ce6", "#1ca87f", "#c07b2e"];

export function SliderInput({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-neutral-400">{label}</span>
        <span className="font-mono text-sm text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full"
      />
    </div>
  );
}

export function InputPanel({
  title = "Inputs",
  children,
  footnote,
}: {
  title?: string;
  children: React.ReactNode;
  footnote?: string;
}) {
  return (
    <div className="flex flex-col gap-[18px] rounded-md bg-panel p-[26px] shadow-edge">
      <div className="kicker">{title}</div>
      {children}
      {footnote ? (
        <div className="border-t border-divider pt-3.5 font-mono text-[11px] leading-[1.6] text-neutral-600">
          {footnote}
        </div>
      ) : null}
    </div>
  );
}

export type Grade = "good" | "ok" | "bad" | "neutral";

const GRADE_TEXT: Record<Grade, string> = {
  good: "text-good",
  ok: "text-ink",
  bad: "text-warn",
  neutral: "text-ink",
};
const GRADE_RING: Record<Grade, string> = {
  good: "shadow-edge-accent",
  ok: "shadow-edge",
  bad: "shadow-[0_0_0_1px_#7a4f4f]",
  neutral: "shadow-edge",
};

export function MetricTile({
  label,
  value,
  note,
  grade = "neutral",
}: {
  label: string;
  value: string;
  note?: string;
  grade?: Grade;
}) {
  return (
    <div className={`flex flex-col gap-1.5 rounded-md bg-surface p-6 ${GRADE_RING[grade]}`}>
      <div className="kicker">{label}</div>
      <div className={`text-[38px] font-medium leading-none tracking-[-0.03em] ${GRADE_TEXT[grade]}`}>
        {value}
      </div>
      {note ? (
        <div className="text-[13px] leading-[1.4] text-neutral-500 [text-wrap:pretty]">{note}</div>
      ) : null}
    </div>
  );
}

export function VerdictPanel({
  verdict,
  subMetrics,
}: {
  verdict: string;
  subMetrics?: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-md bg-surface p-[26px] shadow-edge">
      <div className="kicker">The verdict</div>
      <div className="text-[24px] font-medium leading-[1.25] tracking-[-0.02em] [text-wrap:pretty]">
        {verdict}
      </div>
      {subMetrics && subMetrics.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 border-t border-divider pt-3.5 md:grid-cols-4">
          {subMetrics.map((sm) => (
            <div key={sm.label} className="flex flex-col gap-[3px]">
              <span className="font-mono text-[11px] text-neutral-600">{sm.label}</span>
              <span className="font-mono text-lg text-ink">{sm.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** "Go deeper" links under a calculator — the educational tie-in. */
export function LearnMore({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md bg-panel px-5 py-3.5 shadow-edge">
      <span className="kicker">Go deeper</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="text-[13px] text-accent no-underline hover:underline">
          {l.label} →
        </Link>
      ))}
    </div>
  );
}

/** Client-side horizontal bars that re-render as inputs move. */
export function LiveBars({
  title,
  data,
  format = "money",
  note,
}: {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  format?: "money" | "raw";
  note?: string;
}) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  const fmt = (v: number) => (format === "money" ? moneyShort(v) : String(Math.round(v)));

  return (
    <div className="flex flex-col gap-3 rounded-md bg-surface p-5 shadow-edge">
      <div className="kicker">{title}</div>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="grid grid-cols-[130px_1fr_64px] items-center gap-3">
            <span className="text-right text-[12.5px] leading-tight text-neutral-500">{d.label}</span>
            <div className="h-[18px] overflow-hidden rounded-sm bg-[rgba(233,233,237,0.05)]">
              <div
                className="h-full rounded-sm transition-[width] duration-200"
                style={{
                  width: `${Math.max(1, (Math.abs(d.value) / max) * 100)}%`,
                  background: d.color ?? SERIES[0],
                }}
              />
            </div>
            <span className="font-mono text-[12.5px] text-ink">
              {d.value < 0 ? "−" : ""}
              {fmt(Math.abs(d.value))}
            </span>
          </div>
        ))}
      </div>
      {note ? <div className="text-xs leading-[1.4] text-neutral-500">{note}</div> : null}
    </div>
  );
}

/** Client-side multi-series line chart that re-renders as inputs move. */
export function LiveLines({
  title,
  series,
  xLabel = (i: number) => `Y${i}`,
  note,
}: {
  title: string;
  series: Array<{ name: string; values: number[] }>;
  xLabel?: (index: number) => string;
  note?: string;
}) {
  const W = 620;
  const H = 280;
  const pad = { top: 14, right: 104, bottom: 26, left: 54 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const len = Math.max(...series.map((s) => s.values.length));

  const x = (i: number) => pad.left + (i / (len - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  return (
    <div className="flex flex-col gap-2 overflow-x-auto rounded-md bg-surface p-5 shadow-edge">
      <div className="kicker">{title}</div>
      <div className="flex flex-wrap gap-4">
        {series.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="h-[3px] w-4 rounded-full" style={{ background: SERIES[i] }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="min-w-[460px]">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={pad.left}
              y1={pad.top + innerH * f}
              x2={pad.left + innerW}
              y2={pad.top + innerH * f}
              stroke="rgba(233,233,237,0.08)"
              strokeWidth="1"
            />
            <text
              x={pad.left - 8}
              y={pad.top + innerH * f + 4}
              textAnchor="end"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="#75798c"
            >
              {moneyShort(max * (1 - f))}
            </text>
          </g>
        ))}
        {[0, Math.floor((len - 1) / 2), len - 1].map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill="#75798c"
          >
            {xLabel(i)}
          </text>
        ))}
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
          const last = s.values[s.values.length - 1];
          return (
            <g key={s.name}>
              <polyline
                points={pts}
                fill="none"
                stroke={SERIES[si]}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle
                cx={x(s.values.length - 1)}
                cy={y(last)}
                r="4"
                fill={SERIES[si]}
                stroke="#232532"
                strokeWidth="2"
              />
              <text
                x={x(s.values.length - 1) + 8}
                y={y(last) + 4}
                fontSize="12"
                fontFamily="var(--font-mono)"
                fill="#e9e9ed"
              >
                {moneyShort(last)}
              </text>
            </g>
          );
        })}
      </svg>
      {note ? <div className="text-xs leading-[1.4] text-neutral-500">{note}</div> : null}
    </div>
  );
}

export { money, moneyShort };
