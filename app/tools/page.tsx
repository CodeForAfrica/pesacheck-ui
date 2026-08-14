import type { Metadata } from "next";
import { ToolsHero } from "@/components/tools/ToolsHero";
import { ToolsShowcase } from "@/components/tools/ToolsShowcase";

export const metadata: Metadata = {
  title: "Tools — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export default function ToolsPage() {
  return (
    <>
      <ToolsHero />
      <ToolsShowcase />
    </>
  );
}
