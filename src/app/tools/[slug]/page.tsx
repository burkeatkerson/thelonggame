import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOL_COMPONENTS } from "@/components/tools/registry";
import { pillarBySlug } from "@/lib/pillars";
import { getReadyTools, getTool } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getReadyTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.dek,
    alternates: { canonical: `/tools/${slug}` },
  };
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Component = TOOL_COMPONENTS[slug];
  if (!tool || !tool.ready || !Component) notFound();

  const pillar = pillarBySlug(tool.pillar);

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.dek,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <div className="flex flex-col gap-7 px-6 pb-20 pt-[52px] md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <div className="flex flex-col gap-3">
        <div className="kicker-accent">
          The numbers · {tool.name} · {pillar?.short}
        </div>
        <h1 className="m-0 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl">
          {tool.headline}
        </h1>
        <p className="m-0 max-w-[620px] text-neutral-400 [text-wrap:pretty]">{tool.intro}</p>
      </div>
      <Component />
    </div>
  );
}
