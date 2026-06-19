import { Container } from "@/components/ui/SectionHeading";
import { FAQ_HERO } from "@/lib/faqs-content";

// The Figma FAQ hero is a desaturated (grayscale) image wash with white text and
// a white accent bar — distinct from the navy About/Contact heroes. With no hero
// photo to export, we approximate the wash with a neutral charcoal gradient so the
// white heading stays legible while keeping the design's grey treatment.
const HERO_GRADIENT =
	"linear-gradient(90deg, #2b2c2e 0%, #44464a 55%, #5d5e61 100%)";

export function FaqHero() {
	return (
		<section className="relative overflow-hidden bg-neutral-900">
			<div
				className="absolute inset-0"
				style={{ backgroundImage: HERO_GRADIENT }}
			/>

			<Container className="relative flex min-h-[360px] flex-col justify-center py-16 sm:min-h-[420px] lg:min-h-[480px]">
				<div className="max-w-[660px]">
					<span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
					<h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px]">
						{FAQ_HERO.title}
					</h1>
					<p className="mt-4 text-xl font-medium text-white/90">
						{FAQ_HERO.subtitle}
					</p>
				</div>
			</Container>
		</section>
	);
}
