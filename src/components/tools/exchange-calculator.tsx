"use client";

import { useState } from "react";
import {
  InputPanel,
  LearnMore,
  LiveBars,
  LiveLines,
  MetricTile,
  SERIES,
  SliderInput,
  VerdictPanel,
  moneyShort,
} from "@/components/tools/ui";
import { exchangeTax, growthSeries } from "@/lib/finance";

/** 1031 exchange calculator — the tax bill you're deferring, and what deferral compounds into. */
export function ExchangeCalculator() {
  const [salePrice, setSalePrice] = useState(800000);
  const [basis, setBasis] = useState(450000);
  const [depreciation, setDepreciation] = useState(120000);
  const [fedRate, setFedRate] = useState(20);
  const [stateRate, setStateRate] = useState(5);
  const [growth, setGrowth] = useState(9);
  const [years, setYears] = useState(15);

  const x = exchangeTax({
    salePrice,
    originalBasis: basis,
    depreciationTaken: depreciation,
    sellingCostsPct: 7,
    federalRatePct: fedRate,
    stateRatePct: stateRate,
  });

  const exchanged = growthSeries(x.equityIfExchanged, growth, years);
  const sold = growthSeries(x.equityIfSold, growth, years);
  const gap = exchanged[years] - sold[years];
  const taxPctOfEquity = x.netSale > 0 ? (x.totalTax / x.netSale) * 100 : 0;

  const verdict =
    x.totalTax < 25000
      ? `The deferred tax here is ${moneyShort(x.totalTax)} — modest enough that exchange mechanics (QI fees, 45-day pressure, forced redeployment) may cost more than they save. A 1031 is a tool for meaningful gains; this one you might just pay.`
      : `Selling outright hands ${moneyShort(x.totalTax)} (${taxPctOfEquity.toFixed(0)}% of your equity) to the IRS this year. Exchanged instead, that money keeps compounding — worth ${moneyShort(gap)} of extra wealth by year ${years} at ${growth}%. Chain it, and under current law the step-up at death means the deferred bill is never paid at all.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Selling costs at 7%. Recapture taxed at 25% federal + state; appreciation at your capital gains + state rate. Estimates for planning — exchanges run through a QI and a CPA, in that order.">
          <SliderInput label="Sale price" value={salePrice} min={150000} max={5000000} step={25000} display={moneyShort(salePrice)} onChange={setSalePrice} />
          <SliderInput label="Original basis (price + improvements)" value={basis} min={50000} max={4000000} step={25000} display={moneyShort(basis)} onChange={setBasis} />
          <SliderInput label="Depreciation taken" value={depreciation} min={0} max={1000000} step={10000} display={moneyShort(depreciation)} onChange={setDepreciation} />
          <SliderInput label="Federal cap gains rate" value={fedRate} min={0} max={23.8} step={0.1} display={fedRate.toFixed(1) + "%"} onChange={setFedRate} />
          <SliderInput label="State rate" value={stateRate} min={0} max={13.3} step={0.1} display={stateRate.toFixed(1) + "%"} onChange={setStateRate} />
          <SliderInput label="Reinvested equity growth" value={growth} min={4} max={14} step={0.5} display={growth.toFixed(1) + "%/yr"} onChange={setGrowth} />
          <SliderInput label="Years forward" value={years} min={5} max={30} step={1} display={years + " years"} onChange={setYears} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="The sale, taxed vs. exchanged"
            data={[
              { label: "Net sale proceeds", value: Math.round(x.netSale), color: "#3f424d" },
              { label: "Recapture tax (25%+)", value: -Math.round(x.recaptureTax), color: "#c98b8b" },
              { label: "Capital gains tax", value: -Math.round(x.capGainsTax), color: "#c98b8b" },
              { label: "Redeploy if sold", value: Math.round(x.equityIfSold), color: SERIES[2] },
              { label: "Redeploy if exchanged", value: Math.round(x.equityIfExchanged), color: SERIES[1] },
            ]}
          />
          <LiveLines
            title={`The deferred tax, compounding for ${years} years`}
            series={[
              { name: "1031 exchange", values: exchanged },
              { name: "Sell and pay tax", values: sold },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="Tax deferred" value={moneyShort(x.totalTax)} note={`${moneyShort(x.recaptureTax)} recapture + ${moneyShort(x.capGainsTax)} gains`} grade={x.totalTax > 25000 ? "good" : "neutral"} />
            <MetricTile label={`Extra wealth by year ${years}`} value={moneyShort(gap)} note={`What the deferred tax becomes at ${growth}%/yr`} grade="good" />
            <MetricTile label="Total gain" value={moneyShort(x.totalGain)} note={`Basis after depreciation: ${moneyShort(x.adjustedBasis)}`} grade="neutral" />
          </div>
          <VerdictPanel verdict={verdict} />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/1031-exchange-complete-guide", label: "The complete 1031 guide (clocks, boot, QI)" },
          { href: "/articles/1031-chains-and-the-step-up-in-basis", label: "The chain-to-step-up endgame" },
          { href: "/articles/depreciation-and-cost-segregation", label: "Where the recapture came from" },
        ]}
      />
    </div>
  );
}
