/**
 * Page-specific content for the About → Funding page. Copy sourced from the
 * "Transparency of Funding" section of the live Ghost site
 * (https://pesacheck.org/our-principles/) per issue #45. Site-wide content
 * (nav, footer, allies/partners) lives in `lib/site.ts`.
 */

export const FUNDING_HERO = {
  title: "Funding",
  subtitle:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
};

// A section's body is an ordered list of blocks so paragraphs, bullet lists and
// inline images keep their source order. Paragraph/list text may embed
// markdown-style links — `[label](href)` — rendered by `components/ui/RichText`.
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | {
      type: "img";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    };

// Image layout beneath the copy. "small" boxes pair up in a 2-col grid;
// "large" boxes span the full reading column. Mirrors the grey rectangles in
// the design.
export type ImageSlot = "small" | "large";

export type FundingSection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
  learnMore: boolean;
  images: ImageSlot[];
};

export const FUNDING_SECTIONS: FundingSection[] = [
  {
    id: "how-we-are-funded",
    title: "How We Are Funded",
    blocks: [
      {
        type: "p",
        text: "PesaCheck was founded with a seed grant from CfA's [innovateAFRICA](https://innovateafrica.fund/) fund in 2017, and continues to be incubated and co-funded through the fund.",
      },
      {
        type: "p",
        text: "PesaCheck has in the past received direct financial support from the [International Budget Partnership](https://www.internationalbudget.org/) (IBP) for activities in Kenya, Google's tech-for-good arm [Jigsaw](https://jigsaw.google.com/) for pan-African research and to tackle gender-focused fact-checking, the [Bill & Melinda Gates Foundation](https://www.gatesfoundation.org/) (BMGF) for fact-checking health issues, the (now defunct) [Data Zetu](https://web.archive.org/web/20190509095921/http://datazetu.dlab.or.tz/) initiative and [Twaweza](https://www.twaweza.org/) for activities in Tanzania, and the U.S.-based [International Center for Journalists](https://www.icfj.org/) (ICFJ) for activities across East Africa.",
      },
      {
        type: "p",
        text: "We received three project grants from IFCN over the past two years, to support fact-checking on Covid-19 issues and for research into persistent conspiracy claims on YouTube. PesaCheck also carries out paid third-party fact-checking for Meta on Facebook and Instagram, receives support costs from WhatsApp for operating a public tip-line on the platform, and receives occasional ad-hoc travel sponsorships, from organisations such as Access Now, Poynter, and Article 19, for its team to participate in fact-check gatherings.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "editorial-independence",
    title: "Editorial Independence",
    blocks: [
      {
        type: "p",
        text: "PesaCheck does not have any institutional or remunerative relationships with governments, politicians or political parties. PesaCheck's training programmes do however receive support from state-funded international media development programmes in Germany (through the [Deutsche Welle Akademie](https://www.dw.com/en/dw-akademie/about-us/s-9519) for skills development in Ethiopia, Ghana and Kenya, and the [Deutsche Gesellschaft für Internationale Zusammenarbeit](https://www.giz.de/en/html/index.html) for skills development in Kenya) and France (through the [Agence Française de Développement](https://www.afd.fr/en) for training across Francophone Africa).",
      },
      {
        type: "p",
        text: "PesaCheck also receives support from the [United Nations Educational, Scientific and Cultural Organization](https://www.unesco.org/en) (UNESCO) to support the [African Fact-Checking Alliance](https://factcheck.africa/) (AFCA) to seed-fund and train newsroom-based 'CheckDesks' in 270 media in 20 African countries, and from the [United Nations Development Programme](https://www.undp.org/) (UNDP) for supporting election-focused fact-checking in Kenya. These partnerships explicitly exclude any donor influence over editorial decision-making or content production, and are confined to underwriting the cost of trainers/logistics, as well as to provide fellowship stipends for trainees.",
      },
      {
        type: "p",
        text: "Where PesaCheck has received funding, either directly or indirectly, related to a foreign government or one of its development agencies or sovereign funds, the terms of these grants include clauses that explicitly guarantee complete editorial control for PesaCheck.",
      },
    ],
    learnMore: false,
    images: [],
  },
  {
    id: "our-income",
    title: "Our Income",
    blocks: [
      {
        type: "p",
        text: "PesaCheck's income from July 2018 to June 2019 was $175,780 which paid for a team of 11 researchers, fact-checkers and editors working out of offices in Dar es Salaam, Kampala and Nairobi.",
      },
    ],
    learnMore: false,
    images: [],
  },
];
