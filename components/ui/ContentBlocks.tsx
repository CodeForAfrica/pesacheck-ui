import Image from "next/image";
import { RichText } from "@/components/ui/RichText";
import type { ContentBlock } from "@/lib/content-blocks";

/**
 * Renders a section's ordered `ContentBlock[]` — paragraphs and list items
 * through `RichText` (links + bold), images as captioned figures sized for
 * the 610px reading column. Shared by the About-page bodies (Methodology,
 * Principles, Funding).
 */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block) =>
        block.type === "p" ? (
          <p key={block.text}>
            <RichText text={block.text} />
          </p>
        ) : block.type === "ul" ? (
          <ul key={block.items[0]} className="list-disc pl-5">
            {block.items.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        ) : (
          <figure key={block.src}>
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(max-width: 1024px) 100vw, 610px"
              className="w-full rounded-lg"
            />
            {block.caption && (
              <figcaption className="mt-2 text-xs font-medium text-neutral-500">
                {block.caption}
              </figcaption>
            )}
          </figure>
        ),
      )}
    </>
  );
}
