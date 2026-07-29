import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCourses } from "@/lib/courses";
import { getReadyTools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((a) => ({
    url: `${siteConfig.url}/articles/${a.slug}`,
  }));
  const courses = getAllCourses().flatMap((c) => [
    { url: `${siteConfig.url}/courses/${c.slug}` },
    ...c.lessons.map((l) => ({ url: `${siteConfig.url}/courses/${c.slug}/${l.slug}` })),
  ]);
  const tools = getReadyTools().map((t) => ({
    url: `${siteConfig.url}/tools/${t.slug}`,
  }));

  return [
    { url: siteConfig.url },
    { url: `${siteConfig.url}/library` },
    { url: `${siteConfig.url}/courses` },
    { url: `${siteConfig.url}/tools` },
    { url: `${siteConfig.url}/glossary` },
    { url: `${siteConfig.url}/start` },
    { url: `${siteConfig.url}/about` },
    ...articles,
    ...courses,
    ...tools,
  ];
}
