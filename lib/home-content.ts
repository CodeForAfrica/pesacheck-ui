/**
 * Page-specific content for the PesaCheck Home page, transcribed from the Figma
 * design (node 2866:1070). Site-wide content (nav, footer, socials) lives in
 * `lib/site.ts`. The design uses uniform placeholder copy for story cards, so
 * shared strings are defined once below and per-card data varies image/verdict.
 */

export type Story = {
  image: string;
  alt: string;
  verdict?: string;
  title: string;
  excerpt?: string;
  topic?: string;
  region?: string;
  language?: string;
  date?: string;
  readTime?: string;
  href?: string;
};

const PLACEHOLDER_TITLE =
  "Subtitle - different from title in the image - 20 words Max 3 lines";

const ARTICLE_HREF = "/fact-checks/south-africas-manufacturing-surge";

const EXCERPT =
  "Through strategic investments in technology, innovation, and workforce development, the nation is revitalizing its industrial base, creating jobs, and enhancing export opportunities in an...";

export const HERO = {
  title: "Decoding the numbers that shape our world",
  subtitle:
    "PesaCheck is Africa’s largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making",
  cta: "Explore Fact-Checks",
};

// Small glassmorphic preview cards inside the hero band (horizontal carousel).
export const HERO_PREVIEW: Story[] = [
  {
    image: "/images/hero-preview-cards/story-large.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 28",
    readTime: "3 min",
  },
  {
    image: "/images/hero-preview-cards/long-format5.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 28",
    readTime: "3 min",
  },
  {
    image: "/images/hero-preview-cards/long-format6.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 28",
    readTime: "3 min",
  },
  {
    image: "/images/hero-preview-cards/story1.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 28",
    readTime: "3 min",
  },
  {
    image: "/images/hero-preview-cards/story-large.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 27",
    readTime: "4 min",
  },
  {
    image: "/images/hero-preview-cards/long-format5.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 26",
    readTime: "2 min",
  },
  {
    image: "/images/hero-preview-cards/long-format6.png",
    alt: "Featured story",
    title: PLACEHOLDER_TITLE,
    date: "Jul 25",
    readTime: "5 min",
  },
];

// Spotlight: one feature story + a grid of smaller ones.
// Grid cards shown below the feature row, capping the section at two rows.
// Matches the desktop column count (lg:grid-cols-4); raise by a multiple of 4
// to show more rows.
export const SPOTLIGHT_GRID_LIMIT = 4;

export const SPOTLIGHT_FEATURE: Story = {
  image: "/images/spotlight/long-format6-5.png",
  alt: "Spotlight feature story",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  excerpt: EXCERPT,
  href: ARTICLE_HREF,
};

export const SPOTLIGHT_SECONDARY: Story = {
  image: "/images/spotlight/long-format2-1.png",
  alt: "Spotlight story",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  href: ARTICLE_HREF,
};

export const SPOTLIGHT_GRID: Story[] = [
  {
    image: "/images/spotlight/long-format4-2.png",
    alt: "Spotlight story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format3-2.png",
    alt: "Spotlight story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format1-1.png",
    alt: "Spotlight story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format4-1.png",
    alt: "Spotlight story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
];

export const WHATSAPP_BANNER = "/images/whatsapp-banner/banner2.png";

// Hosted Mailchimp signup form — the newsletter CTA links out to it.
export const NEWSLETTER_FORM_URL = "https://mailchi.mp/04f88cba55d3/subscribe";

export type WhatsappColumn = {
  graphic: "whatsapp" | "qr" | "message" | "";
  title: string;
  highlight?: string;
  body: string;
};

export const WHATSAPP_COLUMNS: WhatsappColumn[] = [
  {
    graphic: "",
    title: "We are on whatsapp!",
    highlight: "+254 780 542626",
    body: "We are on whatsapp Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  },
  {
    graphic: "whatsapp",
    title: "Follow our channel",
    body: "We send updates every thursday. We send updates every thursday",
  },
  {
    graphic: "qr",
    title: "Something fishy needs sleuthing?",
    body: "Send us photos, videos or text with the details and we’ll investigate",
  },
  {
    graphic: "message",
    title: "Subscribe to receive updates from us!",
    body: "Be the first to know; subscribe to receive updates from PesaCheck",
  },
];

export const TRENDING: Story[] = [
  {
    image: "/images/trending/spotlight1.png",
    alt: "Trending story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/trending/spotlight3.png",
    alt: "Trending story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/trending/spotlight4.png",
    alt: "Trending story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/hero-preview-cards/long-format5.png",
    alt: "Trending story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format3-1.png",
    alt: "Trending story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
];

// Latest Stories: one feature story + a grid of smaller ones.
// Grid cards shown below the feature row, capping the section at two rows.
// Matches the desktop column count (lg:grid-cols-3); raise by a multiple of 3
// to show more rows.
export const LATEST_GRID_LIMIT = 3;

export const LATEST_FEATURE: Story = {
  image: "/images/hero-preview-cards/story-large.png",
  alt: "Latest feature story",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  excerpt: EXCERPT,
  href: ARTICLE_HREF,
};

export const LATEST_GRID: Story[] = [
  {
    image: "/images/latest-stories/story2.png",
    alt: "Latest story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/latest-stories/story3.png",
    alt: "Latest story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/latest-stories/story4.png",
    alt: "Latest story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/hero-preview-cards/story1.png",
    alt: "Latest story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/content-desks/content2.png",
    alt: "Latest story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
  {
    image: "/images/content-desks/content4.png",
    alt: "Latest story",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    href: ARTICLE_HREF,
  },
];

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
// Copy from https://github.com/CodeForAfrica/pesacheck-ui/issues/48.
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
