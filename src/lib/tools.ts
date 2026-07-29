import type { StageSlug } from "@/lib/horizon";

/**
 * Tool registry. Each tool is a page under src/app/tools/<slug>/ with its
 * interactive component in src/components/tools/. Register it here and it
 * appears in listings, rails and stage pages automatically.
 */
export type Tool = {
  slug: string;
  name: string;
  dek: string;
  kind: "calculator" | "checklist" | "worksheet";
  /** the stages where this tool earns its keep */
  stages: StageSlug[];
  /** filed year, for "run this year through the numbers" callouts */
  year: number;
  ready: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: "deal-analyzer",
    name: "Deal analyzer",
    dek: "Cash-on-cash, cap rate and DSCR — the same three numbers every lender runs, with a verdict on which year of the roadmap the deal belongs to.",
    kind: "calculator",
    stages: ["first-door", "scaling"],
    year: 3,
    ready: true,
  },
  {
    slug: "refinance-timer",
    name: "Refinance timer",
    dek: "When a cash-out refi shortens the distance to Year 20, and when it just extends the runway on Year 7.",
    kind: "calculator",
    stages: ["scaling"],
    year: 7,
    ready: false,
  },
  {
    slug: "house-hack-math",
    name: "House hack math",
    dek: "What living in the deal actually does to your numbers — and your next loan.",
    kind: "calculator",
    stages: ["foundation", "first-door"],
    year: 2,
    ready: false,
  },
  {
    slug: "waterfall-visualizer",
    name: "Waterfall visualizer",
    dek: "Preferred return, catch-up, promote — with the money actually moving.",
    kind: "calculator",
    stages: ["syndication"],
    year: 12,
    ready: false,
  },
  {
    slug: "1031-chain-planner",
    name: "1031 chain planner",
    dek: "Deadlines, boot, and basis tracked across a chain of exchanges toward the step-up.",
    kind: "worksheet",
    stages: ["commercial", "legacy"],
    year: 17,
    ready: false,
  },
];

export function getReadyTools(): Tool[] {
  return TOOLS.filter((t) => t.ready);
}

export function getToolsForStage(stage: StageSlug): Tool[] {
  return TOOLS.filter((t) => t.stages.includes(stage));
}
