import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { PRIVACY_HERO } from "@/lib/privacy-content";

// Shared About-style hero: cover photo behind a left-to-right navy wash that
// keeps the heading legible. Mirrors PrinciplesHero.
const HERO_GRADIENT =
  "linear-gradient(95deg, rgba(4, 26, 109, 0.92) 30%, rgba(4, 26, 109, 0.55) 70%, rgba(11, 42, 234, 0.25) 100%)";

export function PrivacyHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/privacy/privacy-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: HERO_GRADIENT }}
      />

      <Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[500px] lg:min-h-[550px]">
        <div className="max-w-[611px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
          <h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
            {PRIVACY_HERO.title}
          </h1>
          <p className="mt-5 max-w-[611px] text-base font-medium leading-6 text-white/90">
            {PRIVACY_HERO.subtitle}
          </p>
        </div>
      </Container>
    </section>
  );
}
