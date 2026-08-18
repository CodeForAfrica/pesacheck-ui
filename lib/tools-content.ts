/**
 * Page-specific content for the Tools page. The tool cards are shared with the
 * homepage "More than fact-checking" row, so they live here and are imported by
 * both. Site-wide content (nav, footer, blurbs) lives in `lib/site.ts`.
 */

export const TOOLS_HERO = {
  title: "More than fact-checking",
  subtitle: "Contact Pesacheck",
  subtitleHref: "/about/contact-us",
};

export type Tool = {
  name: string;
  tagline: string;
  body: string;
  cta: string;
  image: string;
  /** The product's own website — the whole card links out to it. */
  href: string;
};

// Row-major order: top-left, top-right, bottom-left, bottom-right.
export const TOOLS: Tool[] = [
  {
    name: "PesaYetu",
    tagline: "Explore. Visualise. Contextualise.",
    body: "Explore government budgets, public spending and demographic data through interactive visualisations that make complex public information easier to understand and share.",
    cta: "Visit website",
    image: "/images/tools/pesayetu.png",
    href: "https://pesayetu.pesacheck.org/",
  },
  {
    name: "Promise Tracker",
    tagline: "Track promises. Measure progress. Demand accountability.",
    body: "Monitor political and government commitments, follow implementation progress, and see whether elected leaders are delivering on the promises they've made.",
    cta: "Visit website",
    image: "/images/tools/promise-tracker.png",
    href: "https://promisetracker.africa/",
  },
  {
    name: "Tax Clock",
    tagline: "See where your tax time goes.",
    body: "Estimate how much of your working time goes towards paying taxes and better understand how public revenue supports government services.",
    cta: "Visit website",
    image: "/images/tools/tax-clock.png",
    href: "https://taxclock.pesacheck.org/",
  },
  {
    name: "Biscuit Index",
    tagline: "Track the cost of everyday living.",
    body: "Follow changes in the price of everyday essentials through simple, easy-to-understand indicators that help put inflation and the cost of living into context.",
    cta: "Visit website",
    image: "/images/tools/biscuit-index.png",
    href: "https://biscuitindex.codeforkenya.org/",
  },
];
