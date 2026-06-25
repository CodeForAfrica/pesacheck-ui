import Image from "next/image";
import type { Article } from "@/lib/article-content";

/** Small tag chip at end-of-article. */
function ArticleTag({ label }: { label: string }) {
  return (
    <a
      href={`/fact-checks?topic=${encodeURIComponent(label)}`}
      className="rounded-lg bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
    >
      {label}
    </a>
  );
}

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="w-full min-w-0 lg:w-[610px]">
      {/* Lead paragraphs */}
      <div className="flex flex-col gap-5">
        {article.leadParagraphs.map((p) => (
          <p key={p} className="text-sm font-medium leading-5 text-neutral-900">
            {p}
          </p>
        ))}
      </div>

      {/* Inline image */}
      {article.inlineImage && (
        <div className="relative mt-8 h-[300px] w-full overflow-hidden rounded-lg md:h-[350px]">
          <Image
            src={article.inlineImage.src}
            alt={article.inlineImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 610px"
            className="object-cover"
          />
        </div>
      )}

      {/* Body paragraphs after image */}
      {article.bodyParagraphs.length > 0 && (
        <div className="mt-8 flex flex-col gap-5">
          {article.bodyParagraphs.map((p) => (
            <p
              key={p}
              className="text-sm font-medium leading-5 text-neutral-900"
            >
              {p}
            </p>
          ))}
        </div>
      )}

      {/* End-of-article tags */}
      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2.5">
          {article.tags.map((tag) => (
            <ArticleTag key={tag} label={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
