import type { Metadata } from "next";
import { ToolsHero } from "@/components/tools/ToolsHero";
import { ToolsShowcase } from "@/components/tools/ToolsShowcase";
import { getPage } from "@/lib/data/pages";

export const metadata: Metadata = {
  title: "Tools — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export const revalidate = 300;

/**
 * Keeps its own file: its body is layout this page owns rather than sections a
 * catch-all could place. Only the hero is live.
 */
export default async function ToolsPage() {
  const page = await getPage("tools").catch(() => null);

  return (
    <>
      <ToolsHero hero={page?.hero} />
      <ToolsShowcase />
    </>
  );
}
