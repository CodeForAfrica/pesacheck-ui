/**
 * Placeholder in the shape of a `StoryCard`, shown while a listing is fetched.
 *
 * It mirrors the card's structure rather than approximating it — the same
 * wrapper classes, the same gaps, the same horizontal/stacked split — because
 * a skeleton of the wrong height moves the page twice: once when it appears
 * and again when the results replace it. Keep this in step with `StoryCard`.
 */
function Line({ className }: { className: string }) {
  return <span className={`block rounded bg-neutral-100 ${className}`} />;
}

/** Taxonomy chips, title lines, optional excerpt, then the date row. */
function TextBlock({
  showExcerpt,
  titleHeight,
  horizontal,
}: {
  showExcerpt: boolean;
  titleHeight: string;
  horizontal: boolean;
}) {
  const body = (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Line className="h-5 w-16" />
        <Line className="h-5 w-20" />
      </div>
      <div className="flex flex-col gap-2">
        <Line className={`${titleHeight} w-full`} />
        <Line className={`${titleHeight} w-4/5`} />
      </div>
      {showExcerpt && (
        <div className="flex flex-col gap-2">
          <Line className="h-3 w-full" />
          <Line className="h-3 w-3/4" />
        </div>
      )}
    </div>
  );

  // Horizontal cards push the date row to the bottom of the column, the way
  // `StoryCard` does with justify-between.
  if (horizontal) {
    return (
      <div className="flex flex-1 flex-col justify-between gap-3">
        {body}
        <Line className="h-3 w-24" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {body}
      <Line className="h-3 w-24" />
    </div>
  );
}

export function StoryCardSkeleton({
  imageClassName = "aspect-[295/150]",
  showExcerpt = false,
  horizontal = false,
  titleHeight = "h-4",
}: {
  imageClassName?: string;
  showExcerpt?: boolean;
  /** Feature layout: text on the left, image on the right. */
  horizontal?: boolean;
  /** Matches the card's title size — a feature's title is larger. */
  titleHeight?: string;
}) {
  const text = (
    <TextBlock
      showExcerpt={showExcerpt}
      titleHeight={titleHeight}
      horizontal={horizontal}
    />
  );

  return (
    <div
      className={`flex animate-pulse gap-6 ${
        horizontal ? "flex-col sm:flex-row" : "flex-col"
      }`}
      aria-hidden
    >
      {horizontal && text}
      <div
        className={`shrink-0 rounded-lg bg-neutral-100 ${imageClassName} ${
          horizontal ? "w-full sm:w-[55%]" : "w-full"
        }`}
      />
      {!horizontal && text}
    </div>
  );
}

/**
 * A grid of placeholder cards. `count` should match what the listing usually
 * returns, so the page keeps roughly its height across the swap.
 */
export function StoryGridSkeleton({
  count = 8,
  className = "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no id
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
