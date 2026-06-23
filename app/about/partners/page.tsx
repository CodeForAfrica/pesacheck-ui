import type { Metadata } from "next";
import { PartnersHero } from "@/components/partners/PartnersHero";
import { AlliesSection } from "@/components/partners/AlliesSection";
import { OurPartnersSection } from "@/components/partners/OurPartnersSection";

export const metadata: Metadata = {
  title: "Our Partners — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export default function PartnersPage() {
  return (
    <>
      <PartnersHero />
      <AlliesSection />
      <OurPartnersSection />
    </>
  );
}
