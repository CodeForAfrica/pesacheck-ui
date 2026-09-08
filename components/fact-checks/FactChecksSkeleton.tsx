import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
  StoryCardSkeleton,
  StoryGridSkeleton,
} from "@/components/ui/StoryCardSkeleton";

/**
 * What the fact-checks listing looks like while a page or filter change is in
 * flight. Mirrors `FactChecksExplorer`: the feature pair on a three-column
 * row, then the grid of eight, then space for the pager.
 *
 * The heading is real rather than a placeholder — it is known before the query
 * runs, and blanking it would make the page look like it had navigated away.
 */
export function FactChecksSkeleton({ title }: { title: string }) {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <SectionHeading title={title} />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StoryCardSkeleton imageClassName="aspect-[330/220]" showExcerpt />
          </div>
          <StoryCardSkeleton imageClassName="aspect-[400/203]" />
        </div>

        <div className="mt-10">
          <StoryGridSkeleton count={8} />
        </div>

        {/* Keeps the pager's height so the page does not shift when it lands. */}
        <div className="mt-12 h-10" />
      </Container>
    </section>
  );
}
