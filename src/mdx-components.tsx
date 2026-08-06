import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { AmazonCloser, AmazonHook, BookCta, BookHook } from "@/components/book-promo";
import { BarChart, CompareLines, MoneyFlow, Timeline } from "@/components/mdx/charts";
import { TOOL_COMPONENTS } from "@/components/tools/registry";
import {
  Callout,
  FAQ,
  KeyTakeaways,
  ProcessSteps,
  StatGrid,
  VersusTable,
} from "@/components/mdx/content-blocks";

/**
 * Shared component overrides for every MDX article. Add custom article
 * components (callouts, figures, charts) here to make them available in MDX
 * without importing them file by file.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Visual/AEO blocks — available in every article without imports.
    BarChart,
    CompareLines,
    MoneyFlow,
    Timeline,
    AmazonCloser,
    AmazonHook,
    BookCta,
    BookHook,
    Callout,
    FAQ,
    KeyTakeaways,
    ProcessSteps,
    StatGrid,
    VersusTable,
    // Interactive calculators — embeddable in any article.
    DealAnalyzer: TOOL_COMPONENTS["deal-analyzer"],
    BrrrrCalculator: TOOL_COMPONENTS["brrrr-calculator"],
    FlipCalculator: TOOL_COMPONENTS["flip-calculator"],
    HouseHackCalculator: TOOL_COMPONENTS["house-hack-calculator"],
    RefinanceTimer: TOOL_COMPONENTS["refinance-timer"],
    WaterfallVisualizer: TOOL_COMPONENTS["waterfall-visualizer"],
    ExchangeCalculator: TOOL_COMPONENTS["1031-exchange-calculator"],
    LongGameCalculator: TOOL_COMPONENTS["long-game-calculator"],
    AssumptionArbitrage: TOOL_COMPONENTS["assumption-arbitrage"],
    CostSegPlanner: TOOL_COMPONENTS["cost-seg-planner"],
    NoteYieldCalculator: TOOL_COMPONENTS["note-yield-calculator"],
    ExitStrategyComparator: TOOL_COMPONENTS["exit-strategy-comparator"],
    VelocitySimulator: TOOL_COMPONENTS["velocity-simulator"],
    a: ({ href = "", children, ...props }) => {
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    img: ({ alt = "", ...props }) => (
      <Image
        alt={alt}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as Omit<ImageProps, "alt">)}
      />
    ),
    ...components,
  };
}
