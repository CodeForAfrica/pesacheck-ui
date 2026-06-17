import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { PRINCIPLES_HERO } from "@/lib/principles-content";

// Dark navy hero with the peeling data-cards artwork bleeding off the right
// edge; a left-to-right wash keeps the heading legible over the busy image.
// Mirrors the shared About hero treatment.
const HERO_GRADIENT =
  "linear-gradient(90deg, #021d33 0%, rgba(2, 29, 51, 0.85) 45%, rgba(2, 29, 51, 0.15) 100%)";

export function PrinciplesHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/principles/principles-21.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      <div className="absolute inset-0" style={{ backgroundImage: HERO_GRADIENT }} />

      <Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[500px] lg:min-h-[550px]">
        <div className="max-w-[611px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
          <h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
            {PRINCIPLES_HERO.title}
          </h1>
          <p className="mt-5 max-w-[611px] text-base font-medium leading-6 text-white/90">
            {PRINCIPLES_HERO.subtitle}
          </p>
        </div>
      </Container>
    </section>
  );
}
