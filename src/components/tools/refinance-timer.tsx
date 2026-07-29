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
import { monthlyPayment } from "@/lib/finance";

/**
 * The refinance timer — the site's refinance rule as a tool: a cash-out
 * refi is ready when the POST-refi loan still clears 1.30 DSCR at 80%
 * occupancy. Otherwise you're borrowing against optimism.
 */
export function RefinanceTimer() {
  const [value, setValue] = useState(320000);
  const [currentLoan, setCurrentLoan] = useState(180000);
  const [currentRate, setCurrentRate] = useState(5.5);
  const [newLtv, setNewLtv] = useState(75);
  const [newRate, setNewRate] = useState(7);
  const [rent, setRent] = useState(2600);
  const [opex, setOpex] = useState(1000);

  const newLoan = value * (newLtv / 100);
  const cashOut = Math.max(0, newLoan - currentLoan);
  const oldPayment = monthlyPayment(currentLoan, currentRate);
  const newPayment = monthlyPayment(newLoan, newRate);

  // The rule: DSCR at 80% occupancy on the post-refi loan
  const stressedNoi = (rent * 0.8 - opex) * 12;
  const honestNoi = (rent - opex) * 12;
  const stressedDscr = stressedNoi / (newPayment * 12);
  const honestDscr = honestNoi / (newPayment * 12);
  const newCashflow = rent - opex - newPayment;
  const oldCashflow = rent - opex - oldPayment;

  const ready = stressedDscr >= 1.3;
  const close = stressedDscr >= 1.15;

  const verdict = ready
    ? `Ready. Even at 80% occupancy the post-refi loan clears ${stressedDscr.toFixed(2)} coverage — this refinance shortens the distance to Year 20. ${moneyShort(cashOut)} comes out for the next deal, and the property still defends itself in a bad year.`
    : close
      ? `Not yet — the rule says wait. At 80% occupancy the new loan only covers ${stressedDscr.toFixed(2)}. It clears at full occupancy (${honestDscr.toFixed(2)}), which means you'd be fine until the first bad year, which is the definition of borrowing against optimism. Let rents grow or take a smaller cash-out.`
      : `No. At ${stressedDscr.toFixed(2)} stressed coverage this refinance converts a stable property into a fragile one for ${moneyShort(cashOut)} of walking-around money. The distance to Year 20 just got longer, not shorter.`;

  const maxSafeLoan = stressedNoi / 1.3 / 12 > 0 ? (() => {
    // binary search the loan size where stressed DSCR = 1.30
    let lo = 0, hi = value;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const d = stressedNoi / (monthlyPayment(mid, newRate) * 12);
      if (d > 1.3) lo = mid; else hi = mid;
    }
    return lo;
  })() : 0;
  const safeCashOut = Math.max(0, maxSafeLoan - currentLoan);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="The rule: refinance when the POST-refi loan clears 1.30 DSCR at 80% occupancy — not your current occupancy, not projected rents. Anything else extends the runway on Year 7 instead of shortening the distance to Year 20.">
          <SliderInput label="Current property value" value={value} min={100000} max={1200000} step={10000} display={money(value)} onChange={setValue} />
          <SliderInput label="Current loan balance" value={currentLoan} min={0} max={900000} step={5000} display={money(currentLoan)} onChange={setCurrentLoan} />
          <SliderInput label="Current rate" value={currentRate} min={2.5} max={9} step={0.25} display={currentRate.toFixed(2) + "%"} onChange={setCurrentRate} />
          <SliderInput label="New loan LTV" value={newLtv} min={60} max={80} step={1} display={newLtv + "%"} onChange={setNewLtv} />
          <SliderInput label="New rate" value={newRate} min={4} max={10} step={0.25} display={newRate.toFixed(2) + "%"} onChange={setNewRate} />
          <SliderInput label="Monthly rent" value={rent} min={800} max={9000} step={50} display={money(rent)} onChange={setRent} />
          <SliderInput label="Monthly operating costs" value={opex} min={200} max={4000} step={25} display={money(opex)} onChange={setOpex} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="Before and after the refinance"
            data={[
              { label: "Cash out", value: Math.round(cashOut), color: SERIES[1] },
              { label: "Old payment /mo", value: Math.round(oldPayment), color: "#3f424d" },
              { label: "New payment /mo", value: Math.round(newPayment), color: SERIES[0] },
              { label: "Old cashflow /mo", value: Math.round(oldCashflow), color: "#3f424d" },
              { label: "New cashflow /mo", value: Math.round(newCashflow), color: newCashflow >= 0 ? SERIES[1] : "#c98b8b" },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="Stressed DSCR" value={stressedDscr.toFixed(2)} note="Post-refi loan at 80% occupancy — the rule's number" grade={ready ? "good" : close ? "ok" : "bad"} />
            <MetricTile label="Cash unlocked" value={moneyShort(cashOut)} note={`At ${newLtv}% LTV on today's value`} grade="neutral" />
            <MetricTile label="Rule-safe cash-out" value={moneyShort(safeCashOut)} note={`The most you can pull and still clear 1.30 stressed (loan ≈ ${moneyShort(maxSafeLoan)})`} grade={safeCashOut > 0 ? "good" : "bad"} />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Full-occupancy DSCR", value: honestDscr.toFixed(2) },
              { label: "New loan", value: moneyShort(newLoan) },
              { label: "Payment change", value: (newPayment >= oldPayment ? "+" : "−") + money(Math.abs(newPayment - oldPayment)) + "/mo" },
              { label: "Equity remaining", value: moneyShort(value - newLoan) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/cash-out-refi-as-an-engine-not-an-exit", label: "The refinance rule, argued" },
          { href: "/articles/brrrr-method-complete-guide", label: "The BRRRR engine" },
          { href: "/articles/real-estate-market-cycles-explained", label: "Why the 80% stress test exists" },
        ]}
      />
    </div>
  );
}
