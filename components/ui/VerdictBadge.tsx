/**
 * The translucent verdict pill shown over story thumbnails (e.g. "Partly False").
 * Matches Figma: rgba(0,0,0,0.3) bg, 10px radius, text-xs medium white.
 */
export function VerdictBadge({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center justify-center rounded-[10px] bg-black/30 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-[2px]">
			{label}
		</span>
	);
}
