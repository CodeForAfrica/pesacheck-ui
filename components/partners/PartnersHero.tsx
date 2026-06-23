import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { PARTNERS_HERO } from "@/lib/partners-content";

export function PartnersHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/partners/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,29,51,0.85)] via-[rgba(2,29,51,0.55)] to-[rgba(2,29,51,0.25)]" />

      <Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[500px] lg:min-h-[550px]">
        <div className="max-w-[611px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
          <h1 className="text-[40px] font-black leading-[1.1] text-white sm:text-[52px]">
            {PARTNERS_HERO.title}
          </h1>
          <p className="mt-5 text-xl font-medium leading-[30px] text-white/90">
            {PARTNERS_HERO.subtitle}
          </p>
        </div>
      </Container>
    </section>
  );
}
