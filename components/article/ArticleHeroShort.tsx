import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import type { Article } from "@/lib/article-content";

/** Tiny dot separator between meta items. */
function Dot() {
  return <span className="size-1.5 shrink-0 rounded-full bg-neutral-300" />;
}

export function ArticleHeroShort({ article }: { article: Article }) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-[100px] lg:pt-[60px]">
      <div className="lg:pl-[315px]">
        <div className="max-w-[610px]">
          {article.verdict && (
            <span className="inline-flex items-center justify-center rounded-lg bg-red-400 px-3 py-1.5 text-sm font-medium text-white">
              {article.verdict}
            </span>
          )}

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-pesacheck-black md:text-4xl lg:text-[44px] lg:leading-[52px]">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-900">
            <span className="flex items-center gap-[5px]">
              <FiCalendar size={20} aria-hidden />
              {article.date}
            </span>
            <Dot />
            <span className="flex items-center gap-[5px]">
              <FiClock size={20} aria-hidden />
              {article.readTime}
            </span>
            <Dot />
            <span className="flex items-center gap-[5px]">
              <FiUser size={20} aria-hidden />
              {article.author}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
