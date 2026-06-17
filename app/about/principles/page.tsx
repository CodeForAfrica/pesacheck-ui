import type { Metadata } from "next";
import { PrinciplesHero } from "@/components/about/PrinciplesHero";
import { PrinciplesBody } from "@/components/about/PrinciplesBody";

export const metadata: Metadata = {
  title: "Principles — PesaCheck",
  description:
    "The principles that guide PesaCheck, Africa's largest indigenous fact-checking organisation, in debunking misleading claims and providing accurate information for sound decision-making.",
};

export default function PrinciplesPage() {
  return (
    <>
      <PrinciplesHero />
      <PrinciplesBody />
    </>
  );
}
