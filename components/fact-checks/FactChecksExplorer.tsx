"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  type FilterSelection,
  filtersToQuery,
  hasActiveFilters,
} from "@/lib/data/fact-check-filters";
import type { Story } from "@/lib/home-content";

/**
 * The fact-checks grid. Filtering and pagination are both **server-side and
 * URL-driven**: `stories` arrive already filtered/paged, matching the query
 * string (`?region=…&topic=…&page=N`). The filter dropdowns themselves live
 * in the header search bar (see `Header`); this component only reflects the
 * applied filters (as a read-only chip row) and drives pagination.
 */
export function FactChecksExplorer({
  stories,
  page,
  totalPages,
  filters,
}: {
  stories: Story[];
  page: number;
  totalPages: number;
  filters: FilterSelection;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const filtered = hasActiveFilters(filters);

  // Pagination keeps the applied filters; only the page changes.
  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(filtersToQuery(filters));
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => router.push(url));
  };

  const [feature, secondary, ...grid] = stories;

  return (
    <>
      {/* Listing */}
      <section className="py-14 lg:py-20">
        <Container>
          {/* The listing is the page's only titled section — there is no hero. */}
          <SectionHeading title="Fact Checks" />

          {stories.length === 0 ? (
            <p className="py-16 text-center text-base font-medium text-neutral-500">
              {filtered
                ? "No fact-checks match your filters. Try removing some, or use “Clear filters” in the search bar."
                : "No fact-checks have been published here yet."}
            </p>
          ) : (
            <>
              <div className="mt-10 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <StoryCard
                    story={feature}
                    imageClassName="aspect-[330/220]"
                    titleClassName="text-xl lg:text-2xl"
                    showExcerpt
                    horizontal
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 440px"
                  />
                </div>
                {secondary && (
                  <StoryCard
                    story={secondary}
                    imageClassName="aspect-[400/203]"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                )}
              </div>

              {grid.length > 0 && (
                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {grid.map((story) => (
                    <StoryCard key={story.href ?? story.title} story={story} />
                  ))}
                </div>
              )}

              <div className="mt-12">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
