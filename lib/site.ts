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
  FiFileText,
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
import {
  articleTypeHref,
  EXPLAINERS,
  LONGFORM,
  QUICK_READS,
} from "@/lib/article-types";
import type { FilterDimension } from "@/lib/data/fact-check-filters";

/**
 * Icons a nav item can carry. A CMS cannot ship a React component, so the set
 * is fixed here and Superdesk chooses one by key — an item asking for a key
 * this build does not have falls back to `NAV_ICON_FALLBACK`.
 *
 * Keys are the contract with the `icon` field in a menu item's `extras`.
 */
export const NAV_ICONS = {
  grid: FiGrid,
  users: FiUsers,
  hand: LuHand,
  coins: LuCoins,
  globe: FiGlobe,
  question: LuMessageCircleQuestion,
  refresh: FiRefreshCw,
  phone: FiPhone,
  server: FiServer,
  scale: LuScale,
  megaphone: LuMegaphone,
  book: FiBookOpen,
  play: FiPlay,
  file: FiFileText,
  languages: LuLanguages,
  warning: LuMessageCircleWarning,
  search: LuSearch,
} as const;

export type NavIconKey = keyof typeof NAV_ICONS;

export const NAV_ICON_FALLBACK: NavIconKey = "grid";

/**
 * Which icon a nav item gets, by destination. Publisher's menu API accepts
 * only `name`, `label`, `uri`, `parent` and `route` — there is nowhere to
 * store an icon — so the CMS controls which links exist and where they point,
 * and the icon is resolved here from the href. A destination not listed falls
 * back to `NAV_ICON_FALLBACK`.
 */
export const NAV_ICON_BY_HREF: Record<string, NavIconKey> = {
  "/about": "grid",
  "/about#our-team": "users",
  "/about#our-impact": "globe",
  "/about/partners": "hand",
  "/about/funding": "coins",
  "/about/faqs": "question",
  "/about/methodology": "refresh",
  "/about/contact-us": "phone",
  "/about/our-ecosystem": "server",
  "/about/principles": "scale",
  "/about/media-centre": "megaphone",
  "/fact-checks": "grid",
  "/fact-checks/quick-reads": "book",
  "/fact-checks/explainers": "play",
  "/fact-checks/longform": "file",
};

/** Icons for the filter-panel entries, which all point at `/fact-checks`. */
export const NAV_ICON_BY_FILTER: Record<string, NavIconKey> = {
  language: "languages",
  topic: "warning",
  region: "globe",
};

/**
 * The blurb and grid height for a mega-menu, by its top-level destination.
 * Same reason as the icons: presentation the menu API cannot carry.
 */
export const NAV_MENU_META: Record<
  string,
  { description: string; rows?: 2 | 3 }
> = {
  "/about": {
    description:
      "PesaCheck verifies public statements and viral claims across Africa. Learn who we are and how we work.",
  },
  "/fact-checks": {
    description:
      "Every claim we have checked, by language, topic, country and format.",
    rows: 2,
  },
};

export type NavMenuItem = {
  label: string;
  href: string;
  /**
   * Key into `NAV_ICONS`, not the component itself: these items are built on
   * the server and handed to the client `Header`, and a function cannot cross
   * that boundary. The client resolves the key when it renders.
   */
  icon: NavIconKey;
  /**
   * When present, this item opens the header search bar's filter panel with
   * the matching dropdown expanded, instead of navigating to `href` — the
   * fact-checks listing no longer has its own filter UI (issue #85).
   */
  filterDimension?: FilterDimension;
};

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
  { label: "About Us", href: "/about", icon: "grid" },
  { label: "Who We Are", href: "/about#our-team", icon: "users" },
  { label: "Our Partners", href: "/about/partners", icon: "hand" },
  { label: "Funding", href: "/about/funding", icon: "coins" },
  { label: "Our Impact", href: "/about#our-impact", icon: "globe" },
  { label: "FAQs", href: "/about/faqs", icon: "question" },
  { label: "Methodology", href: "/about/methodology", icon: "refresh" },
  { label: "Contact Us", href: "/about/contact-us", icon: "phone" },
  { label: "Our Ecosystem", href: "/about/our-ecosystem", icon: "server" },
  { label: "Principles", href: "/about/principles", icon: "scale" },
  { label: "Our Staff + Expertise", href: "/about#our-team", icon: "users" },
  { label: "Media Centre", href: "/about/media-centre", icon: "megaphone" },
];

/**
 * "Fact-Checks" mega-menu. Items are listed in column-major order — the panel
 * lays them out as 3 columns of 2, so indices 0–1 are column 1, 2–3 column 2,
 * 4–5 column 3 (mirrors the Figma "Fact Checks" dropdown, node 2866:7355).
 */
export const FACT_CHECKS_MENU_ITEMS: NavMenuItem[] = [
  { label: "All fact-checks", href: "/fact-checks", icon: "grid" },
  {
    label: "By Language",
    href: "/fact-checks",
    icon: "languages",
    filterDimension: "language",
  },
  {
    label: "By Topic",
    href: "/fact-checks",
    icon: "warning",
    filterDimension: "topic",
  },
  {
    label: QUICK_READS.title,
    href: articleTypeHref(QUICK_READS),
    icon: "book",
  },
  {
    label: EXPLAINERS.title,
    href: articleTypeHref(EXPLAINERS),
    icon: "play",
  },
  { label: LONGFORM.title, href: articleTypeHref(LONGFORM), icon: "file" },
  {
    label: "By Country",
    href: "/fact-checks",
    icon: "globe",
    filterDimension: "region",
  },
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
  { label: "About PesaCheck", href: "/about" },
  { label: "Contact Us", href: "/about/contact-us" },
  { label: "Funding and Principles", href: "/about/funding" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Methodology", href: "/about/methodology" },
  { label: "Tools", href: "/tools" },
];

// Linked legal items only — the copyright line is rendered separately in the
// footer with the current year (see `Footer`).
export const LEGAL: { label: string; href: string }[] = [
  { label: "Imprint", href: "/about/contact-us#imprint" },
  { label: "Privacy policy", href: "/privacy-policy" },
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
    src: "/images/partners/ally-academy-africa.png",
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
  // Broadcast channel to follow (used by the social icon lists).
  whatsapp: "https://www.whatsapp.com/channel/0029Va0d3VACcW4wD5Woh01P",
  // Direct 1:1 chat with the PesaCheck line (the "direct line to the facts" CTA).
  whatsappContact:
    "https://api.whatsapp.com/send/?phone=254780542626&text&type=phone_number&app_absent=0",
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
  /**
   * Key into `NAV_ICONS`, not the component: a stat may be authored in
   * Superdesk, and the same fixed set serves both the nav and this.
   */
  icon: NavIconKey;
  value: string;
  label: string;
};

// Row-major order matching the 2x2 Figma grid.
export const IMPACT_STATS: ImpactStat[] = [
  { icon: "languages", value: "6 Publishing Languages", label: STAT_BLURB },
  { icon: "search", value: "10,000+ Fact-checks", label: STAT_BLURB },
  { icon: "refresh", value: "8+ Years in operation", label: STAT_BLURB },
  { icon: "globe", value: "18+ Countries we operate in", label: STAT_BLURB },
];
