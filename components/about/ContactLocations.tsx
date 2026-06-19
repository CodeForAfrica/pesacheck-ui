import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_LOCATIONS, type LocationCard } from "@/lib/contact-content";

function LocationTile({ loc }: { loc: LocationCard }) {
	return (
		<div className="rounded-lg border border-neutral-100 bg-white p-4">
			<p className="text-sm font-bold text-neutral-900">{loc.country}</p>
			{loc.city && (
				<p className="text-xs font-medium text-neutral-500">{loc.city}</p>
			)}
			<div className="mt-3 flex flex-col gap-1 text-sm font-medium">
				{loc.name && <p className="text-neutral-900">{loc.name}</p>}
				<a
					href={`mailto:${loc.email}`}
					className="break-all text-neutral-600 transition-colors hover:text-pesacheck-blue"
				>
					{loc.email}
				</a>
				{loc.phone && <p className="text-neutral-600">{loc.phone}</p>}
			</div>
		</div>
	);
}

export function ContactLocations() {
	return (
		<Container className="py-14 lg:py-[70px]">
			<SectionHeading title="Locations" />
			<div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{CONTACT_LOCATIONS.map((loc) => (
					<LocationTile key={loc.country} loc={loc} />
				))}
			</div>
		</Container>
	);
}
