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

/** Present value of a level monthly payment stream at an annual discount rate. */
export function presentValueOfPayments(
  monthlyAmount: number,
  annualRatePct: number,
  months: number,
): number {
  const r = annualRatePct / 100 / 12;
  if (r <= 0) return monthlyAmount * months;
  return (monthlyAmount * (1 - Math.pow(1 + r, -months))) / r;
}

export type NotePricingInputs = {
  /** unpaid principal balance */
  upb: number;
  /** note's face interest rate */
  noteRatePct: number;
  /** remaining amortization months */
  remainingMonths: number;
  /** months until balloon (0 = fully amortizing, no balloon) */
  balloonMonths: number;
};

/** Price a note (payments + balloon) at a target annual yield. */
export function notePriceAtYield(n: NotePricingInputs, yieldPct: number): number {
  const pmt = monthlyPayment(n.upb, n.noteRatePct, n.remainingMonths / 12);
  const horizon = n.balloonMonths > 0 ? Math.min(n.balloonMonths, n.remainingMonths) : n.remainingMonths;
  const balloon =
    n.balloonMonths > 0 && n.balloonMonths < n.remainingMonths
      ? remainingBalance(n.upb, n.noteRatePct, n.balloonMonths, n.remainingMonths / 12)
      : 0;
  const r = yieldPct / 100 / 12;
  const pvBalloon = r > 0 ? balloon / Math.pow(1 + r, horizon) : balloon;
  return presentValueOfPayments(pmt, yieldPct, horizon) + pvBalloon;
}

/** Solve the annual yield implied by paying `price` for a note. Bisection. */
export function noteYieldAtPrice(n: NotePricingInputs, price: number): number {
  let lo = 0.01, hi = 60;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (notePriceAtYield(n, mid) > price) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export type CostSegInputs = {
  purchasePrice: number;
  landPct: number;
  /** share of the improvement basis reclassified into 5/7/15-year property */
  reclassPct: number;
  /** bonus depreciation rate in the placed-in-service year */
  bonusPct: number;
  /** 27.5 residential or 39 commercial */
  recoveryYears: number;
  marginalRatePct: number;
};

export type CostSegResult = {
  improvementBasis: number;
  reclassified: number;
  bonusDeduction: number;
  straightLineYear1: number;
  totalYear1: number;
  baselineYear1: number;
  extraDeduction: number;
  taxShield: number;
  futureRecaptureAt25: number;
};

/** First-year depreciation with a cost-seg study + bonus vs. straight-line only. */
export function costSegYearOne(c: CostSegInputs): CostSegResult {
  const improvementBasis = c.purchasePrice * (1 - c.landPct / 100);
  const reclassified = improvementBasis * (c.reclassPct / 100);
  const bonusDeduction = reclassified * (c.bonusPct / 100);
  // Remaining short-life basis depreciates fast anyway; approximate the
  // non-bonused reclass at 20% (5-yr DDB first year) and the long-life
  // remainder straight-line with the half-month-ish first-year haircut ignored.
  const shortLifeFirstYear = (reclassified - bonusDeduction) * 0.2;
  const straightLineYear1 = (improvementBasis - reclassified) / c.recoveryYears;
  const totalYear1 = bonusDeduction + shortLifeFirstYear + straightLineYear1;
  const baselineYear1 = improvementBasis / c.recoveryYears;
  const extraDeduction = Math.max(0, totalYear1 - baselineYear1);
  return {
    improvementBasis,
    reclassified,
    bonusDeduction,
    straightLineYear1,
    totalYear1,
    baselineYear1,
    extraDeduction,
    taxShield: totalYear1 * (c.marginalRatePct / 100),
    futureRecaptureAt25: totalYear1 * 0.25,
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
