/**
 * Placeholder in the shape of a `StoryCard`, shown while a listing is being
 * fetched.
 *
 * It mirrors the card's real proportions — same image ratio, same number of
 * text lines, same gaps — so the grid does not jump when results arrive.
 * Deliberately not animated beyond a slow pulse: a filter change usually
 * resolves in well under a second, and anything busier reads as an error.
 */
function Line({ className = "" }: { className?: string }) {
  return <span className={`block rounded bg-neutral-100 ${className}`} />;
}

export function StoryCardSkeleton({
  imageClassName = "aspect-[295/150]",
  showExcerpt = false,
}: {
  imageClassName?: string;
  showExcerpt?: boolean;
}) {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className={`w-full rounded-lg bg-neutral-100 ${imageClassName}`} />
      <div className="mt-4 flex flex-col gap-2">
        {/* Verdict badge and taxonomy row */}
        <div className="flex gap-2">
          <Line className="h-5 w-16" />
          <Line className="h-5 w-20" />
        </div>
        {/* Title, two lines — the length most titles wrap to */}
        <Line className="mt-1 h-4 w-full" />
        <Line className="h-4 w-4/5" />
        {showExcerpt && (
          <>
            <Line className="mt-1 h-3 w-full" />
            <Line className="h-3 w-3/4" />
          </>
        )}
        {/* Date and read time */}
        <Line className="mt-1 h-3 w-24" />
      </div>
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
