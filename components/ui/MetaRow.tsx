import { Fragment } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";

/**
 * Taxonomy row: Topic · Region · Language (text-xs, tiny 2px dot separators).
 * Renders only the dimensions that are present — live articles may carry just
 * some of them — so a missing value never leaks a placeholder label. Renders
 * nothing when an article carries no taxonomy at all (the "Topic · Region ·
 * Language" placeholders are design scaffolding, never shown to readers).
 */
export function TaxonomyRow({
  topic,
  region,
  language,
}: {
  topic?: string;
  region?: string;
  language?: string;
}) {
  const parts = [topic, region, language].filter(Boolean) as string[];
  if (parts.length === 0) return null;
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-neutral-900">
      {parts.map((part, i) => (
        <Fragment key={part}>
          {i > 0 && <Dot />}
          <span>{part}</span>
        </Fragment>
      ))}
    </div>
  );
}

/** Date / read-time row: calendar · clock (text-sm, 6px dot separator). */
export function DateRow({
  date = "Jul 28",
  readTime = "3 min",
}: {
  date?: string;
  readTime?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
      <span className="flex items-center gap-[5px]">
        <FiCalendar size={20} aria-hidden />
        {date}
      </span>
      <span className="size-1.5 shrink-0 rounded-full bg-neutral-300" />
      <span className="flex items-center gap-[5px]">
        <FiClock size={20} aria-hidden />
        {readTime}
      </span>
    </div>
  );
}

function Dot() {
  return <span className="size-[2px] shrink-0 rounded-full bg-neutral-900" />;
}
