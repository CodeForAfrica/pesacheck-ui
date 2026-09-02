import type { Metadata } from "next";
import { KnowledgeBody } from "@/components/knowledge/KnowledgeBody";
import { KnowledgeHero } from "@/components/knowledge/KnowledgeHero";
import { getPage } from "@/lib/data/pages";

export const metadata: Metadata = {
  title: "Knowledge — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export const revalidate = 300;

/**
 * Knowledge keeps its own layout rather than being served by the catch-all:
 * the hero artwork and the anchor rail are specific to it. Only the copy is
 * live, from the `knowledge` route's section list.
 */
export default async function KnowledgePage() {
  const page = await getPage("knowledge").catch(() => null);

  return (
    <>
      <KnowledgeHero hero={page?.hero} />
      <KnowledgeBody
        sections={page?.sections.length ? page.sections : undefined}
      />
    </>
  );
}
