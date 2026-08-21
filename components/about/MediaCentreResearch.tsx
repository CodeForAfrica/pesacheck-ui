import { FiArrowUpRight } from "react-icons/fi";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
  RESEARCH_CTA,
  RESEARCH_LIMIT,
  RESEARCH_STRANDS,
  type ResearchStrand,
  type ResearchTone,
} from "@/lib/media-centre-content";

/*
 * Each strand carries its own accent on the rule and the label. Two of the four
 * are brand tokens; the green and red are one-off design colours for this
 * section, so they live here rather than in the theme.
 */
const TONE: Record<ResearchTone, string> = {
  blue: "#0b2aea",
  navy: "#021d33",
  green: "#17803d",
  red: "#d80128",
};

function Strand({ strand }: { strand: ResearchStrand }) {
  const color = TONE[strand.tone];

  return (
    <div className="flex gap-3">
      <span
        className="mt-[3px] h-[18px] w-[3px] shrink-0"
        style={{ backgroundColor: color }}
      />
      {/* The link sits at the bottom so it lines up across a row whose labels
          wrap to different depths. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-sm font-bold uppercase leading-[18px] tracking-wide"
            style={{ color }}
          >
            {strand.label}
          </h3>
          {/* A live strand may carry no topic to name the document kind. */}
          {strand.kind && (
            <span className="shrink-0 rounded-full border border-neutral-100 px-3.5 py-1 text-xs leading-[18px] text-neutral-600">
              {strand.kind}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-neutral-800">{strand.body}</p>
        <a
          href={strand.href}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-pesacheck-black transition-colors hover:text-pesacheck-blue"
        >
          {RESEARCH_CTA}
          <FiArrowUpRight size={12} aria-hidden />
        </a>
      </div>
    </div>
  );
}

export function MediaCentreResearch({
  strands = RESEARCH_STRANDS,
  limit = RESEARCH_LIMIT,
}: {
  strands?: ResearchStrand[];
  limit?: number;
}) {
  return (
    <section className="py-14 lg:py-16">
      <Container>
        <SectionHeading title="In research" />
        <div className="mt-9 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
          {strands.slice(0, limit).map((strand) => (
            <Strand key={strand.label} strand={strand} />
          ))}
        </div>
      </Container>
    </section>
  );
}
