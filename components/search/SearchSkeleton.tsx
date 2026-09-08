import { Container } from "@/components/ui/SectionHeading";
import { StoryGridSkeleton } from "@/components/ui/StoryCardSkeleton";

/**
 * What the search results look like while a query or filter change is in
 * flight. Mirrors `SearchExplorer`'s result state: the summary line, then the
 * four-column grid.
 *
 * The summary is a placeholder rather than the real criteria, because the
 * count is what it mostly says and that is exactly what is not known yet.
 */
export function SearchSkeleton() {
  return (
    <>
      <section className="pt-10 pb-4" aria-hidden>
        <div className="mx-auto flex animate-pulse flex-col items-center gap-2">
          <span className="block h-4 w-32 rounded bg-neutral-100" />
          <span className="block h-6 w-56 rounded bg-neutral-100" />
        </div>
      </section>

      <section className="pb-14 pt-6 lg:pb-20">
        <Container>
          <StoryGridSkeleton count={8} />
          {/* Holds the pager's height so results do not shift it upward. */}
          <div className="mt-12 h-10" />
        </Container>
      </section>
    </>
  );
}
