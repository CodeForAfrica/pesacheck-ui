import { HeroBanner } from "@/components/ui/HeroBanner";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { Container } from "@/components/ui/SectionHeading";
import { HERO, HERO_PREVIEW, type Story } from "@/lib/home-content";

interface HeroProps {
  stories?: Story[];
}

const HERO_GRADIENT =
  "linear-gradient(100.768deg, rgba(4, 26, 109, 0.9) 45.439%, rgba(102, 102, 102, 0) 66.403%)";

export function Hero({ stories }: HeroProps = {}) {
  const preview = stories?.length ? stories : HERO_PREVIEW;

  return (
    <HeroBanner bgSrc="/images/hero/hero-bg.png" gradient={HERO_GRADIENT}>
      <Container className="relative pt-16 lg:pt-[88px]">
        <div className="max-w-[611px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/70" />
          <h1 className="text-[34px] font-extrabold leading-[1.18] text-white sm:text-[44px] lg:text-[52px]">
            {HERO.title}
          </h1>
          <p className="mt-5 max-w-[611px] text-base leading-6 text-white/90 lg:text-lg">
            {HERO.subtitle}
          </p>
          <a
            href="#fact-checks"
            className="mt-7 inline-flex h-[54px] items-center justify-center rounded-[10px] bg-pesacheck-purple px-5 text-base font-semibold text-white transition-colors hover:bg-pesacheck-purple/90"
          >
            {HERO.cta}
          </a>
        </div>
      </Container>

      <HeroCarousel stories={preview} />
    </HeroBanner>
  );
}
