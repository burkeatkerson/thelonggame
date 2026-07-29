import type { PillarSlug } from "@/lib/pillars";

/**
 * The horizon — the sequencing layer. The four pillars (src/lib/pillars.ts)
 * say WHAT the strategies are; the twenty-year roadmap says WHEN each one
 * carries the plan. Six stages cover the twenty years, and each stage
 * declares which pillars it leans on.
 */

export const HORIZON_YEARS = 20;

export type StageSlug =
  | "foundation"
  | "first-door"
  | "scaling"
  | "syndication"
  | "commercial"
  | "legacy";

export type Stage = {
  slug: StageSlug;
  name: string;
  /** short label used in tight rows */
  short: string;
  years: { from: number; to: number };
  range: string;
  /** the pillars this stage leans on, in order of emphasis */
  focus: PillarSlug[];
  blurb: string;
  /** clear these before moving on — the stage's gate */
  milestones: string[];
};

export const STAGES: Stage[] = [
  {
    slug: "foundation",
    name: "Foundation",
    short: "Foundation",
    years: { from: 1, to: 2 },
    range: "Y1–2",
    focus: ["mindset", "capital"],
    blurb:
      "No property yet — and that is the work. You are building the two things that compound before capital does: underwriting instinct, and a lender who takes your call.",
    milestones: [
      "Price ten deals you will never buy",
      "Twelve months of clean bank statements",
      "Write your twenty-year thesis on one page",
    ],
  },
  {
    slug: "first-door",
    name: "The first door",
    short: "First door",
    years: { from: 3, to: 5 },
    range: "Y3–5",
    focus: ["capital", "cashflow"],
    blurb:
      "One property, held long enough to teach you what a spreadsheet cannot. The goal is not returns. It is survivable mistakes.",
    milestones: [
      "Close a house hack or a boring rental",
      "Keep six months of debt service in reserve",
      "Track real expenses, not projected ones",
    ],
  },
  {
    slug: "scaling",
    name: "Scaling the base",
    short: "Scaling",
    years: { from: 6, to: 10 },
    range: "Y6–10",
    focus: ["cashflow", "capital"],
    blurb:
      "The years that decide whether this is a business or a hobby with a mortgage. Systems, not heroics: one market, one manager, a financing rhythm.",
    milestones: [
      "Reach ten doors inside one submarket",
      "Put a refinance cadence on the calendar",
      "Hold your operator to written numbers",
    ],
  },
  {
    slug: "syndication",
    name: "Other people's money",
    short: "Syndication",
    years: { from: 11, to: 15 },
    range: "Y11–15",
    focus: ["wealth", "cashflow"],
    blurb:
      "You stop buying and start sponsoring. Reputation becomes the asset and the tax code becomes a design tool instead of a bill.",
    milestones: [
      "Run one syndication end to end",
      "Build a depreciation and cost-seg calendar",
      "Publish investor reporting on time, twice",
    ],
  },
  {
    slug: "commercial",
    name: "Commercial and boring",
    short: "Commercial",
    years: { from: 16, to: 18 },
    range: "Y16–18",
    focus: ["wealth"],
    blurb:
      "Longer leases, fewer decisions. If this stage feels busy, you bought the wrong asset.",
    milestones: [
      "Trade doors for term via 1031",
      "Underwrite a NNN asset on one page",
      "Remove yourself from daily operations",
    ],
  },
  {
    slug: "legacy",
    name: "The legacy years",
    short: "Legacy",
    years: { from: 19, to: 20 },
    range: "Y19–20",
    focus: ["wealth", "mindset"],
    blurb:
      "The point of the whole sequence: assets that transfer with a step-up in basis, and heirs who understand what they are holding.",
    milestones: [
      "Structure the entity for transfer",
      "Walk your heirs through the plan",
      "Decide what never gets sold",
    ],
  },
];

export function stageForYear(year: number): Stage {
  return STAGES.find((s) => year <= s.years.to) ?? STAGES[STAGES.length - 1];
}

export function stageBySlug(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slug === slug);
}

export function clampYear(year: number): number {
  return Math.min(HORIZON_YEARS, Math.max(1, Math.round(year)));
}
