import type { ReactNode } from "react";

/**
 * Section heading: navy accent bar + bold title over a full-width hairline
 * divider, with an optional action (a "Show more" link, carousel arrows) on
 * the right. Matches Figma "Spotlight" / "Fact Checks" / "More than
 * fact-checking" headings.
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
          <span className="h-[30px] w-[5px] shrink-0 bg-pesacheck-black" />
          <h2 className="text-2xl font-extrabold leading-10 text-pesacheck-black md:text-[30px]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-4 h-px w-full bg-neutral-100" />
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
      className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10 [@media(min-width:1320px)]:px-0 ${className}`}
    >
      {children}
    </div>
  );
}
