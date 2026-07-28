import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate } from "@/lib/format";
import { getAllArticles, getArticle } from "@/lib/articles";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllArticles().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // The literal path prefix lets the bundler statically resolve every article.
  const { default: Content } = await import(`../../../content/articles/${slug}.mdx`);

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">{article.title}</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingTime}
          {article.author ? ` · ${article.author}` : ""}
        </p>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <Content />
      </div>

      {article.tags.length > 0 ? (
        <footer className="flex flex-wrap gap-2 border-t border-black/10 pt-6 text-sm dark:border-white/10">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
        </footer>
      ) : null}
    </article>
  );
}
