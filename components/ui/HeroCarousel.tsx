"use client";

import Image from "next/image";
import { useState } from "react";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { DateRow } from "@/components/ui/MetaRow";
import type { Story } from "@/lib/home-content";

// Mirrors Container's left padding exactly: px-5 / sm:px-8 / lg:centered with max-w-[1240px]
const INDENT = "pl-5 sm:pl-8 lg:pl-[max(0px,calc((100vw-1240px)/2))]";

function PreviewCard({ story }: { story: Story }) {
  return (
    <a
      href={story.href ?? "#"}
      className="flex h-[160px] w-[340px] items-start gap-4 rounded-[10px] border-[0.5px] border-white/80 bg-white/70 p-[15px] backdrop-blur-[5px] sm:w-[400px]"
    >
      <div className="relative size-[130px] shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={story.image}
          alt={story.alt}
          fill
          sizes="130px"
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-col justify-between py-1">
        <p className="text-sm font-bold leading-5 text-gray-800">
          {story.title}
        </p>
        <DateRow date={story.date} readTime={story.readTime} />
      </div>
    </a>
  );
}

function calcDotCount(s: SwiperType): number {
  if (!s.slides.length) return 1;
  const gap = (s.params.spaceBetween as number) ?? 0;
  const slideWidth = (s.slides[0] as HTMLElement).offsetWidth + gap;
  const visible = Math.floor(s.width / slideWidth);
  return Math.max(1, s.slides.length - visible + 1);
}

/**
 * The hero preview carousel shared by the homepage (`Hero`) and content-desk
 * (`FactChecksHero`) heroes: a free-mode Swiper of story preview cards with a
 * synced dot pager. Bleeds to the right (overflow-visible) and is left-aligned
 * to the page `Container` via `INDENT` — pure CSS, no JS measurement, no flash.
 *
 * Slide/dot keys combine the unique `href` with the index, so live stories
 * sharing a placeholder image (or static fallbacks sharing a title) can't
 * collide into duplicate React keys.
 */
export function HeroCarousel({ stories }: { stories: Story[] }) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  const handleSwiper = (s: SwiperType) => {
    setSwiperInstance(s);
    setDotCount(calcDotCount(s));
  };

  return (
    <div className="relative mt-12 pb-10 lg:pb-[88px]">
      <div className={INDENT}>
        <Swiper
          modules={[FreeMode]}
          slidesPerView="auto"
          spaceBetween={20}
          freeMode
          grabCursor
          className="!overflow-visible [&_.swiper-slide]:mr-5"
          slidesOffsetAfter={20}
          onSwiper={handleSwiper}
          onRealIndexChange={(s: SwiperType) => setActiveIndex(s.realIndex)}
          onResize={(s: SwiperType) => setDotCount(calcDotCount(s))}
        >
          {stories.map((story, i) => (
            <SwiperSlide
              key={story.href ?? `${story.image}-${i}`}
              className="!w-auto"
            >
              <PreviewCard story={story} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={`mt-4 flex items-center gap-2 ${INDENT}`}>
        {stories.slice(0, dotCount).map((story, i) => (
          <button
            key={`dot-${story.href ?? `${story.image}-${i}`}`}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => swiperInstance?.slideTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
