import { MethodologySectionNav } from "@/components/about/MethodologySectionNav";
import { Icon } from "@/components/ui/Icon";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
	type ImageSlot,
	METHODOLOGY_SECTIONS,
	type MethodologySection,
} from "@/lib/methodology-content";

// Grey placeholder boxes mirror the design's image rectangles until real assets
// land. "small" boxes pair in a 2-col grid; "large" spans the reading column.
function PlaceholderImage({ slot }: { slot: ImageSlot }) {
	return (
		<div
			className={`w-full rounded-lg bg-neutral-100 ${
				slot === "small" ? "aspect-[295/230]" : "aspect-[610/350]"
			}`}
			aria-hidden="true"
		/>
	);
}

function SectionImages({ images }: { images: ImageSlot[] }) {
	const small = images.filter((slot) => slot === "small");
	const large = images.filter((slot) => slot === "large");

	return (
		<div className="mt-8 flex flex-col gap-5">
			{small.length > 0 && (
				<div className="grid grid-cols-2 gap-5">
					{small.map((slot, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: placeholder images have no stable id
						<PlaceholderImage key={`s-${i}`} slot={slot} />
					))}
				</div>
			)}
			{large.map((slot, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: placeholder images have no stable id
				<PlaceholderImage key={`l-${i}`} slot={slot} />
			))}
		</div>
	);
}

function Section({ section }: { section: MethodologySection }) {
	return (
		<section id={section.id} className="scroll-mt-28">
			<SectionHeading title={section.title} />

			<div className="mt-8 max-w-[610px]">
				<div className="flex flex-col gap-5 text-sm font-medium leading-5 text-neutral-900">
					{section.blocks.map((block) =>
						block.type === "p" ? (
							<p key={block.text}>{block.text}</p>
						) : (
							<ul key={block.items[0]} className="list-disc pl-5">
								{block.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						),
					)}
				</div>

				{section.learnMore && (
					<button
						type="button"
						className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 transition-colors hover:text-pesacheck-blue"
					>
						Learn More
						<Icon name="arrow-up-right" size={20} />
					</button>
				)}

				<SectionImages images={section.images} />
			</div>
		</section>
	);
}

export function MethodologyBody() {
	return (
		<Container className="py-14 lg:py-[70px]">
			<div className="grid gap-12 lg:grid-cols-[180px_1fr] lg:gap-16">
				<MethodologySectionNav
					items={METHODOLOGY_SECTIONS.map((s) => ({
						id: s.id,
						title: s.title,
					}))}
				/>
				<div className="flex flex-col gap-16 lg:gap-20">
					{METHODOLOGY_SECTIONS.map((section) => (
						<Section key={section.id} section={section} />
					))}
				</div>
			</div>
		</Container>
	);
}
