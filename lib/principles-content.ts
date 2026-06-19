/**
 * Page-specific content for the About → Principles page. The hero is transcribed
 * from the Figma design (node 4339:5425); the body reuses the About → Funding
 * template. Site-wide content (nav, footer, allies/partners) lives in
 * `lib/site.ts`. The design ships with placeholder ("Qorem ipsum…") copy and
 * grey image boxes, faithfully reproduced here as a content template.
 */

export const PRINCIPLES_HERO = {
  title: "Principles",
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

export type PrinciplesSection = {
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

const BULLETS = ["Principle", "Principle", "Principle"];

export const PRINCIPLES_SECTIONS: PrinciplesSection[] = [
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
