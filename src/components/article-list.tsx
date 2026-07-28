import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) {
    return (
      <p className="text-black/60 dark:text-white/60">
        No articles yet. Add an <code>.mdx</code> file to <code>src/content/articles/</code>.
      </p>
    );
  }

  return (
    <ul className="space-y-8">
      {articles.map((article) => (
        <li key={article.slug} className="space-y-1">
          <h3 className="text-xl font-medium tracking-tight">
            <Link href={`/articles/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
            {article.draft ? (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-normal text-amber-900">
                Draft
              </span>
            ) : null}
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingTime}
          </p>
          {article.description ? (
            <p className="text-black/70 dark:text-white/70">{article.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
