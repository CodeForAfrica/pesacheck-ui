/**
 * Page-specific content for the PesaCheck Knowledge page, transcribed from the
 * Figma design (node 2866:2090). Site-wide content (nav, footer, allies/
 * partners) lives in `lib/site.ts`. The design uses uniform placeholder copy
 * across the three sections, so the shared lorem strings are defined once and
 * each section varies only its heading, optional funding list, and image layout.
 */

const LEAD =
	"Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.";

const SECONDARY =
	"Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.";

const CLOSING =
	"Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Aliquam in elementum tellus.";

/** A grey placeholder block; `wide` spans the full content column, otherwise it
 * sits in a two-up grid. The design ships no real imagery for these cards. */
export type Placeholder = { wide: boolean };

export type KnowledgeSection = {
	id: string;
	title: string;
	/** Paragraphs rendered before the optional funding list. */
	body: string[];
	/** Repeated "Funding" bullets shown between the body paragraphs. */
	fundingItems?: string[];
	/** Paragraph rendered after the funding list (closing copy). */
	closing?: string;
	images: Placeholder[];
};

export const HERO = {
	title: "Knowledge",
	subtitle:
		"PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
};

export const KNOWLEDGE_SECTIONS: KnowledgeSection[] = [
	{
		id: "training",
		title: "Training",
		body: [LEAD, SECONDARY],
		fundingItems: ["Funding", "Funding", "Funding"],
		closing: CLOSING,
		images: [{ wide: false }, { wide: false }, { wide: true }],
	},
	{
		id: "mentorships",
		title: "Mentorships",
		body: [LEAD, SECONDARY],
		fundingItems: ["Funding", "Funding", "Funding"],
		closing: CLOSING,
		images: [{ wide: true }],
	},
	{
		id: "incubator",
		title: "Incubator",
		body: [LEAD, SECONDARY, CLOSING],
		images: [{ wide: false }, { wide: false }],
	},
];
