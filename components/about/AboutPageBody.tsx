import { FiArrowUpRight } from "react-icons/fi";
import { AboutSectionNav } from "@/components/about/AboutSectionNav";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import type { AboutSection, ImageSlot } from "@/lib/content-blocks";

// Grey placeholder boxes mirror the design's image rectangles until real assets
// land. "small" boxes pair in a 2-col grid; "large" spans the reading column.
function PlaceholderImage({ slot }: { slot: ImageSlot }) {
  return (
    <div
      className={`w-full rounded-lg bg-neutral-100 ${
        slot === "small" ? "aspect-[295/230]" : "aspect-[610/350]"
      }`}
      aria-hidden="true"
    />
  );
}

function SectionImages({ images }: { images: ImageSlot[] }) {
  const small = images.filter((slot) => slot === "small");
  const large = images.filter((slot) => slot === "large");

  return (
    <div className="mt-8 flex flex-col gap-5">
      {small.length > 0 && (
        <div className="grid grid-cols-2 gap-5">
          {small.map((slot, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder images have no stable id
            <PlaceholderImage key={`s-${i}`} slot={slot} />
          ))}
        </div>
      )}
      {large.map((slot, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder images have no stable id
        <PlaceholderImage key={`l-${i}`} slot={slot} />
      ))}
    </div>
  );
}

function Section({ section }: { section: AboutSection }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <SectionHeading title={section.title} />

      <div className="mt-8 max-w-[610px]">
        <div className="flex flex-col gap-5 text-sm font-medium leading-5 text-neutral-900">
          <ContentBlocks blocks={section.blocks} />
        </div>

        {section.learnMore && (
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 transition-colors hover:text-pesacheck-blue"
          >
            Learn More
            <FiArrowUpRight size={20} aria-hidden />
          </button>
        )}

        {section.images.length > 0 && <SectionImages images={section.images} />}
      </div>
    </section>
  );
}

/**
 * Shared body template for the long-form About pages (Methodology, Principles,
 * Funding): a sticky section nav beside the titled, anchor-linkable sections.
 * Pages own the content — pass their `AboutSection[]` from `lib/*-content.ts`.
 */
export function AboutPageBody({
  navLabel,
  sections,
}: {
  navLabel: string;
  sections: AboutSection[];
}) {
  return (
    <Container className="py-14 lg:py-[70px]">
      <div className="grid gap-12 lg:grid-cols-[180px_1fr] lg:gap-16">
        <AboutSectionNav
          label={navLabel}
          items={sections.map((s) => ({ id: s.id, title: s.title }))}
        />
        <div className="flex flex-col gap-16 lg:gap-20">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </Container>
  );
}
