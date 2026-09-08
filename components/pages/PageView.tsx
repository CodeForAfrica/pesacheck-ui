import Image from "next/image";
import Link from "next/link";
import {
  hasOwnHeadings,
  isFullBleed,
  isListSection,
  ListSection,
} from "@/components/pages/ListSection";
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
/** The call-out bar at the foot of a page, when one is authored. */
function PageCallToAction({ cta }: { cta: NonNullable<Page["cta"]> }) {
  return (
    <Container className="pb-16 sm:pb-20">
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-neutral-50 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[768px]">
          <p className="text-base font-bold text-[#181d27]">{cta.heading}</p>
          {cta.body && (
            <p className="mt-2 text-sm font-medium text-[#535862]">
              {cta.body}
            </p>
          )}
        </div>
        <Link
          href={cta.href}
          className="shrink-0 rounded-[10px] bg-neutral-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          {cta.label}
        </Link>
      </div>
    </Container>
  );
}

/** One section in the page's column: heading, then prose or a built-in. */
function ColumnSection({ section }: { section: Page["sections"][number] }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      {!hasOwnHeadings(section.template) && (
        <SectionHeading title={section.title} />
      )}
      {isListSection(section.template) ? (
        <div className={hasOwnHeadings(section.template) ? "" : "mt-8"}>
          <ListSection section={section} />
        </div>
      ) : (
        <div className="mt-8 max-w-[610px]">
          {/* Sanitised in lib/data/body.ts:renderBody. */}
          <div
            className={PROSE}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderBody
            dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
          />
        </div>
      )}
    </section>
  );
}

export function PageView({ page }: { page: Page }) {
  // The rail is for the sections a reader scrolls between. A built-in brings
  // its own headings and often spans the page, so it is not a rail entry —
  // which is also what keeps a page built entirely from built-ins, like the
  // ecosystem, from growing a rail its design never had.
  const navItems = page.sections
    .filter((s) => !isListSection(s.template))
    .map((s) => ({ id: s.id, label: s.title }));
  const showNav = navItems.length > 1;

  // Sections are emitted in order, but a full-bleed one breaks out of the
  // column: consecutive column sections are gathered into one container and a
  // full-bleed section is rendered between them, edge to edge.
  const runs: { fullBleed: boolean; sections: Page["sections"] }[] = [];
  for (const section of page.sections) {
    const fullBleed = isFullBleed(section.template);
    const last = runs.at(-1);
    if (last && last.fullBleed === fullBleed && !fullBleed) {
      last.sections.push(section);
    } else {
      runs.push({ fullBleed, sections: [section] });
    }
  }

  return (
    <>
      <PageHero page={page} />

      {runs.map((run) =>
        run.fullBleed ? (
          <div key={run.sections[0].id} id={run.sections[0].id}>
            <ListSection section={run.sections[0]} />
          </div>
        ) : (
          <Container key={run.sections[0].id} className="py-16 lg:py-20">
            <div
              className={`grid gap-10 lg:gap-14 ${
                showNav ? "lg:grid-cols-[180px_1fr]" : ""
              }`}
            >
              {showNav && (
                <SectionNav items={navItems} label={`${page.title} sections`} />
              )}
              <div className="space-y-20">
                {run.sections.map((section) => (
                  <ColumnSection key={section.id} section={section} />
                ))}
              </div>
            </div>
          </Container>
        ),
      )}

      {page.cta && <PageCallToAction cta={page.cta} />}
    </>
  );
}
