import Image from "next/image";
import { SectionNav } from "@/components/pages/SectionNav";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import type { Page } from "@/lib/data/pages";

// Left-to-right blue wash over the hero artwork — darker on the left so the
// heading stays legible, fading toward the image on the right. Also reads
// correctly over the flat background when a page has no hero image.
const HERO_GRADIENT =
  "linear-gradient(95deg, rgba(4, 26, 109, 0.92) 30%, rgba(4, 26, 109, 0.55) 70%, rgba(11, 42, 234, 0.25) 100%)";

/**
 * Body styling for an authored section — the blocks Superdesk's editor emits,
 * matched to the hand-built pages so a CMS-authored page does not read as a
 * different site.
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

function PageHero({ page }: { page: Page }) {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      {/* A page with no hero image keeps the wash over the flat background
          rather than showing a stock photo that means nothing. */}
      {page.hero.image && (
        <Image
          src={page.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: HERO_GRADIENT }}
      />

      <Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[520px] lg:min-h-[640px] lg:py-[88px]">
        <div className="max-w-[611px]">
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/80" />
          <h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
            {page.hero.title}
          </h1>
          {page.hero.subtitle && (
            <p className="mt-5 max-w-[611px] text-base leading-6 text-white/90 lg:text-lg">
              {page.hero.subtitle}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * The renderer for every route-backed page. All three parts come from
 * Superdesk: the hero from the section tagged `hero`, the body from the rest,
 * and the anchor rail from their slugs.
 *
 * There is no per-page layout left to write — a new page is a route, a list
 * and some sections.
 */
export function PageView({ page }: { page: Page }) {
  const navItems = page.sections.map((s) => ({ id: s.id, label: s.title }));
  // One section needs no rail to itself, and without one the body should take
  // the full width rather than the 180px first column.
  const showNav = navItems.length > 1;

  return (
    <>
      <PageHero page={page} />

      <Container className="py-16 lg:py-20">
        <div
          className={`grid gap-10 lg:gap-14 ${
            showNav ? "lg:grid-cols-[180px_1fr]" : ""
          }`}
        >
          {showNav && (
            <SectionNav items={navItems} label={`${page.title} sections`} />
          )}
          <div className="space-y-20">
            {page.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
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
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
