"use client";

import { useMemo, useState } from "react";
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
import { monthlyPayment, remainingBalance } from "@/lib/finance";

/**
 * Portfolio velocity simulator — the 1-to-N-doors question run as an actual
 * simulation: cashflow snowballs into down payments, appreciation builds
 * equity, and (optionally) cash-out refis recycle it. Out comes the year
 * each door lands and when the portfolio's income crosses your target.
 */

type Door = {
  price: number; // current value
  loan: number; // original balance
  ratePct: number;
  ageMonths: number;
};

export function VelocitySimulator() {
  const [startingCash, setStartingCash] = useState(60000);
  const [savingsPerMonth, setSavingsPerMonth] = useState(1500);
  const [doorPrice, setDoorPrice] = useState(250000);
  const [downPct, setDownPct] = useState(25);
  const [ratePct, setRatePct] = useState(6.5);
  const [rentYieldPct, setRentYieldPct] = useState(0.8); // monthly rent as % of price
  const [opexPct, setOpexPct] = useState(40); // % of rent
  const [appreciationPct, setAppreciationPct] = useState(3.5);
  const [recycle, setRecycle] = useState(true);
  const [targetIncome, setTargetIncome] = useState(8000);

  const sim = useMemo(() => {
    const YEARS = 20;
    const closingPct = 3;
    const doors: Door[] = [];
    let cash = startingCash;
    let priceNow = doorPrice;
    const doorYears: number[] = [];
    const incomeSeries: number[] = [0];
    const equitySeries: number[] = [0];
    const doorSeries: number[] = [0];
    let refiCount = 0;
    let targetYear: number | null = null;

    for (let m = 1; m <= YEARS * 12; m++) {
      // Every door pays (or costs) its monthly cashflow.
      let monthlyIncome = 0;
      for (const d of doors) {
        const rent = d.price * (rentYieldPct / 100);
        const pmt = monthlyPayment(d.loan, d.ratePct);
        monthlyIncome += rent * (1 - opexPct / 100) - pmt;
        d.ageMonths += 1;
        d.price *= Math.pow(1 + appreciationPct / 100, 1 / 12);
      }
      cash += monthlyIncome + savingsPerMonth;
      priceNow *= Math.pow(1 + appreciationPct / 100, 1 / 12);

      // Recycle: cash-out refi any seasoned door back to 75% LTV when the
      // pull covers a meaningful chunk — but only if the door still cashflows
      // after the new loan (the site's rule: never refi into fragility).
      if (recycle) {
        for (const d of doors) {
          if (d.ageMonths < 18) continue;
          const balance = remainingBalance(d.loan, d.ratePct, d.ageMonths);
          const newLoan = d.price * 0.75;
          const pull = newLoan - balance;
          if (pull < priceNow * 0.1) continue;
          const rent = d.price * (rentYieldPct / 100);
          const newPmt = monthlyPayment(newLoan, ratePct);
          if (rent * 0.8 * (1 - opexPct / 100) - newPmt < 0) continue;
          cash += pull;
          d.loan = newLoan;
          d.ratePct = ratePct;
          d.ageMonths = 0;
          refiCount++;
        }
      }

      // Buy when the pile covers down payment + closing on today's price.
      const needed = priceNow * ((downPct + closingPct) / 100);
      while (cash >= needed && doors.length < 40) {
        cash -= needed;
        doors.push({ price: priceNow, loan: priceNow * (1 - downPct / 100), ratePct, ageMonths: 0 });
        doorYears.push(m / 12);
      }

      if (m % 12 === 0) {
        const equity = doors.reduce(
          (s, d) => s + d.price - remainingBalance(d.loan, d.ratePct, d.ageMonths),
          0,
        );
        incomeSeries.push(Math.max(0, monthlyIncome));
        equitySeries.push(equity + cash);
        doorSeries.push(doors.length);
        if (targetYear === null && monthlyIncome >= targetIncome) targetYear = m / 12;
      }
    }

    return { doorYears, incomeSeries, equitySeries, doorSeries, refiCount, targetYear, finalDoors: doorSeries[doorSeries.length - 1] };
  }, [startingCash, savingsPerMonth, doorPrice, downPct, ratePct, rentYieldPct, opexPct, appreciationPct, recycle, targetIncome]);

  const tenDoorYear = sim.doorYears.length >= 10 ? sim.doorYears[9] : null;
  const endIncome = sim.incomeSeries[sim.incomeSeries.length - 1];

  const verdict =
    sim.targetYear !== null
      ? `${money(targetIncome)}/month arrives in year ${Math.ceil(sim.targetYear)}. The machine: ${sim.finalDoors} doors by year 20, door #2 in year ${sim.doorYears[1] ? Math.ceil(sim.doorYears[1]) : "—"}, and ${sim.refiCount > 0 ? `${sim.refiCount} rule-safe refinances doing the heavy lifting — recycled equity buys doors that savings alone never could` : "no refinances — every door was bought with saved cash and cashflow"}. Notice the shape: the first three doors are the slowest by far. That's the phase most people quit in.`
      : `On these assumptions, ${money(targetIncome)}/month doesn't arrive inside twenty years — the portfolio tops out around ${money(endIncome)}/month from ${sim.finalDoors} door${sim.finalDoors === 1 ? "" : "s"}. The levers that actually move this: ${recycle ? "" : "turn on equity recycling, "}buy at a better rent yield, or push savings while the snowball is small. Appreciation barely moves the income line — it moves the equity line.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="A real month-by-month simulation, not a formula: cashflow and savings pool into the next down payment (25% + 3% closing), values appreciate monthly, and recycling refis any 18-month-seasoned door back to 75% LTV — but only when the door still cashflows at 80% occupancy after the new loan.">
          <SliderInput label="Starting cash" value={startingCash} min={10000} max={300000} step={5000} display={money(startingCash)} onChange={setStartingCash} />
          <SliderInput label="Savings per month" value={savingsPerMonth} min={0} max={8000} step={100} display={money(savingsPerMonth)} onChange={setSavingsPerMonth} />
          <SliderInput label="Door price (today)" value={doorPrice} min={100000} max={800000} step={10000} display={money(doorPrice)} onChange={setDoorPrice} />
          <SliderInput label="Down payment" value={downPct} min={15} max={35} step={1} display={downPct + "%"} onChange={setDownPct} />
          <SliderInput label="Mortgage rate" value={ratePct} min={4} max={9} step={0.25} display={ratePct.toFixed(2) + "%"} onChange={setRatePct} />
          <SliderInput label="Monthly rent (% of price)" value={rentYieldPct} min={0.5} max={1.3} step={0.05} display={rentYieldPct.toFixed(2) + "% · " + money(doorPrice * rentYieldPct / 100)} onChange={setRentYieldPct} />
          <SliderInput label="Operating costs (% of rent)" value={opexPct} min={25} max={55} step={1} display={opexPct + "%"} onChange={setOpexPct} />
          <SliderInput label="Appreciation" value={appreciationPct} min={0} max={7} step={0.5} display={appreciationPct.toFixed(1) + "%/yr"} onChange={setAppreciationPct} />
          <SliderInput label="Target monthly income" value={targetIncome} min={2000} max={25000} step={500} display={money(targetIncome)} onChange={setTargetIncome} />
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm text-neutral-400">Recycle equity with rule-safe cash-out refis</span>
            <input
              type="checkbox"
              checked={recycle}
              onChange={(e) => setRecycle(e.target.checked)}
              aria-label="Recycle equity with cash-out refinances"
            />
          </label>
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveLines
            title="Net worth and monthly income, twenty years"
            series={[
              { name: "Equity + cash", values: sim.equitySeries },
              { name: "Income /mo", values: sim.incomeSeries },
            ]}
            note="Two different curves on one chart: equity is the wealth line, income is the freedom line. They cross their milestones years apart — that gap is the whole discipline of holding."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile
              label="Target income year"
              value={sim.targetYear !== null ? "Year " + Math.ceil(sim.targetYear) : "> 20 yrs"}
              note={`When the portfolio first pays ${money(targetIncome)}/month`}
              grade={sim.targetYear !== null ? (sim.targetYear <= 12 ? "good" : "ok") : "bad"}
            />
            <MetricTile
              label="Doors by year 20"
              value={String(sim.finalDoors)}
              note={tenDoorYear !== null ? `Door #10 lands in year ${Math.ceil(tenDoorYear)}` : "Door #10 doesn't land in twenty years"}
              grade={sim.finalDoors >= 10 ? "good" : sim.finalDoors >= 4 ? "ok" : "bad"}
            />
            <MetricTile
              label="Refis fired"
              value={String(sim.refiCount)}
              note={recycle ? "Each one rule-safe: post-refi DSCR positive at 80% occupancy" : "Recycling off — savings-only pace"}
              grade="neutral"
            />
          </div>
          <VerdictPanel
            verdict={verdict}
            subMetrics={[
              { label: "Door #2", value: sim.doorYears[1] ? "yr " + Math.ceil(sim.doorYears[1]) : "—" },
              { label: "Door #5", value: sim.doorYears[4] ? "yr " + Math.ceil(sim.doorYears[4]) : "—" },
              { label: "Income at yr 20", value: money(endIncome) + "/mo" },
              { label: "Net worth at yr 20", value: moneyShort(sim.equitySeries[sim.equitySeries.length - 1]) },
            ]}
          />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/how-to-scale-from-1-to-10-rental-properties", label: "Scaling 1 to 10, the playbook" },
          { href: "/articles/how-many-rental-properties-do-you-need-to-retire", label: "How many doors is enough" },
          { href: "/articles/cash-out-refi-as-an-engine-not-an-exit", label: "The refinance rule this sim obeys" },
          { href: "/articles/the-discipline-of-holding", label: "The discipline of holding" },
        ]}
      />
    </div>
  );
}
