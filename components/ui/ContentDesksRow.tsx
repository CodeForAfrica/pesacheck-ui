import Image from "next/image";
import Link from "next/link";
import { CONTENT_DESKS, type ContentDesk } from "@/lib/content-desks";

/**
 * Horizontally scrolling row of content-desk thumbnails. Each desk links to its
 * landing page at `/fact-checks/<slug>`. Pass `activeSlug` to highlight the desk
 * for the page currently being viewed (used on the single-desk page). `desks`
 * defaults to the static catalog; the home page passes live (Hasura) data.
 */
export function ContentDesksRow({
  activeSlug,
  desks = CONTENT_DESKS,
}: {
  activeSlug?: string;
  desks?: ContentDesk[];
}) {
  return (
    <div className="mt-8 flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {desks.map((desk) => {
        const isActive = desk.slug === activeSlug;
        return (
          <Link
            key={desk.slug}
            href={`/fact-checks/${desk.slug}`}
            className="flex w-[160px] shrink-0 flex-col gap-2 text-left outline-none sm:w-[190px]"
          >
            <span className="relative h-[84px] w-full overflow-hidden rounded-lg">
              <Image
                src={desk.image}
                alt={desk.name}
                fill
                sizes="190px"
                className="object-cover"
              />
              {isActive && (
                <span className="absolute inset-0 bg-pesacheck-blue/70" />
              )}
            </span>
            <span
              className={`text-base font-bold ${isActive ? "text-pesacheck-blue" : "text-neutral-800"}`}
            >
              {desk.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
