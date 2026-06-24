import { ContentDesks } from "@/components/home/ContentDesks";
import { Hero } from "@/components/home/Hero";
import { LatestStories } from "@/components/home/LatestStories";
import { Spotlight } from "@/components/home/Spotlight";
import { Tools } from "@/components/home/Tools";
import { TrendingStories } from "@/components/home/TrendingStories";
import { WhatsappBanner } from "@/components/home/WhatsappBanner";
import { Impact } from "@/components/ui/Impact";
import { CONTENT_DESKS } from "@/lib/content-desks";
import { getContentDesks } from "@/lib/data/desks";
import { getLatest, getSpotlight, getTrending } from "@/lib/data/stories";
import {
  LATEST_FEATURE,
  LATEST_GRID,
  SPOTLIGHT_FEATURE,
  SPOTLIGHT_GRID,
  SPOTLIGHT_SECONDARY,
  TRENDING,
} from "@/lib/home-content";

export default async function Home() {
  // Pages own fetching; fall back to the static content when Hasura is
  // unreachable or unconfigured. Fetched in parallel — each falls back alone.
  const [desks, spotlight, trending, latest] = await Promise.all([
    getContentDesks().catch(() => null),
    getSpotlight().catch(() => null),
    getTrending().catch(() => null),
    getLatest().catch(() => null),
  ]);

  return (
    <>
      <Hero />
      <Impact />
      <Spotlight
        stories={
          spotlight ?? [
            SPOTLIGHT_FEATURE,
            SPOTLIGHT_SECONDARY,
            ...SPOTLIGHT_GRID,
          ]
        }
      />
      <WhatsappBanner />
      <TrendingStories stories={trending ?? TRENDING} />
      <ContentDesks desks={desks ?? CONTENT_DESKS} />
      <LatestStories stories={latest ?? [LATEST_FEATURE, ...LATEST_GRID]} />
      <Tools />
    </>
  );
}
