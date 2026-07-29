import { HomeClient } from "@/components/home/home-client";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  return <HomeClient articles={getAllArticles()} />;
}
