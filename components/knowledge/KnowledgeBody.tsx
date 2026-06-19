import { KnowledgeNav } from "@/components/knowledge/KnowledgeNav";
import { Icon } from "@/components/ui/Icon";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
	KNOWLEDGE_SECTIONS,
	type KnowledgeSection,
	type Placeholder,
} from "@/lib/knowledge-content";

function ImageBlock({ image }: { image: Placeholder }) {
	return (
		<div
			className={`rounded-2xl bg-neutral-100 ${
				image.wide ? "col-span-2 aspect-[610/350]" : "aspect-[295/230]"
			}`}
			aria-hidden
		/>
	);
}

function Section({ section }: { section: KnowledgeSection }) {
	return (
		<section id={section.id} className="scroll-mt-28">
			<SectionHeading title={section.title} />

			{/* Body content sits in a 610px column on the left of the section. */}
			<div className="mt-8 max-w-[610px]">
				<div className="space-y-5 text-sm font-medium leading-5 text-neutral-900">
					{section.body.map((para) => (
						<p key={para}>{para}</p>
					))}

					{section.fundingItems && (
						<ul className="list-disc space-y-1 pl-5">
							{section.fundingItems.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					)}

					{section.closing && <p>{section.closing}</p>}
				</div>

				<button
					type="button"
					className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-pesacheck-blue transition-colors hover:text-pesacheck-black"
				>
					Learn More
					<Icon name="arrow-up-right" size={20} />
				</button>

				<div className="mt-10 grid grid-cols-2 gap-5">
					{section.images.map((image, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: placeholder images have no stable id
						<ImageBlock key={i} image={image} />
					))}
				</div>
			</div>
		</section>
	);
}

export function KnowledgeBody() {
	const navItems = KNOWLEDGE_SECTIONS.map((s) => ({
		id: s.id,
		label: s.title,
	}));

	return (
		<Container className="py-16 lg:py-20">
			<div className="grid gap-10 lg:grid-cols-[180px_1fr] lg:gap-14">
				<KnowledgeNav items={navItems} />
				<div className="space-y-20">
					{KNOWLEDGE_SECTIONS.map((section) => (
						<Section key={section.id} section={section} />
					))}
				</div>
			</div>
		</Container>
	);
}
