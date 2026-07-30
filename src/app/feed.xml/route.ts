import { getAllArticles } from "@/lib/articles";
import { DEFAULT_AUTHOR } from "@/lib/authors";
import { siteConfig } from "@/lib/site";

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char]!,
  );
}

export function GET() {
  const items = getAllArticles()
    .map((article) => {
      const url = `${siteConfig.url}/articles/${article.slug}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <dc:creator>${escapeXml(article.author ?? DEFAULT_AUTHOR.name)}</dc:creator>
      <description>${escapeXml(article.dek)}</description>
      <pubDate>${new Date(article.date ?? article.updated).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
