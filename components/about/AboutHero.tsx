import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { ABOUT_HERO } from "@/lib/about-content";

// Dark navy hero with the data-cards artwork bleeding off the right edge; a
// left-to-right wash keeps the heading legible over the busy image.
const HERO_GRADIENT =
  "linear-gradient(95deg, rgba(4, 26, 109, 0.92) 30%, rgba(4, 26, 109, 0.55) 70%, rgba(11, 42, 234, 0.25) 100%)";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/about/about-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: HERO_GRADIENT }}
      />

      <Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[500px] lg:min-h-[550px]">
        <div className="max-w-[611px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
          <h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
            {ABOUT_HERO.title}
          </h1>
          <p className="mt-5 max-w-[611px] text-base font-medium leading-6 text-white/90">
            {ABOUT_HERO.subtitle}
          </p>
        </div>
      </Container>
    </section>
  );
}
