import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { Container } from "@/components/ui/SectionHeading";
import { PRIVACY_ABOUT, PRIVACY_SECTIONS } from "@/lib/privacy-content";

/**
 * Single-column legal-document layout for the Privacy Policy (issue #61),
 * matching the design: a 612px reading column, numbered sections separated by
 * plain grey hairline dividers (no blue accent bar, no side nav), and the
 * secondary "about CfA" note at the end. Body copy reuses `ContentBlocks`.
 */
export function PrivacyBody() {
  return (
    <Container className="pb-8 pt-14 lg:pt-[70px]">
      <div className="max-w-[612px]">
        {PRIVACY_SECTIONS.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            className="mb-[34px] scroll-mt-28 border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
          >
            <h2 className="mb-2.5 text-[15px] font-bold leading-[1.4] text-pesacheck-black">
              {i + 1}. {section.title}
            </h2>
            <div className="flex flex-col gap-3 text-[14px] leading-[1.7] text-[#3b3f45] [&_li]:mb-[5px] [&_strong]:text-pesacheck-black">
              <ContentBlocks blocks={section.blocks} />
            </div>
          </section>
        ))}

        <div className="border-t border-neutral-200 pt-6">
          <p className="text-[13px] leading-[1.7] text-neutral-500">
            {PRIVACY_ABOUT}
          </p>
        </div>
      </div>
    </Container>
  );
}
