/**
 * Page-specific content for the "/fact-checks" listing page, transcribed from
 * the Figma design (node 2866:5247). Reuses the shared `Story` type and the
 * placeholder imagery already present in `public/images`. Each story carries
 * real taxonomy values (topic / region / language) so the "Filter By" bar can
 * filter the listing client-side.
 */

import type { Story } from "@/lib/home-content";

const PLACEHOLDER_TITLE =
  "Subtitle - different from title in the image - 20 words Max 3 lines";

const EXCERPT =
  "Through strategic investments in technology, innovation, and workforce development, the nation is revitalizing its industrial base, creating jobs, and enhancing export opportunities in an...";

// ── Filter taxonomy ────────────────────────────────────────────────────────
// The "Filter By" dropdowns expose these option sets. Stories are tagged with
// one value from each dimension; a story matches the active filters when it
// satisfies every dimension that has at least one value selected.

export type FilterDimension = "region" | "language" | "topic";

export const REGIONS = ["Kenya", "Nigeria", "Uganda", "Tanzania", "Senegal", "South Africa"];
export const LANGUAGES = ["English", "French", "Swahili", "Amharic", "Arabic", "Portuguese"];
export const TOPICS = ["Climate Change", "Gender", "Elections", "Public Finances", "Scams", "Health"];

export const FILTERS: { dimension: FilterDimension; label: string; icon: string; options: string[] }[] = [
  { dimension: "region", label: "Region", icon: "about-globe", options: REGIONS },
  { dimension: "language", label: "Language", icon: "factcheck-language", options: LANGUAGES },
  { dimension: "topic", label: "Topic", icon: "about-grid", options: TOPICS },
];

// Selections shown pre-applied in the Figma design.
export const DEFAULT_FILTERS: Record<FilterDimension, string[]> = {
  region: ["Kenya"],
  language: ["English", "French"],
  topic: ["Health", "Gender"],
};

// ── Hero ─────────────────────────────────────────────────────────────────--
// The hero spotlights a single content desk (Climate Change) with a carousel
// of recent fact-checks beneath the title.

export const HERO = {
  topic: "Climate Change",
};

export const HERO_PREVIEW: Story[] = [
  { image: "/images/hero-preview-cards/story-large.png", alt: "Featured fact-check", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/long-format5.png", alt: "Featured fact-check", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/long-format6.png", alt: "Featured fact-check", title: PLACEHOLDER_TITLE },
  { image: "/images/hero-preview-cards/story1.png", alt: "Featured fact-check", title: PLACEHOLDER_TITLE },
];

// ── Listing ─────────────────────────────────────────────────────────────---
// A featured trio (one large feature + two stacked secondaries) followed by a
// 4-column grid. Every card is tagged so the filter bar can narrow the set.

export const FEATURE: Story = {
  image: "/images/spotlight/long-format6-5.png",
  alt: "Featured fact-check",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  excerpt: EXCERPT,
  topic: "Climate Change",
  region: "Kenya",
  language: "English",
};

export const FEATURE_SECONDARY: Story = {
  image: "/images/spotlight/long-format2-1.png",
  alt: "Featured fact-check",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  topic: "Public Finances",
  region: "Nigeria",
  language: "English",
};

export const STORIES: Story[] = [
  { image: "/images/spotlight/long-format1-1.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Health", region: "Kenya", language: "English" },
  { image: "/images/spotlight/long-format3-2.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Gender", region: "Senegal", language: "French" },
  { image: "/images/spotlight/long-format1-2.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Elections", region: "Uganda", language: "Swahili" },
  { image: "/images/spotlight/long-format4-1.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Scams", region: "Tanzania", language: "English" },
  { image: "/images/trending/spotlight1.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Public Finances", region: "Kenya", language: "Swahili" },
  { image: "/images/trending/spotlight3.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Climate Change", region: "South Africa", language: "English" },
  { image: "/images/trending/spotlight4.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Health", region: "Senegal", language: "French" },
  { image: "/images/latest-stories/story2.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Gender", region: "Kenya", language: "English" },
  { image: "/images/latest-stories/story3.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Elections", region: "Nigeria", language: "Arabic" },
  { image: "/images/latest-stories/story4.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Scams", region: "Tanzania", language: "Swahili" },
  { image: "/images/spotlight/long-format3-1.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Climate Change", region: "Uganda", language: "English" },
  { image: "/images/spotlight/long-format4-2.png", alt: "Fact-check", verdict: "Partly False", title: PLACEHOLDER_TITLE, topic: "Public Finances", region: "South Africa", language: "Portuguese" },
];

// ── Content desks ────────────────────────────────────────────────────────--
// Left-to-right order matching the Figma row; reuses the shared desk imagery.

export const CONTENT_DESKS = [
  { name: "Climate Change", image: "/images/content-desks/content2.png" },
  { name: "Gender", image: "/images/content-desks/gender.png" },
  { name: "Elections", image: "/images/content-desks/elections.png" },
  { name: "Public Finances", image: "/images/content-desks/public-finance.png" },
  { name: "Scams", image: "/images/content-desks/scams.png" },
];
