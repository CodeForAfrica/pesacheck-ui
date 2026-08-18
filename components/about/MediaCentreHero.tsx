import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { MEDIA_CENTRE_HERO } from "@/lib/media-centre-content";

/*
 * A shallow masthead — the design gives this page a 240px band rather than the
 * half-screen hero the other About pages use, with the title tight to the top
 * and the card artwork enlarged so only a couple of cards fill the right edge.
 * The wash holds the left two-thirds solid and releases the artwork after it.
 */
const HERO_GRADIENT = `linear-gradient(90deg,
  #051f56 0%,
  #04204a 35%,
  rgba(2, 29, 51, 0.97) 58%,
  rgba(2, 29, 51, 0.9) 68%,
  rgba(2, 29, 51, 0.55) 78%,
  rgba(2, 29, 51, 0.2) 88%,
  rgba(2, 29, 51, 0) 95%)`;

export function MediaCentreHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/principles/principles-21.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-translate-x-[50%] -translate-y-[35%] scale-[2.33] object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: HERO_GRADIENT }}
      />
      {/* The wash is tuned to a 1440 frame; narrower viewports pull the bright
          end of the artwork in under the copy, so they get a flat scrim too. */}
      <div className="absolute inset-0 bg-pesacheck-black/40 lg:hidden" />

      <Container className="relative flex min-h-[220px] flex-col pb-16 pt-[22px] sm:min-h-[242px]">
        <h1 className="text-[32px] font-extrabold leading-[1.1] text-white sm:text-[40px] lg:text-[48px]">
          {MEDIA_CENTRE_HERO.title}
        </h1>
        <p className="mt-4 max-w-[560px] text-base font-medium leading-[26px] text-white/90 sm:text-xl sm:leading-[30px]">
          {MEDIA_CENTRE_HERO.subtitle}
        </p>
      </Container>
    </section>
  );
}
