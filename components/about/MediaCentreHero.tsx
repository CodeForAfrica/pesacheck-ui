import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";

const HERO_GRADIENT =
  "linear-gradient(95deg, rgba(2, 29, 51, 0.88) 30%, rgba(2, 29, 51, 0.55) 70%, rgba(11, 42, 234, 0.20) 100%)";

export function MediaCentreHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/media-centre/hero.png"
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
        <div className="max-w-[640px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
          <h1 className="text-[40px] font-black leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
            Media Centre
          </h1>
          <p className="mt-5 max-w-[643px] text-xl font-medium leading-[30px] text-white/90">
            Where we have been cited in research and other major publications
          </p>
        </div>
      </Container>
    </section>
  );
}
