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
  { image: "/images/hero-preview-cards/story-large.png", alt: "Featured story", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/long-format5.png", alt: "Featured story", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/long-format6.png", alt: "Featured story", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/story1.png", alt: "Featured story", title: PLACEHOLDER_TITLE },
];

export const IMPACT_STATS = [
  { value: "9 Fact-Checking Languages", label: "We publish fact-checks in nine languages across the continent." },
  { value: "10,000+ Fact-Checks", label: "Misleading claims debunked since we began in 2016." },
  { value: "15+ Countries Covered", label: "Newsroom partners and audiences spanning Africa." },
];

// Spotlight: one feature story + a grid of smaller ones.
export const SPOTLIGHT_FEATURE: Story = {
  image: "/images/spotlight/long-format6-5.png",
  alt: "Spotlight feature story",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  excerpt: EXCERPT,
};

export const SPOTLIGHT_SECONDARY: Story = {
  image: "/images/spotlight/long-format2-1.png",
  alt: "Spotlight story",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
};

export const SPOTLIGHT_GRID: Story[] = [
  { image: "/images/spotlight/long-format4-2.png", alt: "Spotlight story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/spotlight/long-format3-2.png", alt: "Spotlight story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/spotlight/long-format1-1.png", alt: "Spotlight story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/spotlight/long-format4-1.png", alt: "Spotlight story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
];

export const WHATSAPP_BANNER = "/images/whatsapp-banner/banner3.png";

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
    title: "Subscribe to our weekly newsletter",
    body: "Send us photos, videos or text with the details and we’ll investigate",
  },
];

export const TRENDING: Story[] = [
  { image: "/images/trending/spotlight1.png", alt: "Trending story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/trending/spotlight3.png", alt: "Trending story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/trending/spotlight4.png", alt: "Trending story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/long-format5.png", alt: "Trending story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/spotlight/long-format3-1.png", alt: "Trending story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
];

// Left-to-right order as in the Figma row.
export const CONTENT_DESKS = [
  { name: "Climate Change", image: "/images/content-desks/content2.png" },
  { name: "Gender", image: "/images/content-desks/gender.png" },
  { name: "Elections", image: "/images/content-desks/elections.png" },
  { name: "Public Finances", image: "/images/content-desks/public-finance.png" },
  { name: "Scams", image: "/images/content-desks/scams.png" },
  { name: "Health", image: "/images/content-desks/content3.png" },
  { name: "Migration", image: "/images/content-desks/content4.png" },
];

export const LATEST_FEATURE: Story = {
  image: "/images/hero-preview-cards/story-large.png",
  alt: "Latest feature story",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  excerpt: EXCERPT,
};

export const LATEST_GRID: Story[] = [
  { image: "/images/latest-stories/story2.png", alt: "Latest story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/latest-stories/story3.png", alt: "Latest story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/latest-stories/story4.png", alt: "Latest story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/story1.png", alt: "Latest story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/content-desks/content2.png", alt: "Latest story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
  { image: "/images/content-desks/content4.png", alt: "Latest story", verdict: "Partly False", title: PLACEHOLDER_TITLE },
];

export type Tool = {
  name: string;
  tagline: string;
  body: string;
  cta: string;
  image: string;
};

const TOOL_BODY =
  "Learn more about Pesayetu Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.";

// Row-major order: top-left, top-right, bottom-left, bottom-right.
export const TOOLS: Tool[] = [
  { name: "Pesayetu", tagline: "Explore | Visualise | Contextualise.", body: TOOL_BODY, cta: "Visit website", image: "/images/tools/pesayetu.png" },
  { name: "Promise Tracker", tagline: "Do policies follow promises? Find out", body: TOOL_BODY, cta: "Visit website", image: "/images/tools/promise-tracker.png" },
  { name: "Tax Clock", tagline: "How much of your time is your own? Find out", body: TOOL_BODY, cta: "Visit website", image: "/images/tools/tax-clock.png" },
  { name: "Biscuit Index", tagline: "The biscuit index. Find out more", body: TOOL_BODY, cta: "Visit website", image: "/images/tools/biscuit-index.png" },
];
