/**
 * The translucent verdict pill shown over story thumbnails (e.g. "Partly False").
 * Matches Figma: rgba(18,26,44,0.5) bg over a 3px backdrop blur, 6px radius,
 * 12px semibold white. `leading-[normal]` because the spec's `font` shorthand
 * resets line-height — the `text-xs` token's 18px would make the pill taller.
 */
export function VerdictBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md bg-[#121a2c]/50 px-[13px] py-1.5 text-xs font-semibold leading-[normal] text-white backdrop-blur-[3px]">
      {label}
    </span>
  );
}
