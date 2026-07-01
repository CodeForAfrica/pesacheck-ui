"use client";

import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
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
import { FilterBar } from "./FilterBar";

function clone(sel: FilterSelection): FilterSelection {
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
 * which re-runs the server fetch.
 *
 * Filters **auto-apply** — there's no "Apply" step. The URL (`filters` prop) is
 * the single source of truth; toggling an option, removing a chip, or clearing
 * navigates straight away. `useOptimistic` mirrors the change so the checkboxes
 * and chips update instantly while the server re-fetches the grid in a
 * transition. Filter changes use `replace` (so a burst of toggles doesn't spam
 * history); pagination uses `push`.
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

  // Optimistic mirror of the applied (URL) filters — instant checkbox/chip
  // feedback; rebases to `filters` once the navigation transition resolves.
  const [optimistic, setOptimistic] = useOptimistic(filters);
  const [openDropdown, setOpenDropdown] = useState<FilterDimension | null>(
    null,
  );

  const chips = FILTERS.flatMap(({ dimension }) =>
    optimistic[dimension].map((value) => ({ dimension, value })),
  );

  // Commit a filter/page change to the URL; the server re-fetches that slice.
  const navigate = (
    next: FilterSelection,
    nextPage: number,
    mode: "push" | "replace",
  ) => {
    const params = new URLSearchParams(filtersToQuery(next));
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      setOptimistic(next);
      router[mode](url);
    });
  };

  // Any filter change auto-applies and resets to page 1.
  const commitFilters = (next: FilterSelection) => navigate(next, 1, "replace");

  const toggleOption = (dimension: FilterDimension, value: string) => {
    const next = clone(optimistic);
    next[dimension] = next[dimension].includes(value)
      ? next[dimension].filter((v) => v !== value)
      : [...next[dimension], value];
    commitFilters(next);
  };

  const removeChip = (dimension: FilterDimension, value: string) => {
    const next = clone(optimistic);
    next[dimension] = next[dimension].filter((v) => v !== value);
    commitFilters(next);
  };

  const clear = () => {
    setOpenDropdown(null);
    commitFilters(EMPTY_FILTERS);
  };

  const toggleDropdown = (dimension: FilterDimension) =>
    setOpenDropdown((cur) => (cur === dimension ? null : dimension));

  // Pagination keeps the applied filters; only the page changes.
  const goToPage = (next: number) => navigate(filters, next, "push");

  const [feature, secondary, ...grid] = stories;

  return (
    <>
      {/* Filter panel — its own band below the hero, not overlapping it. */}
      <section className="bg-neutral-50">
        <Container className="py-14 lg:py-16">
          <FilterBar
            selected={optimistic}
            openDropdown={openDropdown}
            chips={chips}
            onToggleDropdown={toggleDropdown}
            onToggleOption={toggleOption}
            onRemoveChip={removeChip}
            onClear={clear}
          />
        </Container>
      </section>

      {/* Listing */}
      <section className="py-14 lg:py-20">
        <Container>
          {stories.length === 0 ? (
            <p className="py-16 text-center text-base font-medium text-neutral-500">
              {chips.length > 0
                ? "No fact-checks match your filters. Try removing some."
                : "No fact-checks have been published here yet."}
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
