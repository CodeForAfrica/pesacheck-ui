import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import type { Page } from "@/lib/data/pages";

/**
 * Body styling for an authored section — the blocks Superdesk's editor emits,
 * styled to match the hand-built pages so a CMS-authored page does not read as
 * a different site.
 */
const PROSE = [
  "space-y-5 text-sm font-medium leading-5 text-neutral-900",
  "[&_a]:font-semibold [&_a]:text-pesacheck-blue [&_a]:underline",
  "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-pesacheck-black",
  "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
  "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
  "[&_img]:my-2 [&_img]:w-full [&_img]:rounded-2xl",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-pesacheck-blue [&_blockquote]:pl-4",
  "[&_b]:font-semibold [&_strong]:font-semibold",
].join(" ");

/**
 * The generic renderer for a route-backed page. Any page without a bespoke
 * layout of its own gets this: a hero and a stack of anchored sections.
 *
 * Deliberately plain. A page authored in Superdesk should look like it belongs
 * here, but a generic renderer cannot know a design's intent — so pages whose
 * layout matters (Knowledge, the About pages) keep their own components and
 * take only their copy from the same data.
 */
export function PageView({ page }: { page: Page }) {
  return (
    <>
      <section className="relative overflow-hidden bg-pesacheck-black">
        {page.hero.image && (
          <Image
            src={page.hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        <Container className="relative flex min-h-[320px] flex-col justify-center py-16 lg:min-h-[420px]">
          <div className="max-w-[611px]">
            <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/80" />
            <h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px]">
              {page.hero.title}
            </h1>
            {page.hero.subtitle && (
              <p className="mt-5 text-base leading-6 text-white/90 lg:text-lg">
                {page.hero.subtitle}
              </p>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-16 lg:py-20">
        <div className="space-y-16">
          {page.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 max-w-[720px]"
            >
              <SectionHeading title={section.title} />
              <div className="mt-8">
                {/* Sanitised in lib/data/body.ts:renderBody. */}
                <div
                  className={PROSE}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderBody
                  dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                />
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
