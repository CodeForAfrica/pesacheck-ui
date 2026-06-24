import { ArrowUpRight } from "@untitledui/icons/ArrowUpRight";
import Image from "next/image";
import type { Story } from "@/lib/home-content";
import { DateRow, TaxonomyRow } from "./MetaRow";
import { VerdictBadge } from "./VerdictBadge";

/** Circular translucent arrow button overlaid on a thumbnail (top-right). */
function ArrowButton() {
  return (
    <span className="flex size-[30px] items-center justify-center rounded-full bg-black/30 backdrop-blur-[2px]">
      <ArrowUpRight size={10} className="brightness-0 invert" aria-hidden />
    </span>
  );
}

export function StoryCard({
  story,
  imageClassName = "aspect-[295/150]",
  showExcerpt = false,
  showTaxonomy = true,
  showDate = true,
  titleClassName = "text-base",
  sizes = "(max-width: 768px) 100vw, 295px",
  priority = false,
  horizontal = false,
}: {
  story: Story;
  imageClassName?: string;
  showExcerpt?: boolean;
  showTaxonomy?: boolean;
  showDate?: boolean;
  titleClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Feature layout: text on the left, image on the right. */
  horizontal?: boolean;
}) {
  return (
    <a
      href={story.href ?? "#"}
      className={`group flex gap-6 outline-none focus-visible:ring-2 focus-visible:ring-pesacheck-blue ${
        horizontal ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      {/* Text — comes first in the DOM so it appears on the left in horizontal mode */}
      {horizontal && (
        <div className="flex flex-1 flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            {showTaxonomy && (
              <TaxonomyRow
                topic={story.topic}
                region={story.region}
                language={story.language}
              />
            )}
            <h3
              className={`font-extrabold leading-6 text-gray-800 ${titleClassName}`}
            >
              {story.title}
            </h3>
            {showExcerpt && story.excerpt && (
              <p className="text-sm font-medium leading-5 text-neutral-900">
                {story.excerpt}
              </p>
            )}
          </div>
          {showDate && <DateRow date={story.date} readTime={story.readTime} />}
        </div>
      )}

      {/* Image */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg ${imageClassName} ${
          horizontal ? "w-full sm:w-[55%]" : "w-full"
        }`}
      >
        <Image
          src={story.image}
          alt={story.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {story.verdict && (
          <span className="absolute left-2.5 top-2.5 z-10">
            <VerdictBadge label={story.verdict} />
          </span>
        )}
        <span className="absolute right-2.5 top-2.5 z-10">
          <ArrowButton />
        </span>
      </div>

      {/* Text — stacked layout only */}
      {!horizontal && (
        <div className="flex flex-col gap-3">
          {showTaxonomy && (
            <TaxonomyRow
              topic={story.topic}
              region={story.region}
              language={story.language}
            />
          )}
          <h3
            className={`font-extrabold leading-6 text-gray-800 ${titleClassName}`}
          >
            {story.title}
          </h3>
          {showExcerpt && story.excerpt && (
            <p className="text-sm font-medium leading-5 text-neutral-900">
              {story.excerpt}
            </p>
          )}
          {showDate && <DateRow date={story.date} readTime={story.readTime} />}
        </div>
      )}
    </a>
  );
}
