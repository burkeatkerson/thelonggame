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
  moneyShort,
} from "@/components/tools/ui";
import { runWaterfall } from "@/lib/finance";

/** Syndication waterfall visualizer — watch the money actually move. */
export function WaterfallVisualizer() {
  const [lpEquity, setLpEquity] = useState(2700000);
  const [gpEquity, setGpEquity] = useState(300000);
  const [prefPct, setPrefPct] = useState(8);
  const [lpSplitPct, setLpSplitPct] = useState(70);
  const [totalProfit, setTotalProfit] = useState(2000000);
  const [holdYears, setHoldYears] = useState(5);

  const w = runWaterfall({ lpEquity, gpEquity, prefPct, lpSplitPct, totalProfit, holdYears });
  const totalEquity = lpEquity + gpEquity;
  const gpCoinvestPct = (gpEquity / totalEquity) * 100;
  const lpMultiple = lpEquity > 0 ? (lpEquity + w.lpTotal) / lpEquity : 0;
  const prefCovered = w.prefTotal >= totalEquity * (prefPct / 100) * holdYears;

  const verdict = !prefCovered
    ? `The deal didn't fully earn its pref: profits of ${moneyShort(totalProfit)} cover only part of the promised ${prefPct}% × ${holdYears} years. LPs absorb the shortfall first in time but the sponsor earns no promote at all — which is exactly the alignment the structure intends.`
    : w.gpPromote > w.lpFromSplit
      ? `Above the pref, the sponsor's promote (${moneyShort(w.gpPromote)}) exceeds the LPs' share of the split — an unusually sponsor-rich structure. Check the split percentage and whether the promote should be laddered behind higher hurdles.`
      : `LPs collect ${moneyShort(w.lpTotal)} of the ${moneyShort(totalProfit)} profit (a ${lpMultiple.toFixed(2)}x equity multiple, ~${w.lpAnnualizedPct.toFixed(1)}%/yr simple); the sponsor's ${moneyShort(w.gpTotal)} combines the promote with their co-invested share. With ${gpCoinvestPct.toFixed(0)}% sponsor co-invest, ${gpCoinvestPct >= 10 ? "alignment is real" : "alignment is thin — ask why the sponsor has so little of their own money at risk"}.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Simple (non-compounding) preferred return with a single-hurdle split; the GP's co-invested equity earns LP-side economics on its share. Real deals add catch-ups, IRR hurdles and fees — read the actual documents.">
          <SliderInput label="LP equity" value={lpEquity} min={250000} max={10000000} step={50000} display={moneyShort(lpEquity)} onChange={setLpEquity} />
          <SliderInput label="Sponsor co-invest" value={gpEquity} min={0} max={2000000} step={25000} display={moneyShort(gpEquity)} onChange={setGpEquity} />
          <SliderInput label="Preferred return" value={prefPct} min={4} max={12} step={0.5} display={prefPct.toFixed(1) + "%"} onChange={setPrefPct} />
          <SliderInput label="LP share above pref" value={lpSplitPct} min={50} max={90} step={5} display={`${lpSplitPct}/${100 - lpSplitPct}`} onChange={setLpSplitPct} />
          <SliderInput label="Total deal profit" value={totalProfit} min={0} max={8000000} step={100000} display={moneyShort(totalProfit)} onChange={setTotalProfit} />
          <SliderInput label="Hold period" value={holdYears} min={2} max={10} step={1} display={holdYears + " years"} onChange={setHoldYears} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="The waterfall — profit flowing in order"
            data={[
              { label: "Total profit", value: totalProfit, color: "#3f424d" },
              { label: `Tier 1: ${prefPct}% pref`, value: Math.round(w.prefTotal), color: SERIES[0] },
              { label: `Tier 2: LP ${lpSplitPct}% of split`, value: Math.round(w.lpFromSplit), color: SERIES[0] },
              { label: "Sponsor promote", value: Math.round(w.gpPromote), color: SERIES[2] },
              { label: "LPs receive", value: Math.round(w.lpTotal), color: SERIES[1] },
              { label: "Sponsor receives", value: Math.round(w.gpTotal), color: SERIES[2] },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="LP total profit" value={moneyShort(w.lpTotal)} note={`${lpMultiple.toFixed(2)}x multiple · ~${w.lpAnnualizedPct.toFixed(1)}%/yr simple`} grade={w.lpAnnualizedPct >= 13 ? "good" : w.lpAnnualizedPct >= 8 ? "ok" : "bad"} />
            <MetricTile label="Sponsor promote" value={moneyShort(w.gpPromote)} note="Earned only above the pref — pay for outperformance" grade="neutral" />
            <MetricTile label="Sponsor co-invest" value={gpCoinvestPct.toFixed(0) + "%"} note="10%+ is real alignment; 1% is marketing" grade={gpCoinvestPct >= 10 ? "good" : gpCoinvestPct >= 5 ? "ok" : "bad"} />
          </div>
          <VerdictPanel verdict={verdict} />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/waterfalls-in-plain-english", label: "Waterfalls in plain English" },
          { href: "/articles/real-estate-syndication-explained", label: "The full syndication guide" },
          { href: "/wealth/raising-capital", label: "The raising-capital section" },
        ]}
      />
    </div>
  );
}
