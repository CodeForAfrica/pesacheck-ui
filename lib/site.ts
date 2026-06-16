/**
 * Site-wide content shared across all pages (used by the layout chrome:
 * Header, Footer). Page-specific content lives in `lib/<page>-content.ts`.
 */

export const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Fact-Checks", href: "#fact-checks" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Tools", href: "/tools" },
];

// "An initiative of…" blurb — appears in the footer ally/partner columns and
// the Tools section intro.
export const ABOUT_BLURB =
  "PesaCheck is an initiative of Code for Africa (CfA) and was co-founded in 2016 by Justin Arenstein and Catherine Gicheru as part of their ICFJ Knight Fellowships, underwritten by an innovateAFRICA.fund award";

export const FOOTER_ABOUT =
  "This site is a project of Code for Africa, the continent’s largest network of civic technology and data journalism labs. All content is released under a Creative Commons Attribution Licence. Reuse it to help empower your own community.";

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
  { src: "/images/footer/ally-logo.svg", alt: "Ally logo", width: 120, height: 40 },
  { src: "/images/footer/ally-frame125.png", alt: "Ally logo", width: 120, height: 40 },
  { src: "/images/footer/ally-image3.png", alt: "Ally logo", width: 120, height: 40 },
  { src: "/images/footer/ancir-ilab-logo.png", alt: "ANCIR iLAB", width: 120, height: 40 },
];

export const PARTNERS: Logo[] = [
  { src: "/images/footer/partner-image4.png", alt: "Partner logo", width: 120, height: 40 },
  { src: "/images/footer/partner-image5.png", alt: "Partner logo", width: 120, height: 40 },
  { src: "/images/footer/partner-image6.png", alt: "Partner logo", width: 120, height: 40 },
  { src: "/images/footer/partner-rectangle195.png", alt: "Partner logo", width: 120, height: 40 },
];

export const SOCIAL_ICONS = [
  { name: "social-twitter-x", label: "Twitter / X" },
  { name: "social-facebook", label: "Facebook" },
  { name: "social-icon1", label: "Instagram" },
  { name: "social-icon2", label: "LinkedIn" },
  { name: "social-layer13", label: "YouTube" },
];
