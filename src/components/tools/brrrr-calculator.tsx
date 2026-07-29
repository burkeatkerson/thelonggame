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

/** BRRRR deal calculator — cash left in, equity created, post-refi DSCR. */
export function BrrrrCalculator() {
  const [purchase, setPurchase] = useState(120000);
  const [rehab, setRehab] = useState(30000);
  const [carry, setCarry] = useState(9000);
  const [arv, setArv] = useState(210000);
  const [refiLtv, setRefiLtv] = useState(75);
  const [rate, setRate] = useState(7);
  const [rent, setRent] = useState(1750);
  const [opex, setOpex] = useState(700);

  const allIn = purchase + rehab + carry;
  const refiLoan = arv * (refiLtv / 100);
  const cashOut = Math.min(refiLoan, allIn);
  const cashLeftIn = Math.max(0, allIn - refiLoan);
  const equityCreated = arv - refiLoan;
  const allInPctOfArv = (allIn / arv) * 100;

  const payment = monthlyPayment(refiLoan, rate);
  const noi = (rent - opex) * 12;
  const dscr = noi / (payment * 12);
  const monthlyCashflow = (rent - opex) - payment;

  const dscrGrade = dscr >= 1.25 ? "good" : dscr >= 1.15 ? "ok" : "bad";
  const leftInGrade = cashLeftIn <= allIn * 0.1 ? "good" : cashLeftIn <= allIn * 0.25 ? "ok" : "bad";

  let verdict: string;
  if (dscr < 1.15)
    verdict = `The refinance fails the exam: at ${dscr.toFixed(2)} coverage the post-refi payment doesn't clear honest rents. Either the purchase price is too high or the leverage is — a lender will say the same thing less politely.`;
  else if (allInPctOfArv <= refiLtv && dscr >= 1.25)
    verdict = `A textbook BRRRR: all-in at ${allInPctOfArv.toFixed(0)}% of ARV means the refinance returns your whole pile, the property cashflows at ${money(monthlyCashflow)}/month, and you keep ${moneyShort(equityCreated)} of created equity. Repeat.`;
  else if (cashLeftIn <= allIn * 0.25)
    verdict = `A working BRRRR at today's rates: ${moneyShort(cashLeftIn)} stays in the deal, but you hold ${moneyShort(equityCreated)} of equity and a cashflowing rental. Leaving 10-25% in is the honest modern norm — 'infinite return' was a rate environment, not a law.`;
  else
    verdict = `Too much capital stays stranded: ${moneyShort(cashLeftIn)} (${((cashLeftIn / allIn) * 100).toFixed(0)}% of your pile) doesn't come back. That's not a BRRRR — it's a conventional purchase wearing the acronym. Buy deeper or walk.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="The 75% anchor: all-in (purchase + rehab + carry) at or below the refinance LTV × ARV returns your full investment. DSCR uses the post-refi loan — the exam that decides everything.">
          <SliderInput label="Purchase price" value={purchase} min={40000} max={500000} step={5000} display={money(purchase)} onChange={setPurchase} />
          <SliderInput label="Rehab budget" value={rehab} min={5000} max={150000} step={2500} display={money(rehab)} onChange={setRehab} />
          <SliderInput label="Carry + closing costs" value={carry} min={2000} max={40000} step={1000} display={money(carry)} onChange={setCarry} />
          <SliderInput label="After-repair value (ARV)" value={arv} min={80000} max={800000} step={5000} display={money(arv)} onChange={setArv} />
          <SliderInput label="Refinance LTV" value={refiLtv} min={65} max={80} step={1} display={refiLtv + "%"} onChange={setRefiLtv} />
          <SliderInput label="Refinance rate" value={rate} min={4} max={10} step={0.25} display={rate.toFixed(2) + "%"} onChange={setRate} />
          <SliderInput label="Monthly rent" value={rent} min={600} max={6000} step={50} display={money(rent)} onChange={setRent} />
          <SliderInput label="Monthly operating costs" value={opex} min={200} max={3000} step={25} display={money(opex)} onChange={setOpex} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="Where the money lands at the refinance"
            data={[
              { label: "All-in cost", value: allIn, color: "#3f424d" },
              { label: "Refi loan (returns cash)", value: cashOut, color: SERIES[0] },
              { label: "Cash left in deal", value: cashLeftIn, color: cashLeftIn > allIn * 0.25 ? "#c98b8b" : SERIES[2] },
              { label: "Equity you keep", value: equityCreated, color: SERIES[1] },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="All-in vs ARV" value={allInPctOfArv.toFixed(0) + "%"} note={`${refiLtv}% is the full-return line`} grade={allInPctOfArv <= refiLtv ? "good" : allInPctOfArv <= refiLtv + 10 ? "ok" : "bad"} />
            <MetricTile label="Cash left in" value={moneyShort(cashLeftIn)} note={cashLeftIn === 0 ? "Full pile recycled" : `${((cashLeftIn / allIn) * 100).toFixed(0)}% of your capital stays`} grade={leftInGrade} />
            <MetricTile label="Post-refi DSCR" value={dscr.toFixed(2)} note={`${money(monthlyCashflow)}/mo cashflow at the new loan`} grade={dscrGrade} />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Refi loan", value: moneyShort(refiLoan) },
              { label: "New payment", value: money(payment) + "/mo" },
              { label: "Equity created", value: moneyShort(equityCreated) },
              { label: "Annual NOI", value: moneyShort(noi) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/brrrr-method-complete-guide", label: "The complete BRRRR guide" },
          { href: "/articles/cash-out-refi-as-an-engine-not-an-exit", label: "The refinance rule" },
          { href: "/tools/deal-analyzer", label: "Analyze it as a straight rental" },
        ]}
      />
    </div>
  );
}
