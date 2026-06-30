import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-bleed hero banner shell shared by the homepage and content-desk heroes:
 * a dark section with a cover background image and a gradient overlay. Each
 * caller supplies its own background, gradient, and foreground content
 * (masthead + optional `HeroCarousel`).
 */
export function HeroBanner({
  bgSrc,
  gradient,
  children,
}: {
  bgSrc: string;
  gradient: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src={bgSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
      {children}
    </section>
  );
}
