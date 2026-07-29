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
import { monthlyPayment, principalPaid } from "@/lib/finance";

/**
 * The Long Game calculator — the site's thesis as a tool. One pile of
 * starting capital, compared across 20 years: index fund vs. buy-and-hold
 * leveraged real estate (with a simple reinvest cadence).
 */
export function LongGameCalculator() {
  const [capital, setCapital] = useState(60000);
  const [appreciation, setAppreciation] = useState(3.5);
  const [stockReturn, setStockReturn] = useState(10);
  const [rate, setRate] = useState(6.5);
  const [yieldPct, setYieldPct] = useState(6.5); // rent NOI as % of price
  const [years, setYears] = useState(20);

  // ── stocks: straight compound
  const stocks = [capital];
  for (let y = 1; y <= years; y++) stocks.push(stocks[y - 1] * (1 + stockReturn / 100));

  // ── real estate: 25% down on one property; cashflow accumulates;
  //    every time accumulated cash reaches 25% of a same-size property,
  //    buy another (the reinvest cadence, simplified).
  const downPct = 25;
  const firstPrice = capital / (downPct / 100 + 0.03); // down + closing consumes the pile
  type Prop = { price: number; loan: number; ageMonths: number };
  let props: Prop[] = [{ price: firstPrice, loan: firstPrice * (1 - downPct / 100), ageMonths: 0 }];
  let cash = 0;
  const re = [capital];
  let doors = 1;

  for (let y = 1; y <= years; y++) {
    props = props.map((p) => ({ ...p, ageMonths: p.ageMonths + 12, price: p.price * (1 + appreciation / 100) }));
    for (const p of props) {
      const noi = p.price * (yieldPct / 100);
      const debt = monthlyPayment(p.loan, rate) * 12;
      cash += Math.max(0, noi - debt) * 0.9; // 10% friction
    }
    const nextPrice = firstPrice * Math.pow(1 + appreciation / 100, y);
    const needed = nextPrice * (downPct / 100 + 0.03);
    if (cash >= needed && y < years) {
      cash -= needed;
      props.push({ price: nextPrice, loan: nextPrice * (1 - downPct / 100), ageMonths: 0 });
      doors += 1;
    }
    const equity = props.reduce(
      (sum, p) => sum + p.price - (p.loan - principalPaid(p.loan, rate, p.ageMonths)),
      0,
    );
    re.push(equity + cash);
  }

  const reFinal = re[re.length - 1];
  const stockFinal = stocks[stocks.length - 1];
  const multiple = reFinal / capital;
  const edge = reFinal / stockFinal;

  const verdict =
    edge >= 1.5
      ? `Leverage, rent and time turn the same pile into ${edge.toFixed(1)}x the index-fund outcome. This is the argument the whole roadmap is built on — and it assumed nothing heroic: ${appreciation}% appreciation and ordinary rentals, held.`
      : edge >= 1
        ? `Real estate edges out the index fund at these assumptions — the margin is leverage and loan paydown doing quiet work. Push appreciation or yield to your actual market and watch the gap move.`
        : `At these assumptions the index fund wins — usually a sign the yield or appreciation inputs are below what a real acquisition would clear, or rates are eating the spread. That's worth knowing before you buy anything.`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <InputPanel footnote="Model: 25% down + 3% closing per property; NOI = yield × value; cashflow accumulates (10% friction) and buys another same-size property whenever it covers a down payment. Simplified on purpose — the shape is the lesson.">
          <SliderInput label="Starting capital" value={capital} min={20000} max={300000} step={5000} display={money(capital)} onChange={setCapital} />
          <SliderInput label="Property appreciation" value={appreciation} min={0} max={7} step={0.25} display={appreciation.toFixed(2) + "%/yr"} onChange={setAppreciation} />
          <SliderInput label="Rental yield (NOI ÷ value)" value={yieldPct} min={4} max={10} step={0.25} display={yieldPct.toFixed(2) + "%"} onChange={setYieldPct} />
          <SliderInput label="Mortgage rate" value={rate} min={3} max={10} step={0.25} display={rate.toFixed(2) + "%"} onChange={setRate} />
          <SliderInput label="Stock market return" value={stockReturn} min={4} max={13} step={0.5} display={stockReturn.toFixed(1) + "%/yr"} onChange={setStockReturn} />
          <SliderInput label="Horizon" value={years} min={5} max={30} step={1} display={years + " years"} onChange={setYears} />
        </InputPanel>

        <div className="flex flex-col gap-4">
          <LiveLines
            title={`The same ${moneyShort(capital)} — two roads, ${years} years`}
            series={[
              { name: "Real estate (equity + cash)", values: re },
              { name: "Index fund", values: stocks },
            ]}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile label="Real estate outcome" value={moneyShort(reFinal)} note={`${doors} propert${doors === 1 ? "y" : "ies"} accumulated, ${multiple.toFixed(1)}x your capital`} grade={edge >= 1 ? "good" : "ok"} />
            <MetricTile label="Index fund outcome" value={moneyShort(stockFinal)} note={`${stockReturn}% compounded, no effort, full liquidity`} grade="neutral" />
            <MetricTile label="The edge" value={edge.toFixed(2) + "x"} note="Real estate ÷ stocks, same capital, same years" grade={edge >= 1.25 ? "good" : edge >= 1 ? "ok" : "bad"} />
          </div>
          <VerdictPanel verdict={verdict} />
        </div>
      </div>
      <LearnMore
        links={[
          { href: "/articles/real-estate-vs-stocks", label: "The honest RE vs. stocks comparison" },
          { href: "/articles/the-twenty-year-math-nobody-shows-you", label: "The twenty-year math" },
          { href: "/articles/how-does-real-estate-make-money", label: "The five profit centers" },
        ]}
      />
    </div>
  );
}
