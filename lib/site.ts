/**
 * Site-wide content shared across all pages (used by the layout chrome:
 * Header, Footer). Page-specific content lives in `lib/<page>-content.ts`.
 */

export type NavMenuItem = { label: string; href: string; icon: string };

export type NavLink = {
  label: string;
  href: string;
  /** When present, the link reveals a mega-menu (desktop hover / mobile accordion). */
  menu?: {
    description: string;
    items: NavMenuItem[];
    /** Number of rows the desktop grid lays items into (column-major). Default 3. */
    rows?: 2 | 3;
  };
};

/**
 * "About Us" mega-menu. Items are listed in column-major order — the panel lays
 * them out as 4 columns of 3, so indices 0–2 are column 1, 3–5 column 2, etc.
 * (mirrors the Figma "Group 34738225" dropdown, node 2866:4472).
 */
export const ABOUT_MENU_ITEMS: NavMenuItem[] = [
  { label: "About Us", href: "/about", icon: "about-grid" },
  { label: "Who We Are", href: "/about/who-we-are", icon: "about-users" },
  { label: "Our Partners", href: "/about/partners", icon: "about-hand" },
  { label: "Funding", href: "/about/funding", icon: "about-coins-hand" },
  { label: "Our Impact", href: "/about/our-impact", icon: "about-globe" },
  { label: "FAQs", href: "/about/faqs", icon: "about-faq" },
  { label: "Methodology", href: "/about/methodology", icon: "about-refresh" },
  { label: "Contact Us", href: "/about/contact-us", icon: "about-phone" },
  {
    label: "Our Ecosystem",
    href: "/about/our-ecosystem",
    icon: "about-server",
  },
  { label: "Principles", href: "/about/principles", icon: "about-scales" },
  {
    label: "Our Staff + Expertise",
    href: "/about/staff-expertise",
    icon: "about-users",
  },
  {
    label: "Media Centre",
    href: "/about/media-center",
    icon: "about-announcement",
  },
];

/**
 * "Fact-Checks" mega-menu. Items are listed in column-major order — the panel
 * lays them out as 3 columns of 2, so indices 0–1 are column 1, 2–3 column 2,
 * 4–5 column 3 (mirrors the Figma "Fact Checks" dropdown, node 2866:7355).
 */
export const FACT_CHECKS_MENU_ITEMS: NavMenuItem[] = [
  { label: "All fact-checks", href: "/fact-checks", icon: "about-grid" },
  {
    label: "By Language",
    href: "/fact-checks/by-language",
    icon: "factcheck-language",
  },
  { label: "By Topic", href: "/fact-checks/by-topic", icon: "factcheck-topic" },
  {
    label: "Quick Reads",
    href: "/fact-checks/quick-reads",
    icon: "factcheck-reads",
  },
  {
    label: "Explainers",
    href: "/fact-checks/explainers",
    icon: "factcheck-play",
  },
  { label: "By Country", href: "/fact-checks/by-country", icon: "about-globe" },
];

export const NAV_LINKS: NavLink[] = [
  {
    label: "About Us",
    href: "/about",
    menu: {
      description:
        "PesaCheck verifies public statements and viral claims across Africa. Learn who we are and how we work.",
      items: ABOUT_MENU_ITEMS,
    },
  },
  {
    label: "Fact-Checks",
    href: "/fact-checks",
    menu: {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
      items: FACT_CHECKS_MENU_ITEMS,
      rows: 2,
    },
  },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Tools", href: "/tools" },
];

// "An initiative of…" blurb — appears in the footer ally/partner columns and
// the Tools section intro.
export const ABOUT_BLURB =
  "PesaCheck is an initiative of Code for Africa (CfA) and was co-founded in 2016 by Justin Arenstein and Catherine Gicheru as part of their ICFJ Knight Fellowships, underwritten by an innovateAFRICA.fund award";

export const FOOTER_ABOUT =
  "This site is a project of Code for Africa, the continent's largest network of civic technology and data journalism labs. All content is released under a Creative Commons Attribution Licence. Reuse it to help empower your own community.";

export const FOOTER_NAV = [
  "Knowledge Base",
  "About Pesacheck",
  "Methodology",
  "Funding and Principles",
  "Our Products",
  "Contact Us",
];

export const LEGAL = ["Copyright 2026 PesaCheck", "Imprint", "Privacy policy"];

export type Logo = { src: string; alt: string; width: number; height: number };

export const ALLIES: Logo[] = [
  {
    src: "/images/partners/ally-civic-signal.png",
    alt: "Civic Signal",
    width: 120,
    height: 40,
  },
  {
    src: "/images/partners/ally-takwimu.png",
    alt: "Takwimu",
    width: 176,
    height: 40,
  },
  {
    src: "/images/partners/ally-academy-africa.svg",
    alt: "Academy Africa",
    width: 88,
    height: 40,
  },
  {
    src: "/images/partners/ally-ancir-ilab.png",
    alt: "ANCIR iLAB",
    width: 142,
    height: 40,
  },
];

export const PARTNERS: Logo[] = [
  {
    src: "/images/partners/partner-meta.png",
    alt: "Meta",
    width: 186,
    height: 40,
  },
  {
    src: "/images/partners/partner-un.png",
    alt: "United Nations",
    width: 130,
    height: 40,
  },
  {
    src: "/images/partners/partner-tiktok.png",
    alt: "TikTok",
    width: 143,
    height: 49,
  },
  {
    src: "/images/partners/partner-dw.png",
    alt: "Deutsche Welle",
    width: 151,
    height: 40,
  },
];

export const SOCIAL_ICONS = [
  { name: "social-twitter-x", label: "Twitter / X" },
  { name: "social-facebook", label: "Facebook" },
  { name: "social-icon1", label: "Instagram" },
  { name: "social-icon2", label: "LinkedIn" },
  { name: "social-layer13", label: "YouTube" },
];

const STAT_BLURB =
  "Pesacheck has lorem ipsum dolor sit amet consectetur adipiscing";

export type ImpactStat = {
  icon: string;
  value: string;
  label: string;
};

// Row-major order matching the 2x2 Figma grid.
export const IMPACT_STATS: ImpactStat[] = [
  { icon: "translate", value: "6 Publishing Languages", label: STAT_BLURB },
  {
    icon: "search-refraction",
    value: "10,000+ Fact-checks",
    label: STAT_BLURB,
  },
  {
    icon: "calendar-impact",
    value: "8+ Years in operation",
    label: STAT_BLURB,
  },
  { icon: "globe", value: "18+ Countries we operate in", label: STAT_BLURB },
];
