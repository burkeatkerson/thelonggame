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
import { maxAllowableOffer } from "@/lib/finance";

/** 70%-rule flip calculator — MAO plus the full profit waterfall. */
export function FlipCalculator() {
  const [arv, setArv] = useState(300000);
  const [repairs, setRepairs] = useState(40000);
  const [rulePct, setRulePct] = useState(70);
  const [offer, setOffer] = useState(170000);
  const [months, setMonths] = useState(6);
  const [financeRate, setFinanceRate] = useState(11);
  const [sellingPct, setSellingPct] = useState(8);

  const mao = maxAllowableOffer(arv, repairs, rulePct);

  // profit waterfall at YOUR offer
  const loanAmount = (offer + repairs) * 0.85; // typical hard money: 85% of cost
  const financingCost = loanAmount * (financeRate / 100) * (months / 12) + loanAmount * 0.02; // interest + 2 pts
  const holdingCost = 450 * months; // taxes, insurance, utilities
  const sellingCost = arv * (sellingPct / 100);
  const totalCosts = offer + repairs + financingCost + holdingCost + sellingCost;
  const profit = arv - totalCosts;
  const marginPct = (profit / arv) * 100;
  const overMao = offer - mao;

  const grade = marginPct >= 12 ? "good" : marginPct >= 7 ? "ok" : "bad";

  let verdict: string;
  if (profit <= 0)
    verdict = `This flip loses ${moneyShort(Math.abs(profit))} before anything goes wrong. You're ${moneyShort(overMao)} above the ${rulePct}% rule's maximum offer — the formula existed to stop exactly this purchase.`;
  else if (marginPct < 7)
    verdict = `${moneyShort(profit)} of projected profit is a ${marginPct.toFixed(1)}% margin — one surprise (a $10k rehab overrun, an extra two months, a 3% price cut) converts this to a wash. Thin flips are how operators work a year for free.`;
  else if (marginPct < 12)
    verdict = `A workable flip: ${moneyShort(profit)} (${marginPct.toFixed(1)}% of ARV) with normal-sized error bars. Verify the ARV against sold comps and get the rehab bid in writing — the margin covers mistakes, not fictions.`;
  else
    verdict = `A strong flip on paper — ${moneyShort(profit)} at a ${marginPct.toFixed(1)}% margin${offer <= mao ? `, and you're at or under the ${rulePct}% rule's ${moneyShort(mao)} ceiling` : ""}. Strong paper margins earn a second look at the ARV: if it's real, move.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Financing modeled as hard money at 85% of cost, quoted rate + 2 points. Holding at $450/month (taxes, insurance, utilities). Tighten every number to your market before offering.">
          <SliderInput label="After-repair value (ARV)" value={arv} min={100000} max={900000} step={5000} display={money(arv)} onChange={setArv} />
          <SliderInput label="Repair budget" value={repairs} min={5000} max={200000} step={2500} display={money(repairs)} onChange={setRepairs} />
          <SliderInput label="The rule" value={rulePct} min={60} max={80} step={1} display={rulePct + "% rule"} onChange={setRulePct} />
          <SliderInput label="Your offer" value={offer} min={30000} max={700000} step={2500} display={money(offer)} onChange={setOffer} />
          <SliderInput label="Project length" value={months} min={2} max={14} step={1} display={months + " months"} onChange={setMonths} />
          <SliderInput label="Financing rate" value={financeRate} min={7} max={15} step={0.5} display={financeRate.toFixed(1) + "% + 2pts"} onChange={setFinanceRate} />
          <SliderInput label="Selling costs" value={sellingPct} min={5} max={10} step={0.5} display={sellingPct.toFixed(1) + "% of ARV"} onChange={setSellingPct} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="The profit waterfall at your offer"
            data={[
              { label: "Sale at ARV", value: arv, color: "#3f424d" },
              { label: "Purchase", value: -offer, color: SERIES[0] },
              { label: "Repairs", value: -repairs, color: SERIES[0] },
              { label: "Financing", value: -Math.round(financingCost), color: SERIES[0] },
              { label: "Holding", value: -holdingCost, color: SERIES[0] },
              { label: "Selling costs", value: -Math.round(sellingCost), color: SERIES[0] },
              { label: "Profit", value: Math.round(profit), color: profit > 0 ? SERIES[1] : "#c98b8b" },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="Max allowable offer" value={moneyShort(mao)} note={`${rulePct}% of ARV minus repairs — the screening ceiling`} grade="neutral" />
            <MetricTile label="Your offer vs. MAO" value={(overMao >= 0 ? "+" : "−") + moneyShort(Math.abs(overMao))} note={overMao <= 0 ? "At or under the rule" : "Above the rule — margin is leaving"} grade={overMao <= 0 ? "good" : overMao < arv * 0.05 ? "ok" : "bad"} />
            <MetricTile label="Projected margin" value={marginPct.toFixed(1) + "%"} note={`${moneyShort(profit)} pre-tax on a ${months}-month project`} grade={grade} />
          </div>
          <VerdictPanel verdict={verdict} />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/70-percent-rule-house-flipping", label: "The 70% rule, fully explained" },
          { href: "/articles/house-flipping-strategies-complete-guide", label: "Flipping strategies guide" },
          { href: "/articles/brrrr-method-complete-guide", label: "Keep it instead: the BRRRR route" },
        ]}
      />
    </div>
  );
}
