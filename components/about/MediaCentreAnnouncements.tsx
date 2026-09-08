import { FiArrowUpRight } from "react-icons/fi";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENTS_LIMIT,
  type Announcement,
} from "@/lib/media-centre-content";

export function MediaCentreAnnouncements({
  announcements = ANNOUNCEMENTS,
  limit = ANNOUNCEMENTS_LIMIT,
  title = "Announcements",
  bare = false,
}: {
  announcements?: Announcement[];
  limit?: number;
  /** The page section's heading, when placed rather than hardcoded. */
  title?: string;
  bare?: boolean;
}) {
  const inner = (
    <>
      <SectionHeading title={title} />

      <ul className="mt-9">
        {announcements.slice(0, limit).map((item) => (
          <li
            key={item.title}
            className="border-b border-neutral-100 first:border-t"
          >
            <div className="flex flex-col gap-4 pb-7 pt-5 sm:flex-row sm:items-start sm:gap-8">
              <div className="shrink-0 sm:w-[190px]">
                <p className="text-xs leading-[18px] text-neutral-600">
                  {item.date}
                </p>
                {/* Live announcements may carry no topic to tag with. */}
                {item.tag && (
                  <span className="mt-3 inline-block rounded-full border border-neutral-100 px-3.5 py-1 text-xs leading-[18px] text-neutral-600">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-[18px] font-bold leading-[26px] text-pesacheck-black">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[560px] text-sm leading-6 text-neutral-800">
                  {item.excerpt}
                </p>
              </div>

              <a
                href={item.href}
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-pesacheck-black transition-colors hover:text-pesacheck-blue sm:self-center"
              >
                Read
                <FiArrowUpRight size={14} aria-hidden />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  if (bare) return inner;

  return (
    <section className="py-14 lg:py-16">
      <Container>{inner}</Container>
    </section>
  );
}
