import Link from "next/link";
import { Container } from "@/components/ui/SectionHeading";
import { FAQ_CTA } from "@/lib/faqs-content";

// "Still have questions?" call-out bar (Figma node 2866:4133): a light-grey
// rounded panel with copy on the left and a dark "Get in touch" button on the
// right, stacking on mobile.
export function FaqCta() {
	return (
		<section className="pb-16 sm:pb-20">
			<Container>
				<div className="flex flex-col items-start gap-6 rounded-2xl bg-neutral-50 p-8 sm:flex-row sm:items-center sm:justify-between">
					<div className="max-w-[768px]">
						<p className="text-base font-bold text-[#181d27]">
							{FAQ_CTA.heading}
						</p>
						<p className="mt-2 text-sm font-medium text-[#535862]">
							{FAQ_CTA.body}
						</p>
					</div>
					<Link
						href={FAQ_CTA.href}
						className="shrink-0 rounded-[10px] bg-neutral-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
					>
						{FAQ_CTA.buttonLabel}
					</Link>
				</div>
			</Container>
		</section>
	);
}
