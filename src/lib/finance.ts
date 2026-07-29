/**
 * Shared real-estate finance math — one source of truth for every
 * calculator and chart on the site. Pure functions, no side effects.
 */

/** Monthly payment on an amortizing loan. rate = annual %, years = term. */
export function monthlyPayment(principal: number, annualRatePct: number, years = 30): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r <= 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Remaining balance after `months` of payments. */
export function remainingBalance(
  principal: number,
  annualRatePct: number,
  months: number,
  years = 30,
): number {
  const r = annualRatePct / 100 / 12;
  if (r <= 0) return principal * (1 - months / (years * 12));
  const pmt = monthlyPayment(principal, annualRatePct, years);
  return principal * Math.pow(1 + r, months) - (pmt * (Math.pow(1 + r, months) - 1)) / r;
}

/** Principal paid down across a span of months. */
export function principalPaid(
  principal: number,
  annualRatePct: number,
  months: number,
  years = 30,
): number {
  return principal - remainingBalance(principal, annualRatePct, months, years);
}

export type DealInputs = {
  price: number;
  downPct: number;
  ratePct: number;
  monthlyRent: number;
  monthlyOpex: number;
  closingPct?: number;
};

export type DealMetrics = {
  loan: number;
  payment: number;
  noi: number;
  annualDebt: number;
  cashIn: number;
  annualCashflow: number;
  capRatePct: number;
  cashOnCashPct: number;
  dscr: number;
};

/** The three lender numbers plus their inputs, from raw deal terms. */
export function analyzeDeal(d: DealInputs): DealMetrics {
  const closingPct = d.closingPct ?? 3;
  const loan = d.price * (1 - d.downPct / 100);
  const payment = monthlyPayment(loan, d.ratePct);
  const noi = (d.monthlyRent - d.monthlyOpex) * 12;
  const annualDebt = payment * 12;
  const cashIn = d.price * (d.downPct / 100) + d.price * (closingPct / 100);
  const annualCashflow = noi - annualDebt;
  return {
    loan,
    payment,
    noi,
    annualDebt,
    cashIn,
    annualCashflow,
    capRatePct: (noi / d.price) * 100,
    cashOnCashPct: (annualCashflow / cashIn) * 100,
    dscr: annualDebt > 0 ? noi / annualDebt : Infinity,
  };
}

/** 70%-rule maximum allowable offer. */
export function maxAllowableOffer(arv: number, repairs: number, rulePct = 70): number {
  return arv * (rulePct / 100) - repairs;
}

export type WaterfallInputs = {
  lpEquity: number;
  gpEquity: number;
  prefPct: number;
  lpSplitPct: number;
  totalProfit: number;
  holdYears: number;
};

export type WaterfallResult = {
  prefTotal: number;
  splitPool: number;
  lpFromSplit: number;
  gpPromote: number;
  gpAsLp: number;
  lpTotal: number;
  gpTotal: number;
  lpAnnualizedPct: number;
};

/** Simple (non-compounding) pref + single-hurdle split waterfall. */
export function runWaterfall(w: WaterfallInputs): WaterfallResult {
  const totalEquity = w.lpEquity + w.gpEquity;
  const gpShareOfEquity = totalEquity > 0 ? w.gpEquity / totalEquity : 0;

  const prefOnAll = totalEquity * (w.prefPct / 100) * w.holdYears;
  const prefTotal = Math.min(w.totalProfit, prefOnAll);
  const splitPool = Math.max(0, w.totalProfit - prefTotal);
  const lpFromSplit = splitPool * (w.lpSplitPct / 100);
  const gpPromote = splitPool - lpFromSplit;

  // GP's co-invested equity earns the LP-side economics on its share.
  const gpAsLp = prefTotal * gpShareOfEquity + lpFromSplit * gpShareOfEquity;
  const lpTotal = prefTotal + lpFromSplit - gpAsLp;
  const gpTotal = gpPromote + gpAsLp;

  const lpAnnualizedPct =
    w.lpEquity > 0 && w.holdYears > 0 ? (lpTotal / w.lpEquity / w.holdYears) * 100 : 0;

  return { prefTotal, splitPool, lpFromSplit, gpPromote, gpAsLp, lpTotal, gpTotal, lpAnnualizedPct };
}

export type ExchangeTaxInputs = {
  salePrice: number;
  originalBasis: number;
  depreciationTaken: number;
  sellingCostsPct: number;
  federalRatePct: number;
  stateRatePct: number;
};

export type ExchangeTaxResult = {
  netSale: number;
  adjustedBasis: number;
  totalGain: number;
  recaptureTax: number;
  capGainsTax: number;
  totalTax: number;
  equityIfSold: number;
  equityIfExchanged: number;
};

/** Tax due on an outright sale vs. deferred in a 1031. */
export function exchangeTax(x: ExchangeTaxInputs): ExchangeTaxResult {
  const netSale = x.salePrice * (1 - x.sellingCostsPct / 100);
  const adjustedBasis = Math.max(0, x.originalBasis - x.depreciationTaken);
  const totalGain = Math.max(0, netSale - adjustedBasis);
  const recapturePortion = Math.min(x.depreciationTaken, totalGain);
  const appreciationGain = totalGain - recapturePortion;
  const recaptureTax = recapturePortion * ((25 + x.stateRatePct) / 100);
  const capGainsTax = appreciationGain * ((x.federalRatePct + x.stateRatePct) / 100);
  const totalTax = recaptureTax + capGainsTax;
  return {
    netSale,
    adjustedBasis,
    totalGain,
    recaptureTax,
    capGainsTax,
    totalTax,
    equityIfSold: netSale - totalTax,
    equityIfExchanged: netSale,
  };
}

/** Grow a value by rate for `years`, returning the year-by-year series. */
export function growthSeries(start: number, annualRatePct: number, years: number): number[] {
  const out = [start];
  for (let y = 1; y <= years; y++) out.push(out[y - 1] * (1 + annualRatePct / 100));
  return out;
}

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const moneyShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
};
