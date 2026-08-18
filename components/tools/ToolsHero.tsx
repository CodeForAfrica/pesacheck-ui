import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/SectionHeading";
import { TOOLS_HERO } from "@/lib/tools-content";

/*
 * The design crops deep into the control-panel artwork — a ~2.9× enlargement
 * nudged right — so the panel's edge lands at ~40% of the frame and everything
 * past it is a soft wash of light. `scale`/`translate-x` on top of
 * `object-cover` reproduce that framing at 1440; smaller viewports ease the
 * zoom back so the crop keeps some of the artwork's shape. The source plate is
 * only 1440×640, so the enlargement is soft — as it is in the design.
 */
const HERO_GRADIENT = `linear-gradient(90deg,
  #051f56 0%,
  #04204a 39%,
  rgba(2, 29, 51, 0.95) 55%,
  rgba(2, 29, 51, 0.93) 65%,
  rgba(2, 29, 51, 0.4) 79%,
  rgba(2, 29, 51, 0) 89%)`;

export function ToolsHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/tools-hero/tools-21.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="translate-x-[42px] scale-[2] object-cover sm:scale-[2.4] lg:scale-[2.9]"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: HERO_GRADIENT }}
      />

      <Container className="relative flex min-h-[420px] flex-col justify-end pb-16 pt-16 sm:min-h-[480px] lg:min-h-[529px] lg:pb-[90px]">
        <div className="max-w-[611px]">
          <span className="mb-[30px] block h-[3px] w-[104px] rounded bg-white/90" />
          <h1 className="text-[34px] font-extrabold leading-[1.1] text-white sm:text-[42px] lg:text-[48px]">
            {TOOLS_HERO.title}
          </h1>
          <Link
            href={TOOLS_HERO.subtitleHref}
            className="mt-4 inline-block text-xl font-medium leading-[30px] text-white/90 transition-colors hover:text-white"
          >
            {TOOLS_HERO.subtitle}
          </Link>
        </div>
      </Container>
    </section>
  );
}
