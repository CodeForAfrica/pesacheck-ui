import { FiArrowUpRight } from "react-icons/fi";
import { KnowledgeNav } from "@/components/knowledge/KnowledgeNav";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import type { PageSection } from "@/lib/data/pages";
import {
  KNOWLEDGE_SECTIONS,
  type KnowledgeSection,
  type Placeholder,
} from "@/lib/knowledge-content";

function ImageBlock({ image }: { image: Placeholder }) {
  return (
    <div
      className={`rounded-2xl bg-neutral-100 ${
        image.wide ? "col-span-2 aspect-[610/350]" : "aspect-[295/230]"
      }`}
      aria-hidden
    />
  );
}

function Section({ section }: { section: KnowledgeSection }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <SectionHeading title={section.title} />

      {/* Body content sits in a 610px column on the left of the section. */}
      <div className="mt-8 max-w-[610px]">
        <div className="space-y-5 text-sm font-medium leading-5 text-neutral-900">
          {section.body.map((para) => (
            <p key={para}>{para}</p>
          ))}

          {section.fundingItems && (
            <ul className="list-disc space-y-1 pl-5">
              {section.fundingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}

          {section.closing && <p>{section.closing}</p>}
        </div>

        <button
          type="button"
          className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-pesacheck-blue transition-colors hover:text-pesacheck-black"
        >
          Learn More
          <FiArrowUpRight size={20} aria-hidden />
        </button>

        <div className="mt-10 grid grid-cols-2 gap-5">
          {section.images.map((image, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder images have no stable id
            <ImageBlock key={i} image={image} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Body styling for an authored section: the blocks Superdesk emits. */
const PROSE = [
  "space-y-5 text-sm font-medium leading-5 text-neutral-900",
  "[&_a]:font-semibold [&_a]:text-pesacheck-blue [&_a]:underline",
  "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
  "[&_img]:my-2 [&_img]:w-full [&_img]:rounded-2xl",
  "[&_b]:font-semibold [&_strong]:font-semibold",
].join(" ");

function LiveSection({ section }: { section: PageSection }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <SectionHeading title={section.title} />
      <div className="mt-8 max-w-[610px]">
        {/* Sanitised in lib/data/body.ts:renderBody. */}
        <div
          className={PROSE}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderBody
          dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
        />
      </div>
    </section>
  );
}

export function KnowledgeBody({ sections }: { sections?: PageSection[] }) {
  const navItems = (sections ?? KNOWLEDGE_SECTIONS).map((s) => ({
    id: s.id,
    label: s.title,
  }));

  return (
    <Container className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[180px_1fr] lg:gap-14">
        <KnowledgeNav items={navItems} />
        <div className="space-y-20">
          {sections
            ? sections.map((section) => (
                <LiveSection key={section.id} section={section} />
              ))
            : KNOWLEDGE_SECTIONS.map((section) => (
                <Section key={section.id} section={section} />
              ))}
        </div>
      </div>
    </Container>
  );
}
