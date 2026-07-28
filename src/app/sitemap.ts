import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: article.date,
  }));

  return [
    { url: siteConfig.url },
    { url: `${siteConfig.url}/articles` },
    { url: `${siteConfig.url}/about` },
    ...articles,
  ];
}
