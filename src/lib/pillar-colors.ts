import type { PillarSlug } from "@/lib/pillars";
import { stageForYear } from "@/lib/horizon";

/**
 * The pillar spectrum — class maps and raw hexes for the hue each pillar
 * owns (tokens in globals.css @theme). Full literal class names so the
 * Tailwind scanner can see them.
 *
 * Usage discipline is Nocturne's: the hue is a line, a glow, a tint —
 * never a flood.
 */

export type PillarColor = {
  /** bright text on dark grounds — kickers, links */
  text: string;
  /** small badge: dark tint ground + bright text */
  badge: string;
  /** the 4px identity dot */
  dot: string;
  /** hover ring + bloom for cards */
  glow: string;
  /** active nav underline */
  border: string;
  /** radial wash class for hub headers */
  wash: string;
  /** raw hexes for SVG / inline style work */
  hex: { base: string; deep: string; bright: string };
};

export const PILLAR_COLORS: Record<PillarSlug, PillarColor> = {
  mindset: {
    text: "text-mindset-300",
    badge: "bg-mindset-900 text-mindset-300",
    dot: "bg-mindset",
    glow: "hover:shadow-glow-mindset",
    border: "border-mindset",
    wash: "wash-mindset",
    hex: { base: "#9184d9", deep: "#5d5294", bright: "#d2cefd" },
  },
  capital: {
    text: "text-capital-300",
    badge: "bg-capital-900 text-capital-300",
    dot: "bg-capital",
    glow: "hover:shadow-glow-capital",
    border: "border-capital",
    wash: "wash-capital",
    hex: { base: "#d9a25f", deep: "#96683a", bright: "#ecc394" },
  },
  cashflow: {
    text: "text-cashflow-300",
    badge: "bg-cashflow-900 text-cashflow-300",
    dot: "bg-cashflow",
    glow: "hover:shadow-glow-cashflow",
    border: "border-cashflow",
    wash: "wash-cashflow",
    hex: { base: "#4fc99a", deep: "#2e7f62", bright: "#93dfc0" },
  },
  wealth: {
    text: "text-wealth-300",
    badge: "bg-wealth-900 text-wealth-300",
    dot: "bg-wealth",
    glow: "hover:shadow-glow-wealth",
    border: "border-wealth",
    wash: "wash-wealth",
    hex: { base: "#d4c078", deep: "#8f8050", bright: "#e6d9a3" },
  },
};

/** The pillar that carries a given horizon year (the stage's lead focus). */
export function pillarForYear(year: number): PillarSlug {
  return stageForYear(year).focus[0];
}

/** Chart series drawn from the spectrum — one language, site-wide. */
export const SPECTRUM_SERIES = ["#9184d9", "#4fc99a", "#d9a25f", "#d4c078"];
