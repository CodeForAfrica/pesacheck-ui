import type { Metadata } from "next";
import { KnowledgeHero } from "@/components/knowledge/KnowledgeHero";
import { KnowledgeBody } from "@/components/knowledge/KnowledgeBody";

export const metadata: Metadata = {
  title: "Knowledge — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export default function KnowledgePage() {
  return (
    <>
      <KnowledgeHero />
      <KnowledgeBody />
    </>
  );
}
