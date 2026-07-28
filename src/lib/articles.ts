import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  tags: string[];
  draft: boolean;
  readingTime: string;
};

function readArticleFile(slug: string): ArticleMeta {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);

  if (!data.title || !data.date) {
    throw new Error(`Article "${slug}" is missing a required "title" or "date" in its frontmatter.`);
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ""),
    // Normalised so sorting and rendering never depend on the YAML parser's date handling.
    date: new Date(data.date).toISOString(),
    author: data.author ? String(data.author) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingTime: readingTime(content).text,
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

/** Published articles, newest first. Drafts are hidden outside development. */
export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map(readArticleFile)
    .filter((article) => !article.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllTags(): string[] {
  const tags = new Set(getAllArticles().flatMap((article) => article.tags));
  return [...tags].sort();
}
