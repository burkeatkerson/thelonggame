import type { Metadata } from "next";
import { HomeClient } from "@/components/home/home-client";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeClient articles={getAllArticles()} />;
}
