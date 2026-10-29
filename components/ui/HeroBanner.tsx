import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Blue wash over the hero artwork. Two of them, because how much of the banner
 * the text covers depends on the width.
 *
 * Wide: the wash is at full strength behind the text column and clears over
 * the artwork beside it. Where that column ends is not a fixed share of the
 * screen — the text is `max-w-[611px]` inside a centred 1240px container, so
 * it ends at ~64% of a 1024px screen but only ~50% of a 1920px one. Pinning
 * the falloff to a percentage therefore either under-covers the text on a
 * small laptop or flattens the artwork on a large monitor. So the stops are
 * computed from the container's own geometry instead, and the wash clears
 * just past wherever the text actually ends.
 *
 * Horizontal rather than the 5°-tilted wash this replaces: a tilt means a
 * stop sits at a different x at the top of the banner than at the bottom, so
 * the geometry above would only hold at mid-height — and it was the top of
 * the heading that lost the margin.
 *
 * 0.7 is the floor: it keeps 80%-white body text at 4.5:1 — AA — even where
 * the illustration underneath is blown out to white. A heading, being large
 * text, has margin to spare. The wash the Publisher-built pages used to carry
 * sat at 0.92 and never fell below 0.25, which is what dulled the artwork.
 *
 * Narrow: the text runs the full width of the screen, so there is no clear
 * side to give back. A near-flat wash, slightly deeper at the top.
 *
 * Both also read correctly over the flat background of a page with no hero
 * image — blue into the section's black rather than a flat slab of blue.
 */
/** Where the text column ends: container offset + its padding + `max-w-[611px]`. */
const TEXT_EDGE = "max((100vw - 1240px) / 2, 0px) + 651px";

const HERO_WASH_WIDE = [
  "linear-gradient(90deg,",
  "rgba(4, 26, 109, 0.84) 0px,",
  `rgba(4, 26, 109, 0.70) calc(${TEXT_EDGE}),`,
  `rgba(4, 26, 109, 0.16) calc(${TEXT_EDGE} + 170px),`,
  `rgba(4, 26, 109, 0) calc(${TEXT_EDGE} + 330px))`,
].join(" ");

const HERO_WASH_NARROW =
  "linear-gradient(180deg, rgba(4, 26, 109, 0.78) 0%, rgba(4, 26, 109, 0.70) 100%)";

/**
 * Full-bleed hero banner shell shared by every hero — the homepage, the
 * content-desk pages and the Publisher-built pages. A dark section with a
 * cover background image and the wash over it; each caller supplies its own
 * background and foreground content (masthead + optional `HeroCarousel`).
 *
 * The wash belongs here rather than to the callers: it is one treatment, and
 * three copies of it drifted apart once already. `bgSrc` is optional because a
 * page with no hero image keeps the wash over the flat background rather than
 * showing a stock photo that means nothing.
 */
export function HeroBanner({
  bgSrc,
  children,
}: {
  bgSrc?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      {bgSrc && (
        <Image
          src={bgSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0 lg:hidden"
        style={{ backgroundImage: HERO_WASH_NARROW }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{ backgroundImage: HERO_WASH_WIDE }}
      />
      {children}
    </section>
  );
}
