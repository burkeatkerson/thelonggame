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
