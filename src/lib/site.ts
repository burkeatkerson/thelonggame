export const siteConfig = {
  name: "The Long Game",
  description:
    "Real estate, filed against a twenty-year plan. Cashflow strategies to build capital, wealth strategies to make it generational — read what's actually next, not what's loudest.",
  tagline: "Everyone else is playing this quarter.",
  // Set NEXT_PUBLIC_SITE_URL in the hosting environment once the domain is live.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
