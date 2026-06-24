"use client";

import { ChevronLeft } from "@untitledui/icons/ChevronLeft";
import { ChevronRight } from "@untitledui/icons/ChevronRight";
import { useRef } from "react";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import { TRENDING } from "@/lib/home-content";

export function TrendingStories() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section id="trending" className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          title="Trending Stories"
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scroll(-1)}
                className="flex size-9 items-center justify-center rounded-full bg-neutral-300 text-white transition-colors hover:bg-neutral-400"
              >
                <ChevronLeft size={18} aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scroll(1)}
                className="flex size-9 items-center justify-center rounded-full bg-neutral-300 text-white transition-colors hover:bg-neutral-400"
              >
                <ChevronRight size={18} aria-hidden />
              </button>
            </div>
          }
        />

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TRENDING.map((story) => (
            <div
              key={story.href ?? story.title}
              className="w-[280px] shrink-0 snap-start sm:w-[295px]"
            >
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
