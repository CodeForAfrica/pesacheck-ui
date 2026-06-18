"use client";

import { useState } from "react";
import type { Story } from "@/lib/home-content";
import { StoryCard } from "@/components/ui/StoryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

const PAGE_SIZE = 4;

export function RelatedStories({ stories }: { stories: Story[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(stories.length / PAGE_SIZE);
  const visible = stories.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="bg-neutral-50 py-14">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[100px]">
        {/* Heading + nav arrows */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <SectionHeading title="Related Stories" />
          {totalPages > 1 && (
            <div className="mt-1 flex shrink-0 items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous page"
                className="flex size-[38px] items-center justify-center rounded-full bg-neutral-200 transition-colors hover:bg-neutral-300 disabled:opacity-40"
              >
                <Icon name="chevron-left" size={18} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next page"
                className="flex size-[38px] items-center justify-center rounded-full bg-neutral-200 transition-colors hover:bg-neutral-300 disabled:opacity-40"
              >
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Story grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((story, i) => (
            <StoryCard
              key={i}
              story={story}
              imageClassName="aspect-[295/150]"
              showExcerpt={false}
              showTaxonomy={true}
              showDate={true}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 295px"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
