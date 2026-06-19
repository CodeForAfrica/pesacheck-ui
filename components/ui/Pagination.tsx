/**
 * Numbered pagination bar: ← prev · page numbers (with "…" truncation) · next →.
 * Right-aligned, matching the Figma fact-checks listing. Presentational — the
 * parent owns the current page and total count.
 */

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      {direction === "left" ? (
        <path
          d="M19 12H5M5 12l6-6M5 12l6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M5 12h14M19 12l-6-6M19 12l-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/** Build the visible items: first, last, a window around current, "…" gaps. */
function buildItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | "ellipsis")[] = [1];
  const window = [current - 1, current, current + 1].filter(
    (p) => p > 1 && p < total,
  );

  if (window.length === 0 || window[0] > 2) items.push("ellipsis");
  items.push(...window);
  if (window.length === 0 || window[window.length - 1] < total - 1)
    items.push("ellipsis");
  items.push(total);
  return items;
}

const ARROW_BASE =
  "flex size-10 items-center justify-center rounded-[10px] border-[0.5px] border-neutral-200 transition-colors";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const items = buildItems(page, totalPages);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-end gap-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={atStart}
        onClick={() => onPageChange(page - 1)}
        className={`${ARROW_BASE} ${
          atStart
            ? "cursor-not-allowed text-neutral-300"
            : "text-neutral-900 hover:border-pesacheck-blue hover:text-pesacheck-blue"
        }`}
      >
        <Arrow direction="left" />
      </button>

      {items.map((item, i) => {
        if (item === "ellipsis") {
          const key = i < items.length / 2 ? "ellipsis-start" : "ellipsis-end";
          return (
            <span
              key={key}
              className="flex size-10 items-center justify-center text-sm font-medium text-neutral-400"
            >
              …
            </span>
          );
        }
        return (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`flex size-10 items-center justify-center rounded-[10px] border-[0.5px] text-sm font-semibold transition-colors ${
              item === page
                ? "border-pesacheck-blue text-pesacheck-blue"
                : "border-transparent text-neutral-600 hover:text-pesacheck-blue"
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={atEnd}
        onClick={() => onPageChange(page + 1)}
        className={`${ARROW_BASE} ${
          atEnd
            ? "cursor-not-allowed text-neutral-300"
            : "text-pesacheck-blue hover:border-pesacheck-blue"
        }`}
      >
        <Arrow direction="right" />
      </button>
    </nav>
  );
}
