"use client";

import Image from "next/image";
import { useState } from "react";
import { DateRow } from "@/components/ui/MetaRow";
import { Container } from "@/components/ui/SectionHeading";
import { HERO } from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";
import "swiper/css";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

const HERO_GRADIENT =
  "linear-gradient(100.768deg, rgba(4, 26, 109, 0.92) 40%, rgba(4, 26, 109, 0) 70%)";

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

export function FactChecksHero({
  topic = HERO.topic,
  stories,
}: {
  topic?: string;
  stories?: Story[];
}) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  const handleSwiper = (s: SwiperType) => {
    setSwiperInstance(s);
    setDotCount(calcDotCount(s));
  };

  // No curated hero list for this desk (missing, empty, or unreachable) → show
  // the masthead alone with a quiet note, never an empty carousel or static
  // placeholder cards.
  const hasStories = !!stories?.length;

  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/fact-checks/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: HERO_GRADIENT }}
      />

      <Container className="relative pt-16 lg:pt-[88px]">
        <div>
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/80" />
          <h1 className="text-[34px] font-extrabold leading-[1.18] text-white sm:text-[44px] lg:text-[52px]">
            {topic}
          </h1>
        </div>
      </Container>

      {hasStories ? (
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
      ) : (
        <Container className="relative pb-16 pt-8 lg:pb-[88px]">
          <p className="text-base text-white/70">
            No featured fact-checks for this desk yet.
          </p>
        </Container>
      )}
    </section>
  );
}
