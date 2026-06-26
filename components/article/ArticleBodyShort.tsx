import Image from "next/image";
import { ArticleTag } from "@/components/article/ArticleTag";
import type { Article } from "@/lib/article-content";

type BodyImage = NonNullable<Article["images"]>[number];

function ImageSlot({ image }: { image?: BodyImage }) {
  if (!image) return null;
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-neutral-100"
      style={{ aspectRatio: (image.ratio ?? "610/350").replace("/", " / ") }}
    >
      {image.src && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 610px"
          className="object-cover"
        />
      )}
    </div>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-5">
      {items.map((p) => (
        <p key={p} className="text-sm font-medium leading-5 text-neutral-900">
          {p}
        </p>
      ))}
    </div>
  );
}

export function ArticleBodyShort({ article }: { article: Article }) {
  const [img0, img1, img2] = article.images ?? [];

  return (
    <div className="w-full min-w-0 lg:w-[610px]">
      <ImageSlot image={img0} />

      {article.leadParagraphs.length > 0 && (
        <div className="mt-8">
          <Paragraphs items={article.leadParagraphs} />
        </div>
      )}

      {img1 && (
        <div className="mt-8">
          <ImageSlot image={img1} />
        </div>
      )}

      {article.bodyParagraphs.length > 0 && (
        <div className="mt-8">
          <Paragraphs items={article.bodyParagraphs} />
        </div>
      )}

      {img2 && (
        <div className="mt-8">
          <ImageSlot image={img2} />
        </div>
      )}

      {article.verdictSummary && (
        <p className="mt-8 text-sm font-semibold leading-5 text-neutral-900">
          {article.verdictSummary}
        </p>
      )}

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
