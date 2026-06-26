"use client";

import { useMemo, useState } from "react";
import { FilterBar, type Selection } from "@/components/fact-checks/FilterBar";
import { Container } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  FEATURE,
  FEATURE_SECONDARY,
  FILTERS,
  type FilterDimension,
  filterLabel,
  STORIES,
} from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";

const POOL: Story[] = [FEATURE, FEATURE_SECONDARY, ...STORIES];

const EMPTY: Selection = { region: [], language: [], topic: [] };

function clone(sel: Selection): Selection {
  return {
    region: [...sel.region],
    language: [...sel.language],
    topic: [...sel.topic],
  };
}

function matchesFilters(story: Story, applied: Selection): boolean {
  // The static search pool is tagged with display labels, while the filter bar
  // emits taxonomy codes — resolve codes to labels before comparing.
  return FILTERS.every(({ dimension }) => {
    const wanted = applied[dimension];
    if (wanted.length === 0) return true;
    const value = story[dimension];
    return (
      value != null &&
      wanted.some((code) => filterLabel(dimension, code) === value)
    );
  });
}

function matchesQuery(story: Story, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    story.title.toLowerCase().includes(q) ||
    (story.topic?.toLowerCase().includes(q) ?? false) ||
    (story.region?.toLowerCase().includes(q) ?? false) ||
    (story.language?.toLowerCase().includes(q) ?? false)
  );
}

function SearchIllustration() {
  return (
    <div className="relative h-[128px] w-[172px]">
      {/* Background circle */}
      <div className="absolute left-[22px] top-0 size-[128px] rounded-full bg-neutral-100" />
      {/* Small decorative circles */}
      <div className="absolute left-[14px] top-[14px] size-3 rounded-full bg-neutral-200" />
      <div className="absolute bottom-[10px] left-[9px] size-4 rounded-full bg-neutral-200" />
      <div className="absolute right-[6px] top-[28px] size-4 rounded-full bg-neutral-200" />
      <div className="absolute right-[14px] top-1 size-[10px] rounded-full bg-neutral-300" />
      {/* Cloud shape (simplified) */}
      <svg
        className="absolute left-[16px] top-[16px]"
        width="140"
        height="80"
        viewBox="0 0 140 80"
        fill="none"
        aria-hidden
      >
        <path
          d="M110 55H30a20 20 0 0 1 0-40 19.8 19.8 0 0 1 5 .63A30 30 0 0 1 95 32a20 20 0 0 1 15 23z"
          fill="#e5e7eb"
        />
      </svg>
      {/* Search icon circle */}
      <div className="absolute bottom-0 left-[58px] flex size-14 items-center justify-center rounded-full bg-black/20 backdrop-blur-[4px]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
          <path
            d="M16.5 16.5L21 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function SearchExplorer({ query }: { query: string }) {
  const [selected, setSelected] = useState<Selection>(() => clone(EMPTY));
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
    () =>
      POOL.filter((s) => matchesQuery(s, query) && matchesFilters(s, applied)),
    [query, applied],
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

  const apply = () => {
    setApplied(clone(selected));
    setOpenDropdown(null);
  };

  const clear = () => {
    setSelected(clone(EMPTY));
    setApplied(clone(EMPTY));
    setOpenDropdown(null);
  };

  const hasResults = results.length > 0;

  if (!hasResults) {
    return (
      <>
        {/* No results empty state */}
        <section className="py-16">
          <Container>
            <div className="flex flex-col items-center gap-8 text-center">
              <SearchIllustration />
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold text-neutral-800">
                  No matches found
                </p>
                <p className="text-sm font-medium text-neutral-600">
                  Your search for &ldquo;{query}&rdquo; did not match any
                  article. Please try again.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Latest Articles fallback */}
        <section className="py-14 lg:py-20">
          <Container>
            <div className="mb-8 border-l-[3px] border-pesacheck-black pl-4">
              <h2 className="text-[30px] font-extrabold leading-10 text-gray-800">
                Latest Articles
              </h2>
            </div>
            <div className="mt-1 h-px w-full bg-neutral-100" />
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {POOL.slice(0, 7).map((story) => (
                <StoryCard key={story.href ?? story.title} story={story} />
              ))}
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Results summary */}
      <section className="pt-10 pb-4 text-center">
        <p className="text-sm font-medium text-neutral-700">
          {results.length >= 20 ? "20+" : results.length} results found for:
        </p>
        <p className="mt-1 text-lg font-extrabold text-neutral-900">
          &ldquo;{query}&rdquo;
        </p>
      </section>

      {/* Filter panel */}
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

      {/* Results grid */}
      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((story) => (
              <StoryCard key={story.href ?? story.title} story={story} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
