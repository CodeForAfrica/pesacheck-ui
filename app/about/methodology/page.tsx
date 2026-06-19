import type { Metadata } from "next";
import { MethodologyBody } from "@/components/about/MethodologyBody";
import { MethodologyHero } from "@/components/about/MethodologyHero";

export const metadata: Metadata = {
	title: "Methodology — PesaCheck",
	description:
		"How PesaCheck, Africa's largest indigenous fact-checking organisation, researches, verifies and publishes its fact-checks.",
};

export default function MethodologyPage() {
	return (
		<>
			<MethodologyHero />
			<MethodologyBody />
		</>
	);
}
