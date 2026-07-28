import type { Metadata } from "next";
import { ArticleList } from "@/components/article-list";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description: "Every article published on The Long Game.",
};

export default function ArticlesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Articles</h1>
      <ArticleList articles={getAllArticles()} />
    </div>
  );
}
