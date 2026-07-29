"use client";

import { useState } from "react";
import { EmailCapture } from "@/components/email-capture";

/**
 * The deal analyzer — cash-on-cash, cap rate and DSCR, with a verdict on
 * which year of the roadmap the deal belongs to. Assumptions: 30-year
 * amortization, closing costs at 3% of price, vacancy inside opex.
 */

type Inputs = {
  price: number;
  downPct: number;
  rate: number;
  rent: number;
  opex: number;
};

const DEFAULTS: Inputs = { price: 385000, downPct: 25, rate: 6.8, rent: 3200, opex: 1150 };

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function DealAnalyzer() {
  const [s, setS] = useState<Inputs>(DEFAULTS);
  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setS((prev) => ({ ...prev, [k]: Number(e.target.value) }));

  // ── deal math
  const loan = s.price * (1 - s.downPct / 100);
  const r = s.rate / 100 / 12;
  const pmt = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -360)) : loan / 360;
  const noi = (s.rent - s.opex) * 12;
  const debt = pmt * 12;
  const cash = s.price * (s.downPct / 100) + s.price * 0.03;
  const flow = noi - debt;
  const cap = (noi / s.price) * 100;
  const coc = (flow / cash) * 100;
  const dscr = noi / debt;

  const color = (v: number, good: number, fair: number) =>
    v >= good ? "text-good" : v >= fair ? "text-ink" : "text-warn";
  const ring = (v: number, good: number, fair: number) =>
    v >= good
      ? "shadow-edge-accent"
      : v >= fair
        ? "shadow-edge"
        : "shadow-[0_0_0_1px_#7a4f4f]";

  let verdict: string;
  if (dscr < 1.15)
    verdict = `A lender will not touch this, and neither should you. At ${dscr.toFixed(2)} coverage you are subsidising a tenant out of your salary.`;
  else if (coc < 4)
    verdict =
      "It survives underwriting and does nothing for you. This is a Year 3 deal being bought with Year 8 money.";
  else if (coc < 9)
    verdict =
      "A working deal. Unremarkable, repeatable, and exactly what Years 6 to 10 are supposed to look like.";
  else
    verdict =
      "Strong on paper — which means check your rent assumption twice, then your expense line three times.";

  const inputs: Array<{
    key: keyof Inputs;
    label: string;
    display: string;
    min: number;
    max: number;
    step: number;
  }> = [
    { key: "price", label: "Purchase price", display: money(s.price), min: 100000, max: 1200000, step: 5000 },
    { key: "downPct", label: "Down payment", display: s.downPct + "%", min: 5, max: 50, step: 1 },
    { key: "rate", label: "Interest rate", display: s.rate.toFixed(1) + "%", min: 3, max: 11, step: 0.1 },
    { key: "rent", label: "Monthly rent", display: money(s.rent), min: 800, max: 12000, step: 50 },
    { key: "opex", label: "Monthly operating cost", display: money(s.opex), min: 200, max: 6000, step: 25 },
  ];

  const metrics = [
    {
      label: "Cash-on-cash",
      value: coc.toFixed(1) + "%",
      cls: `${color(coc, 9, 4)}`,
      ringCls: ring(coc, 9, 4),
      note: `On ${money(cash)} of cash in, including closing costs.`,
    },
    {
      label: "DSCR",
      value: dscr.toFixed(2),
      cls: `${color(dscr, 1.3, 1.15)}`,
      ringCls: ring(dscr, 1.3, 1.15),
      note: "Most lenders stop reading below 1.20.",
    },
    {
      label: "Cap rate",
      value: cap.toFixed(2) + "%",
      cls: `${color(cap, 6, 4.5)}`,
      ringCls: ring(cap, 6, 4.5),
      note: "Unlevered — the only number the market agrees on.",
    },
  ];

  const subMetrics = [
    { label: "Loan amount", value: money(loan) },
    { label: "Monthly P&I", value: money(pmt) },
    { label: "Annual NOI", value: money(noi) },
    { label: "Annual cash flow", value: money(flow) },
  ];

  return (
    <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[400px_1fr]">
      {/* inputs */}
      <div className="flex flex-col gap-[18px] rounded-md bg-panel p-[26px] shadow-edge">
        <div className="kicker">Inputs</div>
        {inputs.map((i) => (
          <div key={i.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-neutral-400">{i.label}</span>
              <span className="font-mono text-sm text-ink">{i.display}</span>
            </div>
            <input
              type="range"
              min={i.min}
              max={i.max}
              step={i.step}
              value={s[i.key]}
              onChange={set(i.key)}
              aria-label={i.label}
              className="w-full"
            />
          </div>
        ))}
        <div className="border-t border-divider pt-3.5 font-mono text-[11px] leading-[1.6] text-neutral-600">
          30-year amortization · closing costs at 3% of price · vacancy already inside
          operating expenses.
        </div>
      </div>

      {/* results */}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`flex flex-col gap-1.5 rounded-md bg-surface p-6 ${m.ringCls}`}
            >
              <div className="kicker">{m.label}</div>
              <div className={`text-[42px] font-medium leading-none tracking-[-0.03em] ${m.cls}`}>
                {m.value}
              </div>
              <div className="text-[13px] leading-[1.4] text-neutral-500 [text-wrap:pretty]">
                {m.note}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3.5 rounded-md bg-surface p-[26px] shadow-edge">
          <div className="kicker">The verdict</div>
          <div className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em] [text-wrap:pretty]">
            {verdict}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-divider pt-3.5 md:grid-cols-4">
            {subMetrics.map((sm) => (
              <div key={sm.label} className="flex flex-col gap-[3px]">
                <span className="font-mono text-[11px] text-neutral-600">{sm.label}</span>
                <span className="font-mono text-lg text-ink">{sm.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-md bg-section px-[26px] py-[22px] md:flex-row md:items-center">
          <div className="flex flex-col gap-[3px]">
            <div className="text-xl font-medium tracking-[-0.015em]">
              Email yourself this scenario
            </div>
            <div className="text-[13px] text-accent-300">
              Plus the two pieces at this stage that argue with the result.
            </div>
          </div>
          <div className="w-full max-w-[320px]">
            <EmailCapture cta="Send it" />
          </div>
        </div>
      </div>
    </div>
  );
}
