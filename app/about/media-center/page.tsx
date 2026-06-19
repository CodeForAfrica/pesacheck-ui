import type { Metadata } from "next";
import { MediaCentreHero } from "@/components/about/MediaCentreHero";
import { SectionHeading, Container } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
	title: "Media Centre — PesaCheck",
	description:
		"Where PesaCheck has been cited in research and other major publications.",
};

const SECTIONS = [
	{ title: "In Research", shade: false },
	{ title: "In the News", shade: true },
	{ title: "Announcements", shade: false },
	{ title: "Event Spotlight", shade: true },
];

export default function MediaCentrePage() {
	return (
		<>
			<MediaCentreHero />

			{SECTIONS.map(({ title, shade }) => (
				<section
					key={title}
					className={shade ? "bg-neutral-50" : "bg-white"}
				>
					<Container className="py-14 sm:py-16 lg:py-20">
						<SectionHeading title={title} />
						<div className="mt-10 flex min-h-[120px] items-center justify-center">
							<p className="text-sm font-medium text-neutral-400">
								Content coming soon
							</p>
						</div>
					</Container>
				</section>
			))}
		</>
	);
}
