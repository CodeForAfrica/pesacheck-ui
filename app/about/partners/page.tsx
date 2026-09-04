import type { Metadata } from "next";
import { AlliesSection } from "@/components/partners/AlliesSection";
import { OurPartnersSection } from "@/components/partners/OurPartnersSection";
import { PartnersHero } from "@/components/partners/PartnersHero";
import { getPage } from "@/lib/data/pages";

export const metadata: Metadata = {
  title: "Our Partners — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export const revalidate = 300;

/**
 * Keeps its own file: its body is layout this page owns rather than sections a
 * catch-all could place. Only the hero is live.
 */
export default async function PartnersPage() {
  const page = await getPage("about/partners").catch(() => null);

  return (
    <>
      <PartnersHero hero={page?.hero} />
      <AlliesSection />
      <OurPartnersSection />
    </>
  );
}
