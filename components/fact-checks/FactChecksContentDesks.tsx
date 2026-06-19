import { ContentDesksRow } from "@/components/ui/ContentDesksRow";
import { Container } from "@/components/ui/SectionHeading";

// `activeSlug` defaults to "climate-change" — the desk highlighted in the Figma
// design for the main fact-checks page. The single-desk page passes its own slug.
export function FactChecksContentDesks({
	activeSlug = "climate-change",
}: {
	activeSlug?: string;
}) {
	return (
		<section className="pb-16 lg:pb-20">
			<Container>
				<div className="flex items-center gap-4">
					<span className="h-10 w-[3px] shrink-0 rounded bg-pesacheck-blue" />
					<h2 className="text-2xl font-extrabold leading-10 text-gray-800 md:text-[30px]">
						Content Desks
					</h2>
				</div>

				<ContentDesksRow activeSlug={activeSlug} />
			</Container>
		</section>
	);
}
