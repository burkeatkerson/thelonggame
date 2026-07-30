import { siteConfig } from "@/lib/site";

/**
 * Single source of truth for authorship. Articles without an explicit
 * `author` frontmatter field are attributed to the default author, so the
 * byline, Article JSON-LD, OpenGraph and feed stay consistent everywhere.
 */
export const DEFAULT_AUTHOR = {
  name: "Burke Atkerson",
  slug: "burke-atkerson",
  title: "Author of The Long Game",
  bio: "Real estate investor and author of The Long Game: the 20-year roadmap to building wealth through scalable real estate investing strategies. Burke writes the way he invests — four pillars, in the order they fund each other, on a twenty-year clock.",
} as const;

export function authorUrl(): string {
  return `${siteConfig.url}/author/${DEFAULT_AUTHOR.slug}`;
}

export function authorPath(): string {
  return `/author/${DEFAULT_AUTHOR.slug}`;
}
