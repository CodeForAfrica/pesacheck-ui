import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Impact } from "@/components/ui/Impact";

export const metadata: Metadata = {
  title: "About Us — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <Impact />
      <AboutTeam />
    </>
  );
}
