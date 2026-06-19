/**
 * "Coming Soon" placeholder band — fills the airy whitespace between the hero
 * and footer in the Figma frame, with the message vertically centred. The label
 * is configurable so it can be reused across pages (e.g. "Content Coming Soon").
 */
export function ComingSoon({ label = "Coming Soon" }: { label?: string }) {
	return (
		<section className="flex min-h-[440px] items-center justify-center px-5 py-24 sm:min-h-[560px] lg:min-h-[720px]">
			<p className="text-[28px] font-bold leading-tight text-pesacheck-black sm:text-[32px]">
				{label}
			</p>
		</section>
	);
}
