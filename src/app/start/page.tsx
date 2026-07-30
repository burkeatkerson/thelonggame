import type { Metadata } from "next";
import { StartClient } from "@/components/start/start-client";

export const metadata: Metadata = {
  alternates: { canonical: "/start" },
  title: "Set your horizon",
  description:
    "Find your year on the twenty-year clock — the site files everything against it.",
};

export default function StartPage() {
  return <StartClient />;
}
