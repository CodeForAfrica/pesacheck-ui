import Image from "next/image";
import type { Story } from "@/lib/home-content";
import { Icon } from "./Icon";
import { VerdictBadge } from "./VerdictBadge";
import { DateRow, TaxonomyRow } from "./MetaRow";

/** Circular translucent arrow button overlaid on a thumbnail (top-right). */
function ArrowButton() {
  return (
    <span className="flex size-[30px] items-center justify-center rounded-full bg-black/30 backdrop-blur-[2px]">
      <Icon name="arrow-up-right" size={10} className="brightness-0 invert" />
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
}: {
  story: Story;
  imageClassName?: string;
  showExcerpt?: boolean;
  showTaxonomy?: boolean;
  showDate?: boolean;
  titleClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <a
      href={story.href ?? "#"}
      className="group flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-pesacheck-blue"
    >
      <div className={`relative w-full overflow-hidden rounded-lg ${imageClassName}`}>
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

      {showTaxonomy && (
        <TaxonomyRow topic={story.topic} region={story.region} language={story.language} />
      )}

      <h3
        className={`font-extrabold leading-6 text-gray-800 ${titleClassName}`}
      >
        {story.title}
      </h3>

      {showExcerpt && story.excerpt && (
        <p className="text-sm font-medium leading-5 text-neutral-900">{story.excerpt}</p>
      )}

      {showDate && <DateRow date={story.date} readTime={story.readTime} />}
    </a>
  );
}
