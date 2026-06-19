/**
 * Page-specific content for the About → Methodology page, transcribed from the
 * Figma design (node 2866:4155). Site-wide content (nav, footer, allies/partners)
 * lives in `lib/site.ts`. The design ships with placeholder ("Qorem ipsum…") copy
 * and grey image boxes; the body mirrors the About → Funding template exactly,
 * only the hero differs.
 */

export const METHODOLOGY_HERO = {
  title: "Methodology",
  subtitle:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
};

// A section's body is an ordered list of blocks so paragraphs and bullet lists
// keep their Figma order.
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

// Image layout beneath the copy. "small" boxes pair up in a 2-col grid;
// "large" boxes span the full reading column. Mirrors the grey rectangles in
// the design.
export type ImageSlot = "small" | "large";

export type MethodologySection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
  learnMore: boolean;
  images: ImageSlot[];
};

const LOREM_LONG =
  "Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.";

const LOREM_SHORT =
  "Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.";

const LOREM_MED =
  "Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Aliquam in elementum tellus.";

const BULLETS = ["Funding", "Funding", "Funding"];

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: "section-one",
    title: "Section One",
    blocks: [
      { type: "p", text: LOREM_LONG },
      { type: "p", text: LOREM_SHORT },
      { type: "ul", items: BULLETS },
      { type: "p", text: LOREM_MED },
    ],
    learnMore: false,
    images: ["small", "small", "large"],
  },
  {
    id: "section-two",
    title: "Section Two",
    blocks: [
      { type: "p", text: LOREM_LONG },
      { type: "p", text: LOREM_SHORT },
      { type: "ul", items: BULLETS },
      { type: "p", text: LOREM_MED },
    ],
    learnMore: true,
    images: ["large"],
  },
  {
    id: "section-three",
    title: "Section Three",
    blocks: [
      { type: "p", text: LOREM_LONG },
      { type: "p", text: LOREM_SHORT },
      { type: "p", text: LOREM_MED },
    ],
    learnMore: true,
    images: ["small", "small"],
  },
];
