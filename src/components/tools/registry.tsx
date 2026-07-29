import type { ComponentType } from "react";
import { BrrrrCalculator } from "@/components/tools/brrrr-calculator";
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
};
