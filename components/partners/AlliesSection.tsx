import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ALLIES_DESCRIPTION, ALLIES_LOGOS } from "@/lib/partners-content";
import type { Logo } from "@/lib/site";

export function AlliesSection({
  logos = ALLIES_LOGOS,
  description,
  bare = false,
}: {
  logos?: Logo[];
  /** Standfirst above the wall; the page section's body supplies it. */
  description?: string;
  bare?: boolean;
}) {
  const paragraphs = description ? [description] : ALLIES_DESCRIPTION;

  const inner = (
    <>
      <SectionHeading title="Our Allies" />
      <div className="mt-8 flex flex-col gap-4 text-sm font-medium leading-5 text-neutral-900 lg:max-w-[610px]">
        {paragraphs.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6">
        {logos.map((logo) => (
          <Link
            key={logo.alt}
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              style={{
                height: "40px",
                width: `${Math.round((logo.width / logo.height) * 40)}px`,
              }}
              className="object-contain grayscale transition hover:grayscale-0"
            />
          </Link>
        ))}
      </div>
    </>
  );

  if (bare) return inner;

  return (
    <section className="py-14 lg:py-[70px]">
      <Container>{inner}</Container>
    </section>
  );
}
