import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";
import { CONTENT_TYPES } from "@/lib/taxonomy";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="flex cursor-pointer flex-col gap-2.5 rounded-md bg-surface p-[22px] text-inherit no-underline shadow-edge transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-edge-accent"
    >
      <span className="flex items-center gap-2">
        <span className="rounded-sm bg-accent-900 px-[7px] py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-accent-300">
          {CONTENT_TYPES[article.type].name}
        </span>
        <span className="font-mono text-[11px] text-neutral-600">
          Y{article.year} · {article.mins} min
        </span>
      </span>
      <span className="text-[19px] font-medium leading-[1.22] tracking-[-0.015em] [text-wrap:pretty]">
        {article.title}
      </span>
      {article.dek ? (
        <span className="text-[13px] leading-[1.45] text-neutral-500 [text-wrap:pretty]">
          {article.dek}
        </span>
      ) : null}
    </Link>
  );
}
