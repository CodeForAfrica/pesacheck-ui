/**
 * Page-specific content for the About Us page, transcribed from the Figma design
 * (node 2866:2282). Site-wide content (nav, footer, allies/partners) lives in
 * `lib/site.ts`.
 */

export const ABOUT_HERO = {
  title: "About Us",
  subtitle:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
};

// The four body paragraphs of the intro block, in order.
export const ABOUT_INTRO: string[] = [
  "PesaCheck is an indigenous initiative that is pioneering frontline fact-checking across Africa. Initially focused on verifying the financial and other statistical numbers quoted by public figures in Kenya, Tanzania and Uganda, PesaCheck is now Africa's largest with full-time staff in 18 countries in both east and west Africa, as well as across the Sahel.",
  "PesaCheck fact-checks in two international languages (English and French), as well as major African languages such as Amharic, Kiswahili and Somali. Our network helps track political promises by politicians (through our Wajibisha/PromiseTracker toolkit), helps unpack budget and census data (through our PesaYetu and TaxClock platforms), and builds machine learning/artificial intelligence tools (such as DebunkBot) to help automate verification.",
  "PesaCheck also helps watchdog media and NGOs establish their own standalone fact-check teams, and works with universities across the continent to train a new generation of civic watchdogs.",
  "PesaCheck is an initiative of Code for Africa (CfA) and was co-founded in 2016 by Justin Arenstein and Catherine Gicheru as part of their ICFJ Knight Fellowships, underwritten by an innovateAFRICA.fund award",
];

export const ABOUT_INTRO_IMAGES = [
  { src: "/images/about/intro-1.png", alt: "PesaCheck team at work" },
  { src: "/images/about/intro-2.png", alt: "Fact-checkers analysing data" },
];

export type ImpactStat = {
  icon: string;
  value: string;
  label: string;
};

const STAT_BLURB =
  "Pesacheck has lorem ipsum dolor sit amet consectetur adipiscing";

// Row-major order matching the 2x2 Figma grid.
export const ABOUT_IMPACT_STATS: ImpactStat[] = [
  { icon: "translate", value: "6 Publishing Languages", label: STAT_BLURB },
  { icon: "search-refraction", value: "10,000+ Fact-checks", label: STAT_BLURB },
  { icon: "calendar-impact", value: "8+ Years in operation", label: STAT_BLURB },
  { icon: "globe", value: "18+ Countries we operate in", label: STAT_BLURB },
];

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

const TEAM_BIO =
  "PesaCheck is an initiative of Code for Africa (CfA) and was co-founded in 2016 by Justin Arenstein and Catherine Gicheru...";

// The design uses uniform placeholder copy for all team members (10 cards).
export const ABOUT_TEAM: TeamMember[] = Array.from({ length: 10 }, () => ({
  name: "Justin Arenstein",
  role: "Ceo + Founder",
  bio: TEAM_BIO,
}));
