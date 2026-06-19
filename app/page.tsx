import { ContentDesks } from "@/components/home/ContentDesks";
import { Hero } from "@/components/home/Hero";
import { LatestStories } from "@/components/home/LatestStories";
import { Spotlight } from "@/components/home/Spotlight";
import { Tools } from "@/components/home/Tools";
import { TrendingStories } from "@/components/home/TrendingStories";
import { WhatsappBanner } from "@/components/home/WhatsappBanner";
import { Impact } from "@/components/ui/Impact";

export default function Home() {
	return (
		<>
			<Hero />
			<Impact />
			<Spotlight />
			<WhatsappBanner />
			<TrendingStories />
			<ContentDesks />
			<LatestStories />
			<Tools />
		</>
	);
}
