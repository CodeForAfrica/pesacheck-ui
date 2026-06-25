"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { Container } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  DEFAULT_FILTERS,
  FILTERS,
  type FilterDimension,
} from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";
import { FilterBar, type Selection } from "./FilterBar";

const EMPTY: Selection = { region: [], language: [], topic: [] };

function clone(sel: Selection): Selection {
  return {
    region: [...sel.region],
    language: [...sel.language],
    topic: [...sel.topic],
  };
}

function matches(story: Story, applied: Selection): boolean {
  return FILTERS.every(({ dimension }) => {
    const wanted = applied[dimension];
    if (wanted.length === 0) return true;
    const value = story[dimension];
    return value != null && wanted.includes(value);
  });
}

/**
 * The `/fact-checks` listing. Pagination is **server-driven**: the parent server
 * page fetches one DB page (`stories`) plus `page`/`totalPages`, and the
 * Pagination bar navigates by `?page=N`, which re-runs the server fetch. The
 * corpus is never loaded into the client.
 */
export function FactChecksExplorer({
  stories,
  page,
  totalPages,
}: {
  stories: Story[];
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // `selected` is the staged set reflected by the dropdowns + chips; `applied`
  // is what actually filters the listing (committed via "Apply Filters"). The
  // page loads showing the design's chips staged but the full listing visible —
  // filtering kicks in once the reader clicks "Apply Filters".
  const [selected, setSelected] = useState<Selection>(() =>
    clone(DEFAULT_FILTERS),
  );
  const [applied, setApplied] = useState<Selection>(() => clone(EMPTY));
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

  const results = useMemo(
    () => stories.filter((s) => matches(s, applied)),
    [stories, applied],
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

  const removeChip = (dimension: FilterDimension, value: string) => {
    setSelected((prev) => {
      const next = clone(prev);
      next[dimension] = next[dimension].filter((v) => v !== value);
      return next;
    });
  };

  const toggleDropdown = (dimension: FilterDimension) =>
    setOpenDropdown((cur) => (cur === dimension ? null : dimension));

  const goToPage = (next: number) => {
    router.push(next <= 1 ? pathname : `${pathname}?page=${next}`);
  };

  const apply = () => {
    setApplied(clone(selected));
    setOpenDropdown(null);
    goToPage(1);
  };

  const clear = () => {
    setSelected(clone(EMPTY));
    setApplied(clone(EMPTY));
    setOpenDropdown(null);
    goToPage(1);
  };

  const [feature, secondary, ...grid] = results;

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
