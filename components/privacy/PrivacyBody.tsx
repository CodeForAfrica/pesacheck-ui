import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { Container } from "@/components/ui/SectionHeading";
import type { LegalSection } from "@/lib/data/legal";
import { PRIVACY_ABOUT, PRIVACY_SECTIONS } from "@/lib/privacy-content";

/** Body styling for an authored clause, matching the static blocks' treatment. */
const PROSE = [
  "flex flex-col gap-3 text-[14px] leading-[1.7] text-[#3b3f45]",
  "[&_li]:mb-[5px] [&_strong]:text-pesacheck-black",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_a]:font-semibold [&_a]:text-pesacheck-blue [&_a]:underline",
].join(" ");

/**
 * Single-column legal-document layout, matching the design: a 612px reading
 * column, numbered sections separated by plain grey hairlines (no blue accent
 * bar, no side nav), and a secondary closing note.
 *
 * Clauses are numbered by position, so the list's order is the document's.
 */
export function PrivacyBody({
  sections,
  note,
  bare = false,
}: {
  /** Live clauses; without them the static policy is rendered. */
  sections?: LegalSection[];
  note?: string;
  bare?: boolean;
}) {
  // The static closing note is part of the static policy, so it stands in only
  // when the clauses do too. Defaulting it in live mode gave the imprint the
  // privacy policy's boilerplate: this template serves any legal document, and
  // an empty section body means no note rather than someone else's.
  const closing = note ?? (sections ? undefined : PRIVACY_ABOUT);

  const inner = (
    <div className="max-w-[612px]">
      {sections
        ? sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-[34px] scroll-mt-28 border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
            >
              <h2 className="mb-2.5 text-[15px] font-bold leading-[1.4] text-pesacheck-black">
                {i + 1}. {section.title}
              </h2>
              {/* Sanitised in lib/data/body.ts:renderBody. */}
              <div
                className={PROSE}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderBody
                dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
              />
            </section>
          ))
        : PRIVACY_SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-[34px] scroll-mt-28 border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
            >
              <h2 className="mb-2.5 text-[15px] font-bold leading-[1.4] text-pesacheck-black">
                {i + 1}. {section.title}
              </h2>
              <div className={PROSE}>
                <ContentBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}

      {closing && (
        <div className="border-t border-neutral-200 pt-6">
          <p className="text-[13px] leading-[1.7] text-neutral-500">
            {closing}
          </p>
        </div>
      )}
    </div>
  );

  if (bare) return inner;

  return <Container className="pb-8 pt-14 lg:pt-[70px]">{inner}</Container>;
}
