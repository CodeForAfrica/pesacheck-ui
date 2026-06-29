import { HeroBanner } from "@/components/ui/HeroBanner";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { Container } from "@/components/ui/SectionHeading";
import { HERO } from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";

const HERO_GRADIENT =
  "linear-gradient(100.768deg, rgba(4, 26, 109, 0.92) 40%, rgba(4, 26, 109, 0) 70%)";

export function FactChecksHero({
  topic = HERO.topic,
  stories,
}: {
  topic?: string;
  stories?: Story[];
}) {
  return (
    <HeroBanner
      bgSrc="/images/fact-checks/hero-bg.png"
      gradient={HERO_GRADIENT}
    >
      <Container className="relative pt-16 lg:pt-[88px]">
        <div>
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/80" />
          <h1 className="text-[34px] font-extrabold leading-[1.18] text-white sm:text-[44px] lg:text-[52px]">
            {topic}
          </h1>
        </div>
      </Container>

      {/*
       * No curated hero list for this desk (missing, empty, or unreachable) →
       * show the masthead alone with a quiet note, never an empty carousel or
       * static placeholder cards.
       */}
      {stories?.length ? (
        <HeroCarousel stories={stories} />
      ) : (
        <Container className="relative pb-16 pt-8 lg:pb-[88px]">
          <p className="text-base text-white/70">
            No featured fact-checks for this desk yet.
          </p>
        </Container>
      )}
    </HeroBanner>
  );
}
