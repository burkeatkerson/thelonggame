import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * Shared component overrides for every MDX article. Add custom article
 * components (callouts, figures, charts) here to make them available in MDX
 * without importing them file by file.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", children, ...props }) => {
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    img: ({ alt = "", ...props }) => (
      <Image
        alt={alt}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as Omit<ImageProps, "alt">)}
      />
    ),
    ...components,
  };
}
