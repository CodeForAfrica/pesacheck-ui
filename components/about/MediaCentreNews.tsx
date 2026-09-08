import Image from "next/image";
import { FiCalendar, FiClock } from "react-icons/fi";
import { TaxonomyRow } from "@/components/ui/MetaRow";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { NEWS, NEWS_LIMIT, type NewsItem } from "@/lib/media-centre-content";

/*
 * Clippings, not fact-checks: the cards drop the verdict pill and the overlaid
 * arrow of `StoryCard`, and carry a quieter meta line, so they read as coverage
 * *about* PesaCheck rather than as stories to open.
 */
function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a href={item.href} className="group flex flex-col">
      <div className="relative aspect-[146/91] w-full overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 292px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <TaxonomyRow topic={item.outlet} />
        <h3 className="text-sm font-bold leading-[21px] tracking-[-0.01em] text-pesacheck-black transition-colors group-hover:text-pesacheck-blue">
          {item.title}
        </h3>
        <div className="flex items-center gap-3 text-xs leading-[1.4] text-[#8b9099]">
          <span className="flex items-center gap-[5px]">
            <FiCalendar size={14} aria-hidden />
            {item.date}
          </span>
          <span className="flex items-center gap-[5px]">
            <FiClock size={14} aria-hidden />
            {item.readTime}
          </span>
        </div>
      </div>
    </a>
  );
}

export function MediaCentreNews({
  items = NEWS,
  limit = NEWS_LIMIT,
  title = "In the news",
  bare = false,
}: {
  items?: NewsItem[];
  limit?: number;
  /** The page section's heading, when placed rather than hardcoded. */
  title?: string;
  bare?: boolean;
}) {
  const inner = (
    <>
      <SectionHeading title={title} />
      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, limit).map((item) => (
          <NewsCard key={item.title} item={item} />
        ))}
      </div>
    </>
  );

  if (bare) return inner;

  return (
    <section className="bg-neutral-50 py-14 lg:py-16">
      <Container>{inner}</Container>
    </section>
  );
}
