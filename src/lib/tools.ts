import type { StageSlug } from "@/lib/horizon";
import type { PillarSlug } from "@/lib/pillars";

/**
 * Tool registry. Each tool's interactive component lives in
 * src/components/tools/ and is mapped to its slug in
 * src/app/tools/[slug]/page.tsx. Register a tool here and it appears on
 * /tools, its pillar hub, and the MDX embed registry automatically.
 */
export type Tool = {
  slug: string;
  name: string;
  dek: string;
  /** the H1 on the tool's page */
  headline: string;
  /** the standfirst under the H1 */
  intro: string;
  kind: "calculator" | "checklist" | "worksheet";
  /** the pillar whose strategies this tool serves */
  pillar: PillarSlug;
  /** the stages where this tool earns its keep */
  stages: StageSlug[];
  /** filed year, for "run this year through the numbers" callouts */
  year: number;
  ready: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: "long-game-calculator",
    name: "The Long Game calculator",
    dek: "One pile of capital, twenty years, two roads — leveraged real estate vs. the index fund. The site's thesis with sliders on it.",
    headline: "Twenty years is the only edge nobody is competing for.",
    intro: "Take one pile of starting capital down both roads and watch what leverage, rent and time actually do. Change the assumptions until you believe them — the shape survives.",
    kind: "calculator",
    pillar: "mindset",
    stages: ["foundation", "first-door"],
    year: 1,
    ready: true,
  },
  {
    slug: "deal-analyzer",
    name: "Deal analyzer",
    dek: "Cash-on-cash, cap rate and DSCR — the same three numbers every lender runs, with a verdict on which year of the roadmap the deal belongs to.",
    headline: "Same three numbers every lender runs.",
    intro: "Change one input and watch which year of the roadmap this deal actually belongs to.",
    kind: "calculator",
    pillar: "cashflow",
    stages: ["first-door", "scaling"],
    year: 3,
    ready: true,
  },
  {
    slug: "flip-calculator",
    name: "Flip calculator (70% rule)",
    dek: "Maximum allowable offer and the full profit waterfall — where the 30% actually goes, and what's left when it does.",
    headline: "The profit is made at the purchase.",
    intro: "The 70% rule sets your ceiling; the waterfall shows what survives financing, holding and selling costs. Move your offer and watch the margin breathe.",
    kind: "calculator",
    pillar: "capital",
    stages: ["first-door", "scaling"],
    year: 3,
    ready: true,
  },
  {
    slug: "brrrr-calculator",
    name: "BRRRR calculator",
    dek: "All-in vs. ARV, cash returned at the refinance, cash stranded, and the post-refi DSCR — the whole method on one screen.",
    headline: "The refinance is the exam.",
    intro: "Buy, rehab, rent, refinance — then see how much of your pile comes back, how much equity you created, and whether the property survives the new loan.",
    kind: "calculator",
    pillar: "capital",
    stages: ["first-door", "scaling"],
    year: 4,
    ready: true,
  },
  {
    slug: "house-hack-calculator",
    name: "House hack calculator",
    dek: "Your real monthly housing cost with tenants paying the mortgage — plus the FHA self-sufficiency test that decides what you can buy.",
    headline: "What does living in the deal actually cost?",
    intro: "Units, rents, down payment — out comes your true monthly housing cost versus renting, and whether FHA's self-sufficiency test will even let you buy it.",
    kind: "calculator",
    pillar: "cashflow",
    stages: ["foundation", "first-door"],
    year: 2,
    ready: true,
  },
  {
    slug: "refinance-timer",
    name: "Refinance timer",
    dek: "When a cash-out refi shortens the distance to Year 20 — and when it just extends the runway on Year 7. The rule, with sliders.",
    headline: "Refinance on a schedule, not on optimism.",
    intro: "The rule: the post-refi loan must clear 1.30 DSCR at 80% occupancy. This tool applies it to your property and tells you the largest cash-out that stays rule-safe.",
    kind: "calculator",
    pillar: "capital",
    stages: ["scaling"],
    year: 7,
    ready: true,
  },
  {
    slug: "waterfall-visualizer",
    name: "Waterfall visualizer",
    dek: "Preferred return, catch-up, promote — with the money actually moving between LPs and the sponsor.",
    headline: "Watch the money actually move.",
    intro: "Equity, pref, split, profit — the waterfall pays in strict order. See what LPs collect, what the sponsor earns, and whether the alignment is real.",
    kind: "calculator",
    pillar: "wealth",
    stages: ["syndication"],
    year: 12,
    ready: true,
  },
  {
    slug: "1031-exchange-calculator",
    name: "1031 exchange calculator",
    dek: "The tax bill you'd pay selling outright, the equity a 1031 keeps working, and what the deferral compounds into.",
    headline: "The tax you don't pay is an asset.",
    intro: "Sale price, basis, depreciation — out comes the bill an outright sale triggers, and the wealth gap the deferral opens over the years that follow.",
    kind: "calculator",
    pillar: "wealth",
    stages: ["commercial", "legacy"],
    year: 14,
    ready: true,
  },
  {
    slug: "assumption-arbitrage",
    name: "Assumption arbitrage calculator",
    dek: "What a seller's 3% assumable loan is actually worth in dollars — NPV of the rate lock, the blended rate after gap financing, and how much above list it justifies.",
    headline: "The financing is part of what you're buying.",
    intro: "An assumable loan at yesterday's rate is an asset with a price. Set the balance, the gap, and your hold — out comes the cash value of the rate lock and the blended cost of the whole stack.",
    kind: "calculator",
    pillar: "capital",
    stages: ["first-door", "scaling"],
    year: 3,
    ready: true,
  },
  {
    slug: "velocity-simulator",
    name: "Portfolio velocity simulator",
    dek: "A month-by-month simulation of 1 to N doors — cashflow snowballing into down payments, rule-safe refis recycling equity, and the year your target income arrives.",
    headline: "How fast can the snowball actually roll?",
    intro: "Not a formula — a simulation. Savings and cashflow pool into the next down payment, seasoned doors refinance under the site's rule, and the clock tells you which year each door lands.",
    kind: "calculator",
    pillar: "cashflow",
    stages: ["first-door", "scaling"],
    year: 5,
    ready: true,
  },
  {
    slug: "note-yield-calculator",
    name: "Note yield calculator",
    dek: "The note buyer's two questions, solved both directions: the yield your price buys, and the price that hits your target yield — with balloons and collateral coverage.",
    headline: "Yield is manufactured at the discount.",
    intro: "The payment stream is fixed the day the note is signed; the only lever left is what you pay for it. Price a performing note to the basis point — and see what the collateral covers if it stops performing.",
    kind: "calculator",
    pillar: "cashflow",
    stages: ["scaling", "syndication"],
    year: 9,
    ready: true,
  },
  {
    slug: "cost-seg-planner",
    name: "Cost segregation planner",
    dek: "The first-year paper loss a cost-seg study creates, the tax it shields at your marginal rate, the study's ROI — and the recapture bill it quietly books for the exit.",
    headline: "A paper loss with a price tag on both ends.",
    intro: "Cost segregation front-loads depreciation; bonus depreciation detonates it. See the year-one deduction, what it's worth at your rate, whether the study pays for itself — and what it books against your exit.",
    kind: "calculator",
    pillar: "wealth",
    stages: ["scaling", "commercial"],
    year: 13,
    ready: true,
  },
  {
    slug: "exit-strategy-comparator",
    name: "Exit strategy comparator",
    dek: "The same sale run three ways — pay the tax, 1031 it, or carry the note — with after-tax wealth curves for the fifteen years that follow the closing.",
    headline: "Every exit is a tax strategy wearing a closing date.",
    intro: "Sell outright, exchange, or install the gain over a decade of payments. Same property, same buyer, three very different lines on the chart — and one of them is usually not close.",
    kind: "calculator",
    pillar: "wealth",
    stages: ["commercial", "legacy"],
    year: 16,
    ready: true,
  },
];

export function getReadyTools(): Tool[] {
  return TOOLS.filter((t) => t.ready);
}

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsForStage(stage: StageSlug): Tool[] {
  return TOOLS.filter((t) => t.stages.includes(stage));
}

export function getToolsForPillar(pillar: PillarSlug): Tool[] {
  return TOOLS.filter((t) => t.pillar === pillar);
}
