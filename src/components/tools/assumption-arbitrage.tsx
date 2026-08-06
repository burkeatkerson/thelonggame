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
import { monthlyPayment, presentValueOfPayments } from "@/lib/finance";

/**
 * Assumption arbitrage — what a seller's below-market assumable loan is
 * actually worth in dollars: the NPV of the payment savings over your hold,
 * and the blended rate once gap financing covers the equity gap.
 */
export function AssumptionArbitrage() {
  const [price, setPrice] = useState(400000);
  const [assumedBalance, setAssumedBalance] = useState(280000);
  const [assumedRate, setAssumedRate] = useState(3);
  const [remainingYears, setRemainingYears] = useState(25);
  const [marketRate, setMarketRate] = useState(7);
  const [cashDown, setCashDown] = useState(60000);
  const [gapRate, setGapRate] = useState(9.5);
  const [holdYears, setHoldYears] = useState(8);

  const equityGap = Math.max(0, price - assumedBalance - cashDown);
  const gapPayment = equityGap > 0 ? monthlyPayment(equityGap, gapRate, 15) : 0;

  const assumedPayment = monthlyPayment(assumedBalance, assumedRate, remainingYears);
  // The road not taken: same total borrowing on a fresh 30-year note.
  const newLoan = assumedBalance + equityGap;
  const newPayment = monthlyPayment(newLoan, marketRate, 30);
  const stackPayment = assumedPayment + gapPayment;
  const monthlySaving = newPayment - stackPayment;

  // NPV of the saving stream over the hold, discounted at the market rate —
  // the cash value of the rate lock you're inheriting.
  const holdMonths = holdYears * 12;
  const npvSaving = presentValueOfPayments(monthlySaving, marketRate, Math.min(holdMonths, remainingYears * 12));

  // Blended rate across the assumed loan + gap note, weighted by balance.
  const blendedRate =
    newLoan > 0 ? (assumedBalance * assumedRate + equityGap * gapRate) / newLoan : assumedRate;
  const spread = marketRate - blendedRate;

  const strong = spread >= 1.5 && monthlySaving > 0;
  const positive = monthlySaving > 0;

  const verdict = strong
    ? `Take it seriously. The blended stack runs ${blendedRate.toFixed(2)}% against a ${marketRate.toFixed(2)}% market — ${money(monthlySaving)}/month that compounds into ${moneyShort(npvSaving)} of present value over your ${holdYears}-year hold. That's the number you can justify paying above list for, because the financing is part of what you're buying.`
    : positive
      ? `Marginal. The gap note at ${gapRate.toFixed(2)}% is eating most of the assumed rate's edge — the blend is ${blendedRate.toFixed(2)}% vs. ${marketRate.toFixed(2)}% market, worth ${money(monthlySaving)}/month. Real, but not worth overpaying for. Push the seller to carry the gap cheaper, or bring more cash.`
      : `The arbitrage is gone. Gap financing at ${gapRate.toFixed(2)}% on ${moneyShort(equityGap)} costs more than the assumed rate saves — the stack pays ${money(stackPayment)}/month vs. ${money(newPayment)} for a clean new loan. Assume nothing; just get the market mortgage.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="The equity gap (price − assumed balance − cash) is financed with a 15-year second; the comparison loan is a fresh 30-year at market. The NPV discounts the payment savings at the market rate over your hold — the fair cash value of the seller's rate lock.">
          <SliderInput label="Purchase price" value={price} min={150000} max={1200000} step={5000} display={money(price)} onChange={setPrice} />
          <SliderInput label="Assumable loan balance" value={assumedBalance} min={50000} max={900000} step={5000} display={money(assumedBalance)} onChange={setAssumedBalance} />
          <SliderInput label="Assumed rate" value={assumedRate} min={2} max={6} step={0.125} display={assumedRate.toFixed(3) + "%"} onChange={setAssumedRate} />
          <SliderInput label="Years left on the loan" value={remainingYears} min={10} max={29} step={1} display={remainingYears + " yrs"} onChange={setRemainingYears} />
          <SliderInput label="Today's market rate" value={marketRate} min={4.5} max={10} step={0.125} display={marketRate.toFixed(3) + "%"} onChange={setMarketRate} />
          <SliderInput label="Cash down" value={cashDown} min={0} max={400000} step={5000} display={money(cashDown)} onChange={setCashDown} />
          <SliderInput label="Gap financing rate" value={gapRate} min={5} max={14} step={0.25} display={gapRate.toFixed(2) + "%"} onChange={setGapRate} />
          <SliderInput label="Planned hold" value={holdYears} min={2} max={25} step={1} display={holdYears + " yrs"} onChange={setHoldYears} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="Monthly payment — the stack vs. a new loan"
            data={[
              { label: "Assumed loan /mo", value: Math.round(assumedPayment), color: SERIES[0] },
              { label: "Gap note /mo", value: Math.round(gapPayment), color: SERIES[2] },
              { label: "Stack total /mo", value: Math.round(stackPayment), color: SERIES[1] },
              { label: "New loan /mo", value: Math.round(newPayment), color: "#3f424d" },
            ]}
            note={`Same ${moneyShort(newLoan)} borrowed both ways. The gap note amortizes over 15 years — faster payoff, higher payment, and it still usually wins.`}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile
              label="Monthly saving"
              value={(monthlySaving < 0 ? "−" : "") + money(Math.abs(monthlySaving))}
              note="Stack vs. new-loan payment"
              grade={monthlySaving > 200 ? "good" : monthlySaving > 0 ? "ok" : "bad"}
            />
            <MetricTile
              label="Rate-lock value"
              value={moneyShort(Math.max(0, npvSaving))}
              note={`NPV of the savings over ${holdYears} years — what the financing itself is worth`}
              grade={npvSaving > 20000 ? "good" : npvSaving > 0 ? "ok" : "bad"}
            />
            <MetricTile
              label="Blended rate"
              value={blendedRate.toFixed(2) + "%"}
              note={`Weighted across both notes, vs. ${marketRate.toFixed(2)}% market`}
              grade={spread >= 1.5 ? "good" : spread > 0 ? "ok" : "bad"}
            />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Equity gap", value: moneyShort(equityGap) },
              { label: "Rate spread", value: spread.toFixed(2) + " pts" },
              { label: "Saving over hold", value: moneyShort(monthlySaving * holdMonths) },
              { label: "Cash to close", value: moneyShort(cashDown) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/assumable-mortgage-takeovers", label: "How assumptions actually work" },
          { href: "/articles/subject-to-real-estate-investing", label: "The unsanctioned cousin: subject-to" },
          { href: "/articles/creative-financing-real-estate-complete-guide", label: "The creative financing map" },
        ]}
      />
    </div>
  );
}
