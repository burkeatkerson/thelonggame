import type { Metadata } from "next";
import { Suspense } from "react";
import { LibraryClient } from "@/components/library/library-client";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/library" },
  title: "Library",
  description:
    "The whole archive, filed against the twenty-year clock. Nothing here is sorted by date, because nothing here expires.",
};

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryClient articles={getAllArticles()} />
    </Suspense>
  );
}
