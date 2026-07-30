import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide OG card, Nocturne style: dark ground, accent as a hairline,
 * headings at medium weight. Inherited by every route without its own image.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161826",
          color: "#e9e9ed",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontSize: 24,
            color: "#9184d9",
          }}
        >
          <div style={{ width: 34, height: 2, background: "#9184d9", display: "flex" }} />
          Real estate, filed against a twenty-year plan
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 112, fontWeight: 500, letterSpacing: "-0.03em" }}>
            The Long Game
          </div>
          <div style={{ fontSize: 32, color: "#a8a8b6", maxWidth: 900, lineHeight: 1.35 }}>
            Cashflow strategies to build capital, wealth strategies to make it
            generational — read what&apos;s actually next, not what&apos;s loudest.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6f6f80",
          }}
        >
          <div style={{ display: "flex" }}>Mindset → Capital → Cashflow → Wealth</div>
          <div style={{ display: "flex" }}>Years 1–20</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 4,
            background: "linear-gradient(90deg, #9184d9, rgba(145,132,217,0))",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
