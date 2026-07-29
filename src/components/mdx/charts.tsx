/**
 * Server-rendered SVG charts for MDX articles, in the Nocturne style.
 *
 * Categorical palette validated on the #161826 surface with the dataviz
 * six-check validator (lightness band, chroma floor, CVD separation,
 * normal-vision floor, contrast): all pass.
 */

const SERIES = ["#8d7ce6", "#1ca87f", "#c07b2e"]; // blurple · teal · amber
const GRID = "rgba(233,233,237,0.08)";
const TEXT_MUTED = "#9397ab";
const TEXT_FAINT = "#75798c";

function fmtShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

/**
 * Horizontal bar chart — magnitude comparison, direct-labeled, one hue.
 * Values in dollars unless `format="raw"` (then `suffix` applies).
 */
export function BarChart({
  title,
  data,
  format = "money",
  suffix = "",
  note,
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
  format?: "money" | "raw";
  suffix?: string;
  note?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const W = 640;
  const labelW = 170;
  const valueW = 64;
  const rowH = 34;
  const barMaxW = W - labelW - valueW - 16;
  const H = data.length * rowH + 8;
  const fmt = (v: number) => (format === "money" ? fmtShort(v) : `${v}${suffix}`);

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-md bg-surface p-5 shadow-edge">
      <figcaption className="kicker mb-4">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="min-w-[480px]">
        {data.map((d, i) => {
          const y = i * rowH;
          const w = Math.max(4, (d.value / max) * barMaxW);
          return (
            <g key={d.label}>
              <title>{`${d.label}: ${fmt(d.value)}`}</title>
              <text x={labelW - 10} y={y + 21} textAnchor="end" fontSize="12.5" fill={TEXT_MUTED}>
                {d.label}
              </text>
              <rect x={labelW} y={y + 7} width={w} height={18} rx={4} fill={SERIES[0]} />
              <text x={labelW + w + 8} y={y + 21} fontSize="12.5" fontFamily="var(--font-mono)" fill="#e9e9ed">
                {fmt(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
      {note ? <div className="mt-3 text-xs leading-[1.4] text-neutral-500">{note}</div> : null}
    </figure>
  );
}

/**
 * Multi-series line chart over years — change over time, ≤3 series, fixed
 * hue order, legend + direct end-labels.
 */
export function CompareLines({
  title,
  years,
  series,
  format = "money",
  note,
}: {
  title: string;
  /** x-axis year count, plotted 0..years */
  years: number;
  series: Array<{ name: string; values: number[] }>;
  format?: "money" | "raw";
  note?: string;
}) {
  const W = 640;
  const H = 300;
  const pad = { top: 16, right: 118, bottom: 28, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const allValues = series.flatMap((s) => s.values);
  const max = Math.max(...allValues);
  const fmt = (v: number) => (format === "money" ? fmtShort(v) : String(Math.round(v)));

  const x = (i: number, len: number) => pad.left + (i / (len - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const gridLines = 4;

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-md bg-surface p-5 shadow-edge">
      <figcaption className="kicker mb-1.5">{title}</figcaption>
      <div className="mb-2 flex flex-wrap gap-4">
        {series.map((s, i) => (
          <span key={s.name} className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="h-[3px] w-4 rounded-full" style={{ background: SERIES[i] }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="min-w-[480px]">
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const gy = pad.top + (i / gridLines) * innerH;
          const val = max * (1 - i / gridLines);
          return (
            <g key={i}>
              <line x1={pad.left} y1={gy} x2={pad.left + innerW} y2={gy} stroke={GRID} strokeWidth="1" />
              <text x={pad.left - 8} y={gy + 4} textAnchor="end" fontSize="11" fontFamily="var(--font-mono)" fill={TEXT_FAINT}>
                {fmt(val)}
              </text>
            </g>
          );
        })}
        {[0, Math.round(years / 2), years].map((yr) => (
          <text
            key={yr}
            x={x(yr, years + 1)}
            y={H - 8}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill={TEXT_FAINT}
          >
            Y{yr}
          </text>
        ))}
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => `${x(i, s.values.length)},${y(v)}`).join(" ");
          const last = s.values[s.values.length - 1];
          return (
            <g key={s.name}>
              <title>{`${s.name}: ${fmt(last)} at Y${years}`}</title>
              <polyline points={pts} fill="none" stroke={SERIES[si]} strokeWidth="2" strokeLinejoin="round" />
              <circle cx={x(s.values.length - 1, s.values.length)} cy={y(last)} r="4" fill={SERIES[si]} stroke="#232532" strokeWidth="2" />
              <text
                x={x(s.values.length - 1, s.values.length) + 8}
                y={y(last) + 4}
                fontSize="12"
                fontFamily="var(--font-mono)"
                fill="#e9e9ed"
              >
                {fmt(last)}
              </text>
            </g>
          );
        })}
      </svg>
      {note ? <div className="mt-3 text-xs leading-[1.4] text-neutral-500">{note}</div> : null}
    </figure>
  );
}

/**
 * Waterfall-style money flow — where each dollar goes, top to bottom.
 * Segments are one hue with gaps; the remainder is highlighted.
 */
export function MoneyFlow({
  title,
  total,
  totalLabel,
  segments,
  remainderLabel,
  note,
}: {
  title: string;
  total: number;
  totalLabel: string;
  segments: Array<{ label: string; value: number }>;
  remainderLabel: string;
  note?: string;
}) {
  const spent = segments.reduce((sum, s) => sum + s.value, 0);
  const remainder = total - spent;
  const rows = [
    { label: totalLabel, value: total, kind: "total" as const },
    ...segments.map((s) => ({ ...s, kind: "out" as const })),
    { label: remainderLabel, value: remainder, kind: "net" as const },
  ];
  const max = total;
  const W = 640;
  const labelW = 210;
  const rowH = 34;
  const barMaxW = W - labelW - 80;
  const H = rows.length * rowH + 8;

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-md bg-surface p-5 shadow-edge">
      <figcaption className="kicker mb-4">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="min-w-[480px]">
        {rows.map((r, i) => {
          const yPos = i * rowH;
          const w = Math.max(4, (Math.abs(r.value) / max) * barMaxW);
          const fill = r.kind === "total" ? "#3f424d" : r.kind === "net" ? SERIES[1] : SERIES[0];
          return (
            <g key={r.label}>
              <title>{`${r.label}: ${fmtShort(r.value)}`}</title>
              <text x={labelW - 10} y={yPos + 21} textAnchor="end" fontSize="12.5" fill={TEXT_MUTED}>
                {r.label}
              </text>
              <rect x={labelW} y={yPos + 7} width={w} height={18} rx={4} fill={fill} />
              <text x={labelW + w + 8} y={yPos + 21} fontSize="12.5" fontFamily="var(--font-mono)" fill="#e9e9ed">
                {r.kind === "out" ? "−" : ""}
                {fmtShort(r.value)}
              </text>
            </g>
          );
        })}
      </svg>
      {note ? <div className="mt-3 text-xs leading-[1.4] text-neutral-500">{note}</div> : null}
    </figure>
  );
}

/**
 * Timeline — phases across a horizontal span (deal timelines, 1031 clocks).
 */
export function Timeline({
  title,
  unit,
  total,
  phases,
  note,
}: {
  title: string;
  unit: string;
  total: number;
  phases: Array<{ label: string; from: number; to: number }>;
  note?: string;
}) {
  const W = 640;
  const labelW = 168;
  const rowH = 32;
  const trackW = W - labelW - 56;
  const H = phases.length * rowH + 26;

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-md bg-surface p-5 shadow-edge">
      <figcaption className="kicker mb-4">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} className="min-w-[480px]">
        {phases.map((p, i) => {
          const yPos = i * rowH;
          const xStart = labelW + (p.from / total) * trackW;
          const w = Math.max(6, ((p.to - p.from) / total) * trackW);
          return (
            <g key={p.label}>
              <title>{`${p.label}: ${unit} ${p.from}–${p.to}`}</title>
              <text x={labelW - 10} y={yPos + 20} textAnchor="end" fontSize="12.5" fill={TEXT_MUTED}>
                {p.label}
              </text>
              <line x1={labelW} y1={yPos + 16} x2={labelW + trackW} y2={yPos + 16} stroke={GRID} strokeWidth="1" />
              <rect x={xStart} y={yPos + 7} width={w} height={17} rx={4} fill={SERIES[0]} opacity={0.9} />
            </g>
          );
        })}
        {[0, Math.round(total / 2), total].map((t) => (
          <text
            key={t}
            x={labelW + (t / total) * trackW}
            y={H - 4}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill={TEXT_FAINT}
          >
            {unit} {t}
          </text>
        ))}
      </svg>
      {note ? <div className="mt-3 text-xs leading-[1.4] text-neutral-500">{note}</div> : null}
    </figure>
  );
}
