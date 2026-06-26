"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { Container } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  EMPTY_FILTERS,
  type FilterSelection,
  filtersToQuery,
} from "@/lib/data/fact-check-filters";
import { FILTERS, type FilterDimension } from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";
import { FilterBar, type Selection } from "./FilterBar";

function clone(sel: Selection): Selection {
  return {
    region: [...sel.region],
    language: [...sel.language],
    topic: [...sel.topic],
  };
}

/**
 * The fact-checks grid + filter bar. Filtering and pagination are both
 * **server-side and URL-driven**: `stories` arrive already filtered/paged, and
 * every control navigates by mutating the query string (`?region=…&topic=…&page=N`),
 * which re-runs the server fetch. `filters` is the applied selection parsed from
 * the URL; `selected` is the reader's staged edits, committed via "Apply Filters".
 *
 * The parent keys this component by the applied filters, so navigation remounts
 * it and `selected` re-initializes from the new URL state.
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

  const [selected, setSelected] = useState<Selection>(() => clone(filters));
  const [openDropdown, setOpenDropdown] = useState<FilterDimension | null>(
    null,
  );

  const chips = useMemo(
    () =>
      FILTERS.flatMap(({ dimension }) =>
        selected[dimension].map((value) => ({ dimension, value })),
      ),
    [selected],
  );

  const toggleOption = (dimension: FilterDimension, value: string) => {
    setSelected((prev) => {
      const next = clone(prev);
      next[dimension] = next[dimension].includes(value)
        ? next[dimension].filter((v) => v !== value)
        : [...next[dimension], value];
      return next;
    });
  };

  // Removing a chip commits immediately (like Clear, but for one value) rather
  // than only un-staging it — the listing re-queries on the spot. `setSelected`
  // gives instant visual feedback; `navigate` re-fetches and the remount then
  // re-syncs `selected` from the new URL.
  const removeChip = (dimension: FilterDimension, value: string) => {
    const next = clone(selected);
    next[dimension] = next[dimension].filter((v) => v !== value);
    setSelected(next);
    navigate(next, 1);
  };

  const toggleDropdown = (dimension: FilterDimension) =>
    setOpenDropdown((cur) => (cur === dimension ? null : dimension));

  // Navigate to a new filter+page combination; the server re-fetches that slice.
  const navigate = (nextFilters: FilterSelection, nextPage: number) => {
    const params = new URLSearchParams(filtersToQuery(nextFilters));
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // Pagination keeps the applied filters; only the page changes.
  const goToPage = (next: number) => navigate(filters, next);

  const apply = () => {
    setOpenDropdown(null);
    navigate(selected, 1);
  };

  const clear = () => {
    setSelected(clone(EMPTY_FILTERS));
    setOpenDropdown(null);
    navigate(EMPTY_FILTERS, 1);
  };

  const [feature, secondary, ...grid] = stories;

  return (
    <>
      {/* Filter panel — its own band below the hero, not overlapping it. */}
      <section className="bg-neutral-50">
        <Container className="py-14 lg:py-16">
          <FilterBar
            selected={selected}
            openDropdown={openDropdown}
            chips={chips}
            onToggleDropdown={toggleDropdown}
            onToggleOption={toggleOption}
            onRemoveChip={removeChip}
            onApply={apply}
            onClear={clear}
          />
        </Container>
      </section>

      {/* Listing */}
      <section className="py-14 lg:py-20">
        <Container>
          {stories.length === 0 ? (
            <p className="py-16 text-center text-base font-medium text-neutral-500">
              No fact-checks match your filters. Try removing some.
            </p>
          ) : (
            <>
              <div className="grid gap-8 lg:grid-cols-3">
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
