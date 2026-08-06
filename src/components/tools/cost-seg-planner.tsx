"use client";

import { useState } from "react";
import {
  InputPanel,
  LearnMore,
  LiveBars,
  MetricTile,
  SERIES,
  SliderInput,
  VerdictPanel,
  money,
  moneyShort,
} from "@/components/tools/ui";
import { costSegYearOne } from "@/lib/finance";

/**
 * Cost segregation & bonus depreciation planner — the first-year paper loss
 * a study creates, what it's worth at your marginal rate, and the recapture
 * bill it books for the exit. The tax play, with its price tag attached.
 */
export function CostSegPlanner() {
  const [price, setPrice] = useState(850000);
  const [landPct, setLandPct] = useState(20);
  const [reclassPct, setReclassPct] = useState(25);
  const [bonusPct, setBonusPct] = useState(100);
  const [commercial, setCommercial] = useState(false);
  const [marginalRate, setMarginalRate] = useState(35);
  const [studyCost, setStudyCost] = useState(6000);

  const r = costSegYearOne({
    purchasePrice: price,
    landPct,
    reclassPct,
    bonusPct,
    recoveryYears: commercial ? 39 : 27.5,
    marginalRatePct: marginalRate,
  });

  const netShieldYear1 = r.taxShield - studyCost;
  const baselineShield = r.baselineYear1 * (marginalRate / 100);
  const extraShield = r.extraDeduction * (marginalRate / 100);
  const roi = studyCost > 0 ? extraShield / studyCost : Infinity;

  const strong = roi >= 5;
  const worthIt = roi >= 2;

  const verdict = strong
    ? `Order the study. ${moneyShort(r.totalYear1)} of first-year depreciation — ${moneyShort(r.extraDeduction)} more than straight-line alone — shields ${moneyShort(extraShield)} of tax beyond the baseline, a ${roi.toFixed(0)}× return on the ${moneyShort(studyCost)} study. Remember the fine print: this is deferral, not forgiveness — roughly ${moneyShort(r.futureRecaptureAt25)} of recapture is now booked against your exit unless a 1031 or the step-up carries it out.`
    : worthIt
      ? `Probably worth it, barely. The study buys ${moneyShort(extraShield)} of extra first-year shield against its ${moneyShort(studyCost)} cost — a ${roi.toFixed(1)}× return. On a property this size the juice is modest; it matters most if you can actually use the loss this year (REPS, the STR loophole, or gains to offset).`
      : `Skip it. At this price and reclass rate the study only accelerates ${moneyShort(r.extraDeduction)} of deductions — ${moneyShort(extraShield)} of shield against a ${moneyShort(studyCost)} study. Straight-line already gives you ${moneyShort(r.baselineYear1)}/year. Save the fee for a bigger building.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Approximation for planning, not a study: bonus applies to the reclassified short-life basis; the non-bonused remainder takes a first-year 200%-DB pass; long-life basis runs straight-line. Passive-loss limits decide whether you can use the loss this year — see REPS and the STR loophole.">
          <SliderInput label="Purchase price" value={price} min={200000} max={5000000} step={25000} display={money(price)} onChange={setPrice} />
          <SliderInput label="Land share of price" value={landPct} min={5} max={40} step={1} display={landPct + "%"} onChange={setLandPct} />
          <SliderInput label="Reclassified to 5/7/15-yr" value={reclassPct} min={10} max={40} step={1} display={reclassPct + "%"} onChange={setReclassPct} />
          <SliderInput label="Bonus depreciation rate" value={bonusPct} min={0} max={100} step={20} display={bonusPct + "%"} onChange={setBonusPct} />
          <SliderInput label="Marginal tax rate" value={marginalRate} min={22} max={50} step={1} display={marginalRate + "%"} onChange={setMarginalRate} />
          <SliderInput label="Cost of the study" value={studyCost} min={2000} max={20000} step={500} display={money(studyCost)} onChange={setStudyCost} />
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-neutral-400">Commercial (39-yr) instead of residential (27.5-yr)</span>
            <input
              type="checkbox"
              checked={commercial}
              onChange={(e) => setCommercial(e.target.checked)}
              aria-label="Commercial recovery period"
            />
          </label>
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="First-year deduction — with and without the study"
            data={[
              { label: "Straight-line only", value: Math.round(r.baselineYear1), color: "#3f424d" },
              { label: "Bonus on reclass", value: Math.round(r.bonusDeduction), color: SERIES[0] },
              { label: "With cost seg", value: Math.round(r.totalYear1), color: SERIES[1] },
              { label: "Future recapture", value: Math.round(r.futureRecaptureAt25), color: SERIES[2] },
            ]}
            note={`Improvement basis ${moneyShort(r.improvementBasis)} after carving out ${landPct}% land — land never depreciates. Recapture shown at the 25% §1250/§1245 planning rate.`}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile
              label="Year-1 paper loss"
              value={moneyShort(r.totalYear1)}
              note={`vs. ${moneyShort(r.baselineYear1)} straight-line — ${(r.baselineYear1 > 0 ? r.totalYear1 / r.baselineYear1 : 0).toFixed(1)}× acceleration`}
              grade={r.totalYear1 > r.baselineYear1 * 3 ? "good" : "neutral"}
            />
            <MetricTile
              label="Tax shielded year 1"
              value={moneyShort(r.taxShield)}
              note={`At your ${marginalRate}% marginal rate (${moneyShort(baselineShield)} of it was free anyway)`}
              grade={netShieldYear1 > 0 ? "good" : "bad"}
            />
            <MetricTile
              label="Study ROI"
              value={roi === Infinity ? "∞" : roi.toFixed(1) + "×"}
              note={`${moneyShort(extraShield)} extra shield ÷ ${moneyShort(studyCost)} study`}
              grade={strong ? "good" : worthIt ? "ok" : "bad"}
            />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Reclassified basis", value: moneyShort(r.reclassified) },
              { label: "Bonus deduction", value: moneyShort(r.bonusDeduction) },
              { label: "Extra vs. straight-line", value: moneyShort(r.extraDeduction) },
              { label: "Recapture booked", value: moneyShort(r.futureRecaptureAt25) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/depreciation-and-cost-segregation", label: "Depreciation and cost seg, in full" },
          { href: "/articles/short-term-rental-tax-loophole", label: "The STR loophole that unlocks the loss" },
          { href: "/articles/real-estate-professional-status-reps", label: "REPS: the other unlock" },
          { href: "/articles/what-tax-free-actually-means", label: "What tax-free actually means" },
        ]}
      />
    </div>
  );
}
