"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import { Pagination } from "@/components/ui/Pagination";
import { FilterBar, type Selection } from "./FilterBar";
import {
  DEFAULT_FILTERS,
  FEATURE,
  FEATURE_SECONDARY,
  FILTERS,
  STORIES,
  type FilterDimension,
} from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";

// Featured story leads the pool, so filtering can promote any matching story
// into the large feature slot.
const POOL: Story[] = [FEATURE, FEATURE_SECONDARY, ...STORIES];

const EMPTY: Selection = { region: [], language: [], topic: [] };

// Grid cards per page (the lead feature + secondary always head the listing).
const GRID_PAGE_SIZE = 8;

function clone(sel: Selection): Selection {
  return { region: [...sel.region], language: [...sel.language], topic: [...sel.topic] };
}

function matches(story: Story, applied: Selection): boolean {
  return FILTERS.every(({ dimension }) => {
    const wanted = applied[dimension];
    if (wanted.length === 0) return true;
    const value = story[dimension];
    return value != null && wanted.includes(value);
  });
}

export function FactChecksExplorer() {
  // `selected` is the staged set reflected by the dropdowns + chips; `applied`
  // is what actually filters the listing (committed via "Apply Filters"). The
  // page loads showing the design's chips staged but the full listing visible —
  // filtering kicks in once the reader clicks "Apply Filters".
  const [selected, setSelected] = useState<Selection>(() => clone(DEFAULT_FILTERS));
  const [applied, setApplied] = useState<Selection>(() => clone(EMPTY));
  const [openDropdown, setOpenDropdown] = useState<FilterDimension | null>(null);
  const [page, setPage] = useState(1);

  const chips = useMemo(
    () =>
      FILTERS.flatMap(({ dimension }) =>
        selected[dimension].map((value) => ({ dimension, value })),
      ),
    [selected],
  );

  const results = useMemo(() => POOL.filter((s) => matches(s, applied)), [applied]);

  const toggleOption = (dimension: FilterDimension, value: string) => {
    setSelected((prev) => {
      const next = clone(prev);
      next[dimension] = next[dimension].includes(value)
        ? next[dimension].filter((v) => v !== value)
        : [...next[dimension], value];
      return next;
    });
  };

  const removeChip = (dimension: FilterDimension, value: string) => {
    setSelected((prev) => {
      const next = clone(prev);
      next[dimension] = next[dimension].filter((v) => v !== value);
      return next;
    });
  };

  const toggleDropdown = (dimension: FilterDimension) =>
    setOpenDropdown((cur) => (cur === dimension ? null : dimension));

  const apply = () => {
    setApplied(clone(selected));
    setOpenDropdown(null);
    setPage(1);
  };

  const clear = () => {
    setSelected(clone(EMPTY));
    setApplied(clone(EMPTY));
    setOpenDropdown(null);
    setPage(1);
  };

  const [feature, secondary, ...grid] = results;

  const totalPages = Math.max(1, Math.ceil(grid.length / GRID_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const gridPage = grid.slice((currentPage - 1) * GRID_PAGE_SIZE, currentPage * GRID_PAGE_SIZE);

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
          {results.length === 0 ? (
            <p className="py-16 text-center text-base font-medium text-neutral-500">
              No fact-checks match your filters. Try removing some.
            </p>
          ) : (
            <>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <StoryCard
                    story={feature}
                    imageClassName="aspect-[16/9]"
                    titleClassName="text-lg"
                    showExcerpt
                    sizes="(max-width: 1024px) 100vw, 800px"
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
                  {gridPage.map((story, i) => (
                    <StoryCard key={`${story.image}-${i}`} story={story} />
                  ))}
                </div>
              )}

              <div className="mt-12">
                <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
