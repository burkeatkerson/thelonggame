import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { clampYear, stageForYear, type StageSlug, type Track } from "@/lib/horizon";
import { isContentType, type ContentType } from "@/lib/taxonomy";

export const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

/**
 * Article metadata — everything the listing pages, search index and rails
 * need without compiling the MDX. Serializable, so it can be handed to
 * client components whole (500 articles of metadata is still small).
 */
export type ArticleMeta = {
  slug: string;
  title: string;
  /** the dek — one sentence under the title */
  dek: string;
  /** where on the twenty-year horizon this piece is filed (1–20) */
  year: number;
  stage: StageSlug;
  stageName: string;
  track: Track;
  type: ContentType;
  author?: string;
  tags: string[];
  draft: boolean;
  /** publication date — recorded, never used for ordering */
  date?: string;
  mins: number;
};

function readArticleFile(slug: string): ArticleMeta {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);

  if (!data.title || data.year === undefined) {
    throw new Error(`Article "${slug}" is missing required frontmatter: "title" and "year".`);
  }
  const type = String(data.type ?? "deep-dive");
  if (!isContentType(type)) {
    throw new Error(`Article "${slug}" has unknown type "${type}".`);
  }

  const year = clampYear(Number(data.year));
  const stage = stageForYear(year);

  return {
    slug,
    title: String(data.title),
    dek: String(data.dek ?? data.description ?? ""),
    year,
    stage: stage.slug,
    stageName: stage.name,
    track: stage.track,
    type,
    author: data.author ? String(data.author) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    date: data.date ? new Date(data.date).toISOString() : undefined,
    mins: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getArticle(slug: string): ArticleMeta | null {
  if (!getArticleSlugs().includes(slug)) return null;
  return readArticleFile(slug);
}

/** Published articles ordered by horizon year, never by date. */
export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map(readArticleFile)
    .filter((article) => !article.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

export function getArticlesForStage(stage: StageSlug): ArticleMeta[] {
  return getAllArticles().filter((a) => a.stage === stage);
}

/** Pieces filed within ±1 year of the given horizon year. */
export function getArticlesNearYear(year: number): ArticleMeta[] {
  return getAllArticles().filter((a) => Math.abs(a.year - year) <= 1);
}

/** The next pieces on the roadmap after a given year. */
export function getNextOnRoadmap(afterYear: number, limit = 3): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => a.year > afterYear)
    .slice(0, limit);
}
