import type { Metadata } from "next";
import { FaqCta } from "@/components/about/FaqCta";
import { FaqGroups } from "@/components/about/FaqGroups";
import { FaqHero } from "@/components/about/FaqHero";

export const metadata: Metadata = {
	title: "FAQs — PesaCheck",
	description:
		"Answers to frequently asked questions about PesaCheck — our articles, policies and how to use the site.",
};

export default function FaqsPage() {
	return (
		<>
			<FaqHero />
			<FaqGroups />
			<FaqCta />
		</>
	);
}
