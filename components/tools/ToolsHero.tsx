import Image from "next/image";

/**
 * Full-bleed Tools hero banner. The Figma frame is a single 1440×640 image
 * (navy wash + control-panel illustration baked in), so we preserve its exact
 * 9:4 aspect ratio and let it scale proportionally — no cropping at any width.
 * Capped at 1440px to align with the rest of the page chrome.
 */
export function ToolsHero() {
  return (
    <section className="bg-pesacheck-black">
      <div className="relative mx-auto aspect-[9/4] w-full max-w-[1440px]">
        <Image
          src="/images/tools-hero/tools-21.png"
          alt="PesaCheck tools — a control panel of fact-checking instruments"
          fill
          priority
          sizes="(max-width: 1440px) 100vw, 1440px"
          className="object-cover"
        />
      </div>
    </section>
  );
}
