export const siteConfig = {
  name: "The Long Game",
  description: "Essays and articles on playing the long game.",
  // Set NEXT_PUBLIC_SITE_URL in the hosting environment once the domain is live.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
