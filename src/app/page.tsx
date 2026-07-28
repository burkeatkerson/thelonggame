import Link from "next/link";
import { ArticleList } from "@/components/article-list";
import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const recent = getAllArticles().slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">{siteConfig.name}</h1>
        <p className="text-lg text-black/70 dark:text-white/70">{siteConfig.description}</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
          Recent articles
        </h2>
        <ArticleList articles={recent} />
        <Link href="/articles" className="inline-block text-sm hover:underline">
          All articles →
        </Link>
      </section>
    </div>
  );
}
