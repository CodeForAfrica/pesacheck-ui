import { Calendar } from "@untitledui/icons/Calendar";
import { Clock } from "@untitledui/icons/Clock";
import { User03 } from "@untitledui/icons/User03";
import Image from "next/image";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import type { Article } from "@/lib/article-content";
import { ShareButtons } from "./ShareButtons";

/** Tag chip shown on the hero (links to filtered fact-checks). */
function HeroTag({ label }: { label: string }) {
  return (
    <a
      href={`/fact-checks?topic=${encodeURIComponent(label)}`}
      className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
    >
      {label}
    </a>
  );
}

export function ArticleHero({ article }: { article: Article }) {
  return (
    <section className="relative h-[480px] w-full overflow-hidden md:h-[560px] lg:h-[640px]">
      {/* Background image */}
      <Image
        src={article.image}
        alt={article.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Gradient overlay — stronger at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Verdict badge — top-left on the image */}
      {article.verdict && (
        <span className="absolute left-6 top-6 z-10 lg:left-[100px] lg:top-8">
          <VerdictBadge label={article.verdict} />
        </span>
      )}

      {/* Main hero content anchored to the bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-8 lg:px-[100px] lg:pb-[50px]">
        {/* White accent rule */}
        <div className="mb-3 h-[3px] w-[190px] rounded-full bg-white" />

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <HeroTag key={tag} label={tag} />
          ))}
        </div>

        {/* Title */}
        <h1 className="mb-5 max-w-[1029px] text-2xl font-black leading-tight text-white md:text-4xl lg:text-[52px] lg:leading-[60px]">
          {article.title}
        </h1>

        {/* Meta bar: date/author (left) + share (right) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Date · read-time · author */}
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-white">
            <span className="flex items-center gap-[5px]">
              <Calendar size={20} className="brightness-0 invert" aria-hidden />
              {article.date}
            </span>
            <span className="size-1.5 rounded-full bg-white/60" />
            <span className="flex items-center gap-[5px]">
              <Clock size={20} className="brightness-0 invert" aria-hidden />
              {article.readTime}
            </span>
            <span className="size-1.5 rounded-full bg-white/60" />
            <span className="flex items-center gap-[5px]">
              <User03 size={20} className="brightness-0 invert" aria-hidden />
              {article.author}
            </span>
          </div>

          {/* Share buttons */}
          <ShareButtons title={article.title} />
        </div>
      </div>
    </section>
  );
}
