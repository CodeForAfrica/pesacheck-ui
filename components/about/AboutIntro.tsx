import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { ABOUT_INTRO, ABOUT_INTRO_IMAGES } from "@/lib/about-content";

export function AboutIntro({
  paragraphs = ABOUT_INTRO,
  images = ABOUT_INTRO_IMAGES,
  bare = false,
}: {
  /** The page section's body supplies these; the design copy is the default. */
  paragraphs?: string[];
  /** The paired portraits beside the copy. */
  images?: { src: string; alt: string }[];
  bare?: boolean;
}) {
  const inner = (
    <>
      <div className="grid gap-10 lg:grid-cols-[610px_1fr] lg:gap-12">
        {/* Body copy */}
        <div className="flex flex-col gap-5 text-sm font-medium leading-5 text-neutral-900">
          {paragraphs.map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>

        {/* Two portrait photos, side by side */}
        <div className="grid grid-cols-2 gap-5">
          {images.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[295/380] w-full overflow-hidden rounded-lg"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 295px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
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
