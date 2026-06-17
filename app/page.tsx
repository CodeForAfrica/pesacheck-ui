import { Hero } from "@/components/home/Hero";
import { Impact } from "@/components/ui/Impact";
import { Spotlight } from "@/components/home/Spotlight";
import { WhatsappBanner } from "@/components/home/WhatsappBanner";
import { TrendingStories } from "@/components/home/TrendingStories";
import { ContentDesks } from "@/components/home/ContentDesks";
import { LatestStories } from "@/components/home/LatestStories";
import { Tools } from "@/components/home/Tools";

export default function Home() {
  return (
    <>
      <Hero />
      <Impact />
      <Spotlight />
      <WhatsappBanner />
      <TrendingStories />
      <ContentDesks />
      <LatestStories />
      <Tools />
    </>
  );
}
