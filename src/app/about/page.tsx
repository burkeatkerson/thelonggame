import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>About</h1>
      <p>Replace this with the story behind {siteConfig.name}.</p>
    </div>
  );
}
