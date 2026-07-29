import Link from "next/link";

/** The deep-indigo callout band that points at a calculator. */
export function ToolCallout({
  title,
  dek,
  href,
  cta = "Open the numbers →",
}: {
  title: string;
  dek: string;
  href: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="flex cursor-pointer items-center justify-between gap-6 rounded-md bg-section px-[26px] py-[22px] text-inherit no-underline transition-colors duration-150 hover:bg-section-hover"
    >
      <span className="flex flex-col gap-1">
        <span className="text-[21px] font-medium tracking-[-0.015em]">{title}</span>
        <span className="text-sm text-accent-300">{dek}</span>
      </span>
      <span className="whitespace-nowrap rounded-sm border border-accent-400 px-[18px] py-2.5 text-sm text-accent-100">
        {cta}
      </span>
    </Link>
  );
}
