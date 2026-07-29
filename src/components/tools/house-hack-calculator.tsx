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

/** House hack calculator — your real housing cost, and the FHA self-sufficiency check. */
export function HouseHackCalculator() {
  const [price, setPrice] = useState(400000);
  const [units, setUnits] = useState(4);
  const [downPct, setDownPct] = useState(3.5);
  const [rate, setRate] = useState(6.5);
  const [rentPerUnit, setRentPerUnit] = useState(1100);
  const [currentRent, setCurrentRent] = useState(1600);

  const loan = price * (1 - downPct / 100);
  const pi = monthlyPayment(loan, rate);
  const taxesIns = price * 0.015 / 12 + 120; // rough taxes + insurance
  const mip = downPct < 10 ? (loan * 0.0055) / 12 : 0; // FHA MIP approximation
  const fullPayment = pi + taxesIns + mip;

  const rentedUnits = units - 1;
  const rentalIncome = rentedUnits * rentPerUnit;
  const opexOnRented = rentalIncome * 0.22; // vacancy, maintenance, capex on tenant units
  const yourCost = fullPayment + opexOnRented - rentalIncome;
  const vsRenting = currentRent - yourCost;
  const cashToClose = price * (downPct / 100) + price * 0.03;

  // FHA self-sufficiency (3-4 units): 75% of ALL units' rent ≥ full payment
  const selfSufficiency = (units * rentPerUnit * 0.75) / fullPayment;
  const ssApplies = units >= 3 && downPct < 10;

  const grade = yourCost <= 0 ? "good" : yourCost < currentRent * 0.5 ? "good" : yourCost < currentRent ? "ok" : "bad";

  let verdict: string;
  if (ssApplies && selfSufficiency < 1)
    verdict = `FHA's self-sufficiency test fails at ${(selfSufficiency * 100).toFixed(0)}% — 75% of all units' market rent doesn't cover the full payment, so this loan likely won't be approved on a ${units}-unit at this price. That's underwriting discipline imposed by law: the price is too high for the rents.`;
  else if (yourCost <= 0)
    verdict = `You live for free and get paid ${money(Math.abs(yourCost))}/month to do it. Tenant rent covers the entire building including reserves on their units. This is the deal the whole strategy exists to find — verify those rents against real comps twice.`;
  else if (vsRenting > 0)
    verdict = `Your effective housing cost is ${money(yourCost)}/month — ${money(vsRenting)}/month less than renting. That's ${moneyShort(vsRenting * 12)}/year redirected to reserves and the next deal, while tenants amortize your loan and you learn the business from thirty feet away.`;
  else
    verdict = `This hack costs more than your current rent — the building is too expensive for its rents. A house hack should cut your housing cost, not gild it. Lower the price, raise the unit count, or find better rents.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Taxes + insurance estimated at 1.5%/yr of price; FHA mortgage insurance ~0.55%/yr when down payment < 10%. Operating costs on tenant units at 22% of their rent (vacancy, maintenance, CapEx).">
          <SliderInput label="Purchase price" value={price} min={150000} max={900000} step={10000} display={money(price)} onChange={setPrice} />
          <SliderInput label="Units" value={units} min={2} max={4} step={1} display={units + " units"} onChange={setUnits} />
          <SliderInput label="Down payment" value={downPct} min={3.5} max={25} step={0.5} display={downPct.toFixed(1) + "%"} onChange={setDownPct} />
          <SliderInput label="Rate" value={rate} min={4} max={9} step={0.25} display={rate.toFixed(2) + "%"} onChange={setRate} />
          <SliderInput label="Market rent per unit" value={rentPerUnit} min={500} max={3500} step={50} display={money(rentPerUnit)} onChange={setRentPerUnit} />
          <SliderInput label="Your current rent" value={currentRent} min={600} max={4500} step={50} display={money(currentRent)} onChange={setCurrentRent} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveBars
            title="Your monthly housing math"
            data={[
              { label: "Full payment (PITI+MIP)", value: Math.round(fullPayment), color: "#3f424d" },
              { label: `Rent from ${rentedUnits} unit${rentedUnits > 1 ? "s" : ""}`, value: rentalIncome, color: SERIES[1] },
              { label: "Opex on tenant units", value: -Math.round(opexOnRented), color: SERIES[0] },
              { label: "Your housing cost", value: Math.round(yourCost), color: yourCost <= 0 ? SERIES[1] : SERIES[2] },
              { label: "Renting instead", value: currentRent, color: "#595d6c" },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="Your housing cost" value={yourCost <= 0 ? "+" + money(Math.abs(yourCost)) : money(yourCost)} note={yourCost <= 0 ? "You're paid to live here" : "Per month, all-in, honest expenses"} grade={grade} />
            <MetricTile label="Saved vs. renting" value={moneyShort(Math.max(0, vsRenting * 12)) + "/yr"} note="The raise you just gave yourself" grade={vsRenting > 0 ? "good" : "bad"} />
            <MetricTile
              label={ssApplies ? "FHA self-sufficiency" : "Cash to close"}
              value={ssApplies ? (selfSufficiency * 100).toFixed(0) + "%" : moneyShort(cashToClose)}
              note={ssApplies ? "Must reach 100% on 3-4 unit FHA loans" : "Down payment + ~3% closing"}
              grade={ssApplies ? (selfSufficiency >= 1 ? "good" : "bad") : "neutral"}
            />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Cash to close", value: moneyShort(cashToClose) },
              { label: "Loan", value: moneyShort(loan) },
              { label: "P&I", value: money(pi) + "/mo" },
              { label: "After you move out", value: money(units * rentPerUnit - fullPayment - units * rentPerUnit * 0.22) + "/mo" },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/house-hacking-complete-guide", label: "The complete house hacking guide" },
          { href: "/articles/how-much-money-to-start-investing-in-real-estate", label: "What entry really costs" },
          { href: "/articles/investing-in-small-multifamily-duplex-fourplex", label: "Why 2-4 units is the sweet spot" },
        ]}
      />
    </div>
  );
}
