import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutTeam } from "@/components/about/AboutTeam";
import { Impact } from "@/components/ui/Impact";
import { ABOUT_TEAM } from "@/lib/about-content";
import { getPage } from "@/lib/data/pages";
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
  // Keeps its own file: the impact band and the intro's paired images are
  // layout this page owns, not sections a catch-all could place. Its copy is
  // live — the hero, and the intro paragraphs from the first page section.
  const [team, page] = await Promise.all([
    getTeam().catch(() => null),
    getPage("about").catch(() => null),
  ]);

  const intro = page?.sections[0]?.bodyHtml
    ? page.sections[0].bodyHtml
        .split(/<\/p>/)
        .map((p) =>
          p
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean)
    : undefined;

  return (
    <>
      <AboutHero hero={page?.hero} />
      <AboutIntro paragraphs={intro?.length ? intro : undefined} />
      <Impact />
      <AboutTeam team={team?.length ? team : ABOUT_TEAM} />
    </>
  );
}
