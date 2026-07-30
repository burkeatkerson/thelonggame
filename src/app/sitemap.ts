import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCourses } from "@/lib/courses";
import { getReadyTools } from "@/lib/tools";
import { PILLARS } from "@/lib/pillars";
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

  const pillars = PILLARS.flatMap((p) => [
    { url: `${siteConfig.url}/${p.slug}` },
    ...p.sections.map((s) => ({ url: `${siteConfig.url}/${p.slug}/${s.slug}` })),
  ]);

  return [
    { url: siteConfig.url },
    { url: `${siteConfig.url}/roadmap` },
    ...pillars,
    { url: `${siteConfig.url}/library` },
    { url: `${siteConfig.url}/courses` },
    { url: `${siteConfig.url}/tools` },
    { url: `${siteConfig.url}/glossary` },
    { url: `${siteConfig.url}/start` },
    { url: `${siteConfig.url}/about` },
    { url: `${siteConfig.url}/author/burke-atkerson` },
    ...articles,
    ...courses,
    ...tools,
  ];
}
