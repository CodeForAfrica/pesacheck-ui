import type { Metadata } from "next";
import { AboutPageBody } from "@/components/about/AboutPageBody";
import { PrinciplesHero } from "@/components/about/PrinciplesHero";
import { PRINCIPLES_SECTIONS } from "@/lib/principles-content";

export const metadata: Metadata = {
  title: "Principles — PesaCheck",
  description:
    "The principles that guide PesaCheck, Africa's largest indigenous fact-checking organisation, in debunking misleading claims and providing accurate information for sound decision-making.",
};

export default function PrinciplesPage() {
  return (
    <>
      <PrinciplesHero />
      <AboutPageBody navLabel="Principles" sections={PRINCIPLES_SECTIONS} />
    </>
  );
}
