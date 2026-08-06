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
import {
  monthlyPayment,
  notePriceAtYield,
  noteYieldAtPrice,
  remainingBalance,
} from "@/lib/finance";

/**
 * Note yield calculator — the note buyer's two questions, both directions:
 * what yield does this price buy, and what price hits my target yield.
 * Discount, balloon, and collateral coverage on one screen.
 */
export function NoteYieldCalculator() {
  const [upb, setUpb] = useState(120000);
  const [noteRate, setNoteRate] = useState(6);
  const [remainingYears, setRemainingYears] = useState(22);
  const [balloonYears, setBalloonYears] = useState(0);
  const [pricePct, setPricePct] = useState(80);
  const [targetYield, setTargetYield] = useState(12);
  const [propertyValue, setPropertyValue] = useState(180000);

  const inputs = {
    upb,
    noteRatePct: noteRate,
    remainingMonths: remainingYears * 12,
    balloonMonths: balloonYears * 12,
  };

  const price = upb * (pricePct / 100);
  const pmt = monthlyPayment(upb, noteRate, remainingYears);
  const hasBalloon = balloonYears > 0 && balloonYears < remainingYears;
  const balloonAmount = hasBalloon
    ? remainingBalance(upb, noteRate, balloonYears * 12, remainingYears)
    : 0;

  const impliedYield = noteYieldAtPrice(inputs, price);
  const priceForTarget = notePriceAtYield(inputs, targetYield);
  const itv = propertyValue > 0 ? (price / propertyValue) * 100 : 0;
  const discount = upb - price;

  const hitsTarget = impliedYield >= targetYield;
  const covered = itv <= 65;

  const verdict = hitsTarget && covered
    ? `Buy the paper. ${pricePct}% of UPB prices this note to yield ${impliedYield.toFixed(1)}% — clear of your ${targetYield}% target — and at ${itv.toFixed(0)}% investment-to-value the collateral covers you even through a foreclosure haircut. ${hasBalloon ? `The ${moneyShort(balloonAmount)} balloon in year ${balloonYears} is where most of the return concentrates — underwrite the borrower's ability to refi it.` : "Fully amortizing, so the yield needs no exit event — it just pays."}`
    : hitsTarget
      ? `The yield works; the collateral doesn't. ${impliedYield.toFixed(1)}% clears your target, but at ${itv.toFixed(0)}% ITV a default puts your principal at the mercy of the sale. Either the price comes down or you're being paid for credit risk, not real estate risk — know which business you're in.`
      : `Don't pay this. At ${pricePct}% of UPB the note yields ${impliedYield.toFixed(1)}% against your ${targetYield}% target. Your number is ${moneyShort(priceForTarget)} — ${(priceForTarget / upb * 100).toFixed(0)}% of UPB. Bid there and let the seller decide; the discount is where your yield is manufactured.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Performing-note math: yield is the IRR of the payment stream (plus balloon, if any) against your price, solved to the basis point. Non-performing paper is a different business — you're pricing the workout, not the coupon.">
          <SliderInput label="Unpaid principal balance" value={upb} min={20000} max={600000} step={5000} display={money(upb)} onChange={setUpb} />
          <SliderInput label="Note rate (face)" value={noteRate} min={3} max={12} step={0.25} display={noteRate.toFixed(2) + "%"} onChange={setNoteRate} />
          <SliderInput label="Remaining term" value={remainingYears} min={3} max={30} step={1} display={remainingYears + " yrs"} onChange={setRemainingYears} />
          <SliderInput label="Balloon due in" value={balloonYears} min={0} max={15} step={1} display={balloonYears === 0 ? "none" : balloonYears + " yrs"} onChange={setBalloonYears} />
          <SliderInput label="Your price (% of UPB)" value={pricePct} min={40} max={105} step={1} display={pricePct + "% · " + moneyShort(price)} onChange={setPricePct} />
          <SliderInput label="Target yield" value={targetYield} min={6} max={20} step={0.5} display={targetYield.toFixed(1) + "%"} onChange={setTargetYield} />
          <SliderInput label="Collateral property value" value={propertyValue} min={50000} max={900000} step={5000} display={money(propertyValue)} onChange={setPropertyValue} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="The trade, in dollars"
            data={[
              { label: "Face (UPB)", value: Math.round(upb), color: "#3f424d" },
              { label: "Your price", value: Math.round(price), color: SERIES[0] },
              { label: "Discount", value: Math.round(discount), color: SERIES[1] },
              ...(hasBalloon
                ? [{ label: `Balloon (yr ${balloonYears})`, value: Math.round(balloonAmount), color: SERIES[2] }]
                : []),
              { label: "Collateral value", value: Math.round(propertyValue), color: SERIES[3] },
            ]}
            note={`Payment stays ${money(pmt)}/mo no matter what you pay — the discount is the only lever that moves your yield above the ${noteRate.toFixed(2)}% face rate.`}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile
              label="Yield at your price"
              value={impliedYield.toFixed(1) + "%"}
              note={`Face rate is ${noteRate.toFixed(2)}% — the ${(impliedYield - noteRate).toFixed(1)} pts above it came from the discount`}
              grade={hitsTarget ? "good" : impliedYield >= targetYield - 1.5 ? "ok" : "bad"}
            />
            <MetricTile
              label="Price for target"
              value={moneyShort(priceForTarget)}
              note={`${((priceForTarget / upb) * 100).toFixed(0)}% of UPB hits ${targetYield.toFixed(1)}% exactly — your maximum bid`}
              grade="neutral"
            />
            <MetricTile
              label="Investment-to-value"
              value={itv.toFixed(0) + "%"}
              note="Your basis vs. the collateral — under 65% survives a foreclosure sale"
              grade={covered ? "good" : itv <= 80 ? "ok" : "bad"}
            />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Monthly payment", value: money(pmt) },
              { label: "Discount captured", value: moneyShort(discount) },
              { label: "Cash yield (pmt/price)", value: ((pmt * 12 / price) * 100).toFixed(1) + "%" },
              { label: "Equity cushion", value: moneyShort(propertyValue - price) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/note-investing-and-private-lending-guide", label: "Note investing, the full guide" },
          { href: "/articles/distressed-debt-and-note-funds", label: "Distressed debt and note funds" },
          { href: "/articles/seller-financing-explained", label: "Where these notes come from" },
          { href: "/articles/contract-for-deed-land-contracts", label: "Contracts for deed" },
        ]}
      />
    </div>
  );
}
