import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Impact } from "@/components/ui/Impact";
import { ABOUT_TEAM } from "@/lib/about-content";
import { getTeam } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "About Us — PesaCheck",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
};

// Revalidate every 5 minutes rather than freezing the curated list at build
// time, matching the other live sections.
export const revalidate = 300;

export default async function AboutPage() {
  // An unreachable Hasura and an uncurated list arrive the same way — as
  // nothing to show — and the grid has no empty state, so both fall back.
  const team = await getTeam().catch(() => null);

  return (
    <>
      <AboutHero />
      <AboutIntro />
      <Impact />
      <AboutTeam team={team?.length ? team : ABOUT_TEAM} />
    </>
  );
}
