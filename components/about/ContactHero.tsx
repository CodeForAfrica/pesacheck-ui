import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { CONTACT_HERO } from "@/lib/contact-content";

// Dark navy hero with the hand-on-tablet photo bleeding off the right edge; a
// left-to-right wash keeps the heading legible over the image. Mirrors the
// shared About/Funding hero treatment.
const HERO_GRADIENT =
	"linear-gradient(95deg, rgba(4, 26, 109, 0.92) 30%, rgba(4, 26, 109, 0.55) 70%, rgba(11, 42, 234, 0.25) 100%)";

export function ContactHero() {
	return (
		<section className="relative overflow-hidden bg-pesacheck-black">
			<Image
				src="/images/contact/contact-hero.png"
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover object-right"
			/>
			<div
				className="absolute inset-0"
				style={{ backgroundImage: HERO_GRADIENT }}
			/>

			<Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[480px] lg:min-h-[540px]">
				<div className="max-w-[660px]">
					<span className="mb-5 block h-[3px] w-[190px] rounded bg-white/90" />
					<h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
						{CONTACT_HERO.title}
					</h1>
					<p className="mt-4 text-xl font-medium text-white/90">
						{CONTACT_HERO.eyebrow}
					</p>
				</div>
			</Container>
		</section>
	);
}
