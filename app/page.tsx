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

export default async function Home() {
  const desks = (await getContentDesks().catch(() => null)) ?? CONTENT_DESKS;

  return (
    <>
      <Hero />
      <Impact />
      <Spotlight />
      <WhatsappBanner />
      <TrendingStories />
      <ContentDesks desks={desks} />
      <LatestStories />
      <Tools />
    </>
  );
}
