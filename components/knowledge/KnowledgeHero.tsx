import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { HERO } from "@/lib/knowledge-content";

// Left-to-right blue wash over the library illustration — darker on the left so
// the heading stays legible, fading toward the artwork on the right.
const HERO_GRADIENT =
	"linear-gradient(95deg, rgba(4, 26, 109, 0.92) 30%, rgba(4, 26, 109, 0.55) 70%, rgba(11, 42, 234, 0.25) 100%)";

export function KnowledgeHero() {
	return (
		<section className="relative overflow-hidden bg-pesacheck-black">
			<Image
				src="/images/knowledge-hero/knowledge-base-22.png"
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			<div
				className="absolute inset-0"
				style={{ backgroundImage: HERO_GRADIENT }}
			/>

			<Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[520px] lg:min-h-[640px] lg:py-[88px]">
				<div className="max-w-[611px]">
					<span className="mb-5 block h-[3px] w-[190px] rounded bg-white/80" />
					<h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[52px] lg:text-[60px]">
						{HERO.title}
					</h1>
					<p className="mt-5 max-w-[611px] text-base leading-6 text-white/90 lg:text-lg">
						{HERO.subtitle}
					</p>
				</div>
			</Container>
		</section>
	);
}
