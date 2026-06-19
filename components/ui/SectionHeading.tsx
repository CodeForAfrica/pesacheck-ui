import type { ReactNode } from "react";

/**
 * Section heading: blue accent bar + bold title, with a full-width divider
 * carrying a short blue underline segment beneath the title. Matches Figma
 * "Spotlight" / "Trending Stories" / "Latest Stories" headings.
 */
export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="h-10 w-[3px] shrink-0 rounded bg-pesacheck-blue" />
          <h2 className="text-2xl font-extrabold leading-10 text-gray-800 md:text-[30px]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="relative mt-5 h-px w-full bg-neutral-100">
        <span className="absolute left-0 top-0 h-px w-40 bg-pesacheck-blue" />
      </div>
    </div>
  );
}

/** Shared page container — 1240px content width within the 1440 frame. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-0 ${className}`}
    >
      {children}
    </div>
  );
}
