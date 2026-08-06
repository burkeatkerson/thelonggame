"use client";

import { useState } from "react";
import {
  InputPanel,
  LearnMore,
  LiveLines,
  MetricTile,
  SliderInput,
  VerdictPanel,
  money,
  moneyShort,
} from "@/components/tools/ui";
import { exchangeTax, growthSeries } from "@/lib/finance";

/**
 * Exit strategy comparator — the same sale run three ways: pay the tax and
 * reinvest, defer it through a 1031, or spread it with an installment sale.
 * After-tax wealth curves over the years that follow the closing.
 */
export function ExitStrategyComparator() {
  const [salePrice, setSalePrice] = useState(900000);
  const [originalBasis, setOriginalBasis] = useState(450000);
  const [depreciationTaken, setDepreciationTaken] = useState(140000);
  const [loanBalance, setLoanBalance] = useState(300000);
  const [federalRate, setFederalRate] = useState(20);
  const [stateRate, setStateRate] = useState(5);
  const [growthRate, setGrowthRate] = useState(9);
  const [installmentYears, setInstallmentYears] = useState(10);
  const [installmentRate, setInstallmentRate] = useState(7);
  const [years, setYears] = useState(15);

  const tax = exchangeTax({
    salePrice,
    originalBasis,
    depreciationTaken,
    sellingCostsPct: 6,
    federalRatePct: federalRate,
    stateRatePct: stateRate,
  });

  // Equity actually in hand after the loan pays off.
  const sellEquity = Math.max(0, tax.equityIfSold - loanBalance);
  const exchangeEquity = Math.max(0, tax.equityIfExchanged - loanBalance);

  // Path 1 — sell outright: after-tax equity compounds at the growth rate.
  const sellSeries = growthSeries(sellEquity, growthRate, years);

  // Path 2 — 1031: full pre-tax equity compounds; the deferred bill rides
  // along until death's step-up (or the next exchange) erases it.
  const exchangeSeries = growthSeries(exchangeEquity, growthRate, years);

  // Path 3 — installment sale: buyer note at the carry rate; principal
  // arrives (and is taxed) in level slices; each year's after-tax receipts
  // are reinvested at the growth rate. Recapture is due in year one.
  const grossProfitRatio = tax.netSale > 0 ? (tax.totalGain - Math.min(depreciationTaken, tax.totalGain)) / tax.netSale : 0;
  const capGainsRatePct = federalRate + stateRate;
  const notePrincipal = Math.max(0, tax.netSale - loanBalance);
  const installmentSeries: number[] = [];
  {
    let invested = -tax.recaptureTax; // recapture can't be spread; it's due up front
    let noteBalance = notePrincipal;
    const slice = notePrincipal / installmentYears;
    for (let y = 0; y <= years; y++) {
      installmentSeries.push(Math.max(0, invested + noteBalance));
      const interest = noteBalance * (installmentRate / 100);
      const principalIn = y < installmentYears ? slice : 0;
      const taxOnYear =
        interest * ((federalRate + 12 + stateRate) / 100) + // interest taxed as ordinary-ish income
        principalIn * grossProfitRatio * (capGainsRatePct / 100);
      invested = invested * (1 + growthRate / 100) + interest + principalIn - taxOnYear;
      noteBalance -= principalIn;
    }
  }

  const endSell = sellSeries[years];
  const endExchange = exchangeSeries[years];
  const endInstallment = installmentSeries[years];
  const best = Math.max(endSell, endExchange, endInstallment);
  const bestName = best === endExchange ? "the 1031" : best === endInstallment ? "the installment sale" : "selling outright";
  const dragCost = endExchange - endSell;

  const verdict =
    best === endExchange
      ? `The 1031 wins by ${moneyShort(endExchange - Math.max(endSell, endInstallment))}. The ${moneyShort(tax.totalTax)} you don't hand over in year one compounds into ${moneyShort(dragCost)} of extra wealth by year ${years} — and if the position rides to the step-up in basis, the deferred bill is never paid at all. The installment sale earns its keep only when you want income now and the buyer's credit is real.`
      : best === endInstallment
        ? `The installment sale edges it out here — ${moneyShort(endInstallment)} by year ${years}. The ${installmentRate.toFixed(1)}% carry on ${moneyShort(notePrincipal)} out-earns what the reinvested equity would do, and spreading the gain keeps each year's tax in a lower bracket. The catch the math can't price: you're now the bank, and your collateral is a property you no longer control.`
        : `Just sell and pay the tax. At these numbers the deferral isn't earning its complexity — ${bestName} nets ${moneyShort(best)}. This usually means the gain is small relative to the equity; deferral strategies are engines for large embedded gains, not small ones.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="All three paths reinvest at the same growth rate — the comparison isolates the tax structure, nothing else. Installment path: recapture is due in year one (it can't be spread), principal slices are taxed by the gross-profit ratio, interest as ordinary income. Selling costs fixed at 6%.">
          <SliderInput label="Sale price" value={salePrice} min={200000} max={5000000} step={25000} display={money(salePrice)} onChange={setSalePrice} />
          <SliderInput label="Original basis" value={originalBasis} min={50000} max={4000000} step={25000} display={money(originalBasis)} onChange={setOriginalBasis} />
          <SliderInput label="Depreciation taken" value={depreciationTaken} min={0} max={1500000} step={10000} display={money(depreciationTaken)} onChange={setDepreciationTaken} />
          <SliderInput label="Loan balance" value={loanBalance} min={0} max={3000000} step={25000} display={money(loanBalance)} onChange={setLoanBalance} />
          <SliderInput label="Federal cap-gains rate" value={federalRate} min={15} max={23.8} step={0.1} display={federalRate.toFixed(1) + "%"} onChange={setFederalRate} />
          <SliderInput label="State rate" value={stateRate} min={0} max={13.3} step={0.1} display={stateRate.toFixed(1) + "%"} onChange={setStateRate} />
          <SliderInput label="Reinvestment growth rate" value={growthRate} min={4} max={15} step={0.5} display={growthRate.toFixed(1) + "%"} onChange={setGrowthRate} />
          <SliderInput label="Installment note term" value={installmentYears} min={3} max={20} step={1} display={installmentYears + " yrs"} onChange={setInstallmentYears} />
          <SliderInput label="Installment note rate" value={installmentRate} min={4} max={11} step={0.25} display={installmentRate.toFixed(2) + "%"} onChange={setInstallmentRate} />
          <SliderInput label="Horizon" value={years} min={5} max={25} step={1} display={years + " yrs"} onChange={setYears} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveLines
            title="After-tax wealth, three exits"
            series={[
              { name: "1031 exchange", values: exchangeSeries },
              { name: "Installment sale", values: installmentSeries },
              { name: "Sell outright", values: sellSeries },
            ]}
            note="The 1031 line still owes its deferred tax if you ever cash out flat — its true lead is the gap that the step-up in basis makes permanent."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile
              label="Tax if sold today"
              value={moneyShort(tax.totalTax)}
              note={`${moneyShort(tax.recaptureTax)} recapture + ${moneyShort(tax.capGainsTax)} capital gains`}
              grade="neutral"
            />
            <MetricTile
              label={`Cost of paying it, yr ${years}`}
              value={moneyShort(dragCost)}
              note="What the year-one tax bill compounds into — the deferral's real prize"
              grade={dragCost > tax.totalTax ? "good" : "neutral"}
            />
            <MetricTile
              label="Winner"
              value={best === endExchange ? "1031" : best === endInstallment ? "Installment" : "Sell"}
              note={`${moneyShort(best)} after ${years} years, after tax`}
              grade="good"
            />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Sell outright", value: moneyShort(endSell) },
              { label: "1031 exchange", value: moneyShort(endExchange) },
              { label: "Installment sale", value: moneyShort(endInstallment) },
              { label: "Deferred bill riding", value: moneyShort(tax.totalTax) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/installment-sales-tax-strategy", label: "Installment sales, in full" },
          { href: "/articles/1031-exchange-complete-guide", label: "The 1031 exchange guide" },
          { href: "/articles/1031-chains-and-the-step-up-in-basis", label: "1031 chains and the step-up" },
          { href: "/articles/what-tax-free-actually-means", label: "What tax-free actually means" },
        ]}
      />
    </div>
  );
}
