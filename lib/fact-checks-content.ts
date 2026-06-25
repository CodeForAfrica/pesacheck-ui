/**
 * Page-specific content for the "/fact-checks" listing page, transcribed from
 * the Figma design (node 2866:5247). Reuses the shared `Story` type and the
 * placeholder imagery already present in `public/images`. Each story carries
 * real taxonomy values (topic / region / language) so the "Filter By" bar can
 * filter the listing client-side.
 */

import type { ElementType } from "react";
import { FiGlobe } from "react-icons/fi";
import { LuLanguages, LuMessageCircleWarning } from "react-icons/lu";
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

export const REGIONS = [
  "Kenya",
  "Nigeria",
  "Uganda",
  "Tanzania",
  "Senegal",
  "South Africa",
];
export const LANGUAGES = [
  "English",
  "French",
  "Swahili",
  "Amharic",
  "Arabic",
  "Portuguese",
];
export const TOPICS = [
  "Climate Change",
  "Gender",
  "Elections",
  "Public Finances",
  "Scams",
  "Health",
];

export const FILTERS: {
  dimension: FilterDimension;
  label: string;
  icon: ElementType;
  options: string[];
}[] = [
  { dimension: "region", label: "Region", icon: FiGlobe, options: REGIONS },
  {
    dimension: "language",
    label: "Language",
    icon: LuLanguages,
    options: LANGUAGES,
  },
  {
    dimension: "topic",
    label: "Topic",
    icon: LuMessageCircleWarning,
    options: TOPICS,
  },
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
  {
    image: "/images/hero-preview-cards/story-large.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 28",
    readTime: "3 min",
  },
  {
    image: "/images/hero-preview-cards/long-format5.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 25",
    readTime: "5 min",
  },
  {
    image: "/images/hero-preview-cards/long-format6.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 22",
    readTime: "4 min",
  },
  {
    image: "/images/hero-preview-cards/story1.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 18",
    readTime: "3 min",
  },
  {
    image: "/images/spotlight/long-format1-1.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 15",
    readTime: "6 min",
  },
  {
    image: "/images/spotlight/long-format2-1.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 10",
    readTime: "4 min",
  },
  {
    image: "/images/spotlight/long-format3-1.png",
    alt: "Featured fact-check",
    title: PLACEHOLDER_TITLE,
    date: "Jul 5",
    readTime: "5 min",
  },
];

// ── Listing ─────────────────────────────────────────────────────────────---
// A featured trio (one large feature + two stacked secondaries) followed by a
// 4-column grid. Every card is tagged so the filter bar can narrow the set.

const ARTICLE_HREF = "/fact-checks/south-africas-manufacturing-surge";

export const FEATURE: Story = {
  image: "/images/spotlight/long-format6-5.png",
  alt: "Featured fact-check",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  excerpt: EXCERPT,
  topic: "Climate Change",
  region: "Kenya",
  language: "English",
  href: ARTICLE_HREF,
};

export const FEATURE_SECONDARY: Story = {
  image: "/images/spotlight/long-format2-1.png",
  alt: "Featured fact-check",
  verdict: "Partly False",
  title: PLACEHOLDER_TITLE,
  topic: "Public Finances",
  region: "Nigeria",
  language: "English",
  href: ARTICLE_HREF,
};

export const STORIES: Story[] = [
  {
    image: "/images/spotlight/long-format1-1.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Health",
    region: "Kenya",
    language: "English",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format3-2.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Gender",
    region: "Senegal",
    language: "French",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format1-2.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Elections",
    region: "Uganda",
    language: "Swahili",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format4-1.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Scams",
    region: "Tanzania",
    language: "English",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/trending/spotlight1.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Public Finances",
    region: "Kenya",
    language: "Swahili",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/trending/spotlight3.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Climate Change",
    region: "South Africa",
    language: "English",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/trending/spotlight4.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Health",
    region: "Senegal",
    language: "French",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/latest-stories/story2.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Gender",
    region: "Kenya",
    language: "English",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/latest-stories/story3.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Elections",
    region: "Nigeria",
    language: "Arabic",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/latest-stories/story4.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Scams",
    region: "Tanzania",
    language: "Swahili",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format3-1.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Climate Change",
    region: "Uganda",
    language: "English",
    href: ARTICLE_HREF,
  },
  {
    image: "/images/spotlight/long-format4-2.png",
    alt: "Fact-check",
    verdict: "Partly False",
    title: PLACEHOLDER_TITLE,
    topic: "Public Finances",
    region: "South Africa",
    language: "Portuguese",
    href: ARTICLE_HREF,
  },
];
