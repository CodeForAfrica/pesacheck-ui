import Link from "next/link";
import { Container } from "@/components/ui/SectionHeading";
import type { PageCta } from "@/lib/data/pages";
import { FAQ_CTA } from "@/lib/faqs-content";

/** The design's copy, in the shape the live one arrives in. */
const FAQ_CTA_FALLBACK: PageCta = {
  heading: FAQ_CTA.heading,
  body: FAQ_CTA.body,
  label: FAQ_CTA.buttonLabel,
  href: FAQ_CTA.href,
};

// "Still have questions?" call-out bar (Figma node 2866:4133): a light-grey
// rounded panel with copy on the left and a dark "Get in touch" button on the
// right, stacking on mobile.
export function FaqCta({ cta = FAQ_CTA_FALLBACK }: { cta?: PageCta }) {
  return (
    <section className="pb-16 sm:pb-20">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-neutral-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[768px]">
            <p className="text-base font-bold text-[#181d27]">{cta.heading}</p>
            <p className="mt-2 text-sm font-medium text-[#535862]">
              {cta.body}
            </p>
          </div>
          <Link
            href={cta.href}
            className="shrink-0 rounded-[10px] bg-neutral-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            {cta.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
