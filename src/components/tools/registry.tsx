import type { ComponentType } from "react";
import { AssumptionArbitrage } from "@/components/tools/assumption-arbitrage";
import { BrrrrCalculator } from "@/components/tools/brrrr-calculator";
import { CostSegPlanner } from "@/components/tools/cost-seg-planner";
import { ExitStrategyComparator } from "@/components/tools/exit-strategy-comparator";
import { NoteYieldCalculator } from "@/components/tools/note-yield-calculator";
import { VelocitySimulator } from "@/components/tools/velocity-simulator";
import { DealAnalyzer } from "@/components/tools/deal-analyzer";
import { ExchangeCalculator } from "@/components/tools/exchange-calculator";
import { FlipCalculator } from "@/components/tools/flip-calculator";
import { HouseHackCalculator } from "@/components/tools/house-hack-calculator";
import { LongGameCalculator } from "@/components/tools/long-game-calculator";
import { RefinanceTimer } from "@/components/tools/refinance-timer";
import { WaterfallVisualizer } from "@/components/tools/waterfall-visualizer";

/** slug → interactive component, matching src/lib/tools.ts. */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "long-game-calculator": LongGameCalculator,
  "deal-analyzer": DealAnalyzer,
  "flip-calculator": FlipCalculator,
  "brrrr-calculator": BrrrrCalculator,
  "house-hack-calculator": HouseHackCalculator,
  "refinance-timer": RefinanceTimer,
  "waterfall-visualizer": WaterfallVisualizer,
  "1031-exchange-calculator": ExchangeCalculator,
  "assumption-arbitrage": AssumptionArbitrage,
  "cost-seg-planner": CostSegPlanner,
  "note-yield-calculator": NoteYieldCalculator,
  "exit-strategy-comparator": ExitStrategyComparator,
  "velocity-simulator": VelocitySimulator,
};
