/**
 * Site-wide content shared across all pages (used by the layout chrome:
 * Header, Footer). Page-specific content lives in `lib/<page>-content.ts`.
 */

import type { ElementType } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FiBookOpen,
  FiFacebook,
  FiGlobe,
  FiGrid,
  FiLinkedin,
  FiPhone,
  FiPlay,
  FiRefreshCw,
  FiServer,
  FiSlack,
  FiUsers,
} from "react-icons/fi";
import {
  LuCoins,
  LuHand,
  LuLanguages,
  LuMegaphone,
  LuMessageCircleQuestion,
  LuMessageCircleWarning,
  LuScale,
  LuSearch,
} from "react-icons/lu";

export type NavMenuItem = { label: string; href: string; icon: ElementType };

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
  { label: "About Us", href: "/about", icon: FiGrid },
  { label: "Who We Are", href: "/about#our-team", icon: FiUsers },
  { label: "Our Partners", href: "/about/partners", icon: LuHand },
  { label: "Funding", href: "/about/funding", icon: LuCoins },
  { label: "Our Impact", href: "/about#our-impact", icon: FiGlobe },
  { label: "FAQs", href: "/about/faqs", icon: LuMessageCircleQuestion },
  { label: "Methodology", href: "/about/methodology", icon: FiRefreshCw },
  { label: "Contact Us", href: "/about/contact-us", icon: FiPhone },
  { label: "Our Ecosystem", href: "/about/our-ecosystem", icon: FiServer },
  { label: "Principles", href: "/about/principles", icon: LuScale },
  { label: "Our Staff + Expertise", href: "/about#our-team", icon: FiUsers },
  { label: "Media Centre", href: "/about/media-centre", icon: LuMegaphone },
];

/**
 * "Fact-Checks" mega-menu. Items are listed in column-major order — the panel
 * lays them out as 3 columns of 2, so indices 0–1 are column 1, 2–3 column 2,
 * 4–5 column 3 (mirrors the Figma "Fact Checks" dropdown, node 2866:7355).
 */
export const FACT_CHECKS_MENU_ITEMS: NavMenuItem[] = [
  { label: "All fact-checks", href: "/fact-checks", icon: FiGrid },
  {
    label: "By Language",
    href: "/fact-checks?open=language",
    icon: LuLanguages,
  },
  {
    label: "By Topic",
    href: "/fact-checks?open=topic",
    icon: LuMessageCircleWarning,
  },
  { label: "Quick Reads", href: "/fact-checks", icon: FiBookOpen },
  { label: "Explainers", href: "/fact-checks", icon: FiPlay },
  { label: "By Country", href: "/fact-checks?open=region", icon: FiGlobe },
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

export const FOOTER_NAV: { label: string; href: string }[] = [
  { label: "Knowledge Base", href: "/knowledge" },
  { label: "About Pesacheck", href: "/about" },
  { label: "Methodology", href: "/about/methodology" },
  { label: "Funding and Principles", href: "/about/funding" },
  { label: "Our Products", href: "/tools" },
  { label: "Contact Us", href: "/about/contact-us" },
];

export const LEGAL: { label: string; href?: string }[] = [
  { label: "Copyright 2026 PesaCheck" },
  { label: "Imprint", href: "/about/contact-us#imprint" },
  { label: "Privacy policy", href: "https://trustlab.africa/privacy-policy" },
];

export type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** The ally/partner's own website — every rendered logo links out to it. */
  href: string;
};

export const ALLIES: Logo[] = [
  {
    src: "/images/partners/ally-civic-signal.png",
    alt: "Civic Signal",
    width: 1024,
    height: 337,
    href: "https://civicsignal.africa/",
  },
  {
    src: "/images/partners/ally-takwimu.png",
    alt: "Takwimu",
    width: 292,
    height: 48,
    href: "https://takwimu.africa/",
  },
  {
    src: "/images/partners/ally-academy-africa.svg",
    alt: "Academy Africa",
    width: 88,
    height: 40,
    href: "https://academy.africa/",
  },
  {
    src: "/images/partners/ally-ancir-ilab.png",
    alt: "ANCIR iLAB",
    width: 305,
    height: 86,
    href: "https://investigativecenters.org/",
  },
];

export const PARTNERS: Logo[] = [
  {
    src: "/images/partners/partner-meta.png",
    alt: "Meta",
    width: 522,
    height: 196,
    href: "https://meta.com/",
  },
  {
    src: "/images/partners/partner-un.png",
    alt: "United Nations",
    width: 1970,
    height: 610,
    href: "https://un.org/",
  },
  {
    src: "/images/partners/partner-tiktok.png",
    alt: "TikTok",
    width: 298,
    height: 102,
    href: "https://tiktok.com/",
  },
  {
    src: "/images/partners/partner-dw.png",
    alt: "Deutsche Welle",
    width: 1200,
    height: 323,
    href: "https://dw.com/",
  },
];

export const SOCIAL_URLS = {
  twitter: "https://x.com/PesaCheck",
  facebook: "https://www.facebook.com/PesaCheck",
  whatsapp: "https://www.whatsapp.com/channel/0029Va0d3VACcW4wD5Woh01P",
  slack: "https://code4africa.slack.com/",
  linkedin: "https://www.linkedin.com/company/code-for-africa",
  instagram: "https://www.instagram.com/pesacheck",
} as const;

export const SOCIAL_ICONS: {
  icon: ElementType;
  label: string;
  href: string;
}[] = [
  {
    icon: FaXTwitter,
    label: "Twitter / X",
    href: SOCIAL_URLS.twitter,
  },
  {
    icon: FiFacebook,
    label: "Facebook",
    href: SOCIAL_URLS.facebook,
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    href: SOCIAL_URLS.whatsapp,
  },
  { icon: FiSlack, label: "Slack", href: SOCIAL_URLS.slack },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    href: SOCIAL_URLS.linkedin,
  },
];

const STAT_BLURB =
  "Pesacheck has lorem ipsum dolor sit amet consectetur adipiscing";

export type ImpactStat = {
  icon: ElementType;
  value: string;
  label: string;
};

// Row-major order matching the 2x2 Figma grid.
export const IMPACT_STATS: ImpactStat[] = [
  { icon: LuLanguages, value: "6 Publishing Languages", label: STAT_BLURB },
  { icon: LuSearch, value: "10,000+ Fact-checks", label: STAT_BLURB },
  { icon: FiRefreshCw, value: "8+ Years in operation", label: STAT_BLURB },
  { icon: FiGlobe, value: "18+ Countries we operate in", label: STAT_BLURB },
];
