import { getAllArticles } from "@/lib/articles";
import { DEFAULT_AUTHOR } from "@/lib/authors";
import { getAllCourses } from "@/lib/courses";
import { PILLARS } from "@/lib/pillars";
import { siteConfig } from "@/lib/site";
import { getReadyTools } from "@/lib/tools";

/**
 * /llms.txt — the AI-discovery manifest (llmstxt.org). A compact, linked map
 * of the whole site so answer engines can find the right page without
 * crawling blind. Generated from the same libs as the sitemap, so it can
 * never drift from the content.
 */
export function GET() {
  const articles = getAllArticles();
  const courses = getAllCourses();
  const tools = getReadyTools();
  const url = siteConfig.url;

  const pillarSections = PILLARS.map((p) => {
    const list = articles
      .filter((a) => a.pillar === p.slug)
      .map((a) => `- [${a.title}](${url}/articles/${a.slug}): ${a.dek}`)
      .join("\n");
    return `## ${p.name} (${p.tagline.toLowerCase()})\n\n${p.dek}\n\n${list}`;
  }).join("\n\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

The Long Game is a real estate investing education site by ${DEFAULT_AUTHOR.name}, ${DEFAULT_AUTHOR.title}. Content is organized along two axes: four pillars in funding order — Building Mindset, Building Capital, Building Cashflow, Building Wealth — laid over a twenty-year horizon. Every article is filed to the year of the plan where it matters, never by publish date.

Key pages:

- [Start here](${url}/start): which year of the plan you're in and what to read first
- [The roadmap](${url}/roadmap): the whole twenty-year sequence on one page
- [Glossary](${url}/glossary): terms defined the way they behave on a closing statement
- [About](${url}/about) · [Author: ${DEFAULT_AUTHOR.name}](${url}/author/${DEFAULT_AUTHOR.slug}) · [The book](${url}/book)

${pillarSections}

## Courses

${courses.map((c) => `- [${c.title}](${url}/courses/${c.slug}): ${c.dek}`).join("\n")}

## Tools

${tools.map((t) => `- [${t.name}](${url}/tools/${t.slug}): ${t.dek}`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
