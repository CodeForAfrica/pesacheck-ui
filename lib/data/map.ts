import type { Article } from "@/lib/article-content";
import { renderArticleBody } from "@/lib/data/body";
import { mediaAssetUrl } from "@/lib/data/media";
import type { Story } from "@/lib/home-content";
import {
  type Announcement,
  type NewsItem,
  RESEARCH_CTA_HREF,
  RESEARCH_TONES,
  type ResearchStrand,
} from "@/lib/media-centre-content";

/**
 * Preference order for the card image. Staging exposes
 * `thumbnail|viewImage|baseImage|original|square`; prod/local may differ, so the
 * picker just takes the first name that resolves and falls back to any rendition.
 * `viewImage` (≈640px) is the best balance for cards; bigger crops are fallbacks.
 */
const STORY_RENDITIONS = [
  "viewImage",
  "baseImage",
  "original",
  "square",
  "thumbnail",
];

/** Shown when an article has no resolvable rendition (keeps next/image happy). */
const STORY_IMAGE_FALLBACK = "/images/spotlight/long-format3-2.png";

// ── Media ───────────────────────────────────────────────────────────────────

export type Rendition = {
  name: string;
  width?: number;
  height?: number;
  image?: {
    asset_id: string;
    file_extension?: string;
    variants?: string[];
  };
};

/**
 * Resolve a rendition by name to a media URL. Prefers the `.webp` variant.
 * Mirrors `helpers.ts:findRendition`. Returns undefined if not found.
 */
export function findRendition(
  renditions: Rendition[] | undefined,
  name: string,
): string | undefined {
  const rendition = renditions?.find((r) => r.name === name);
  const image = rendition?.image;
  if (!image) return undefined;
  if (image.variants?.includes("webp")) {
    return mediaAssetUrl(image.asset_id, "webp");
  }
  return mediaAssetUrl(image.asset_id, image.file_extension ?? "webp");
}

// ── Metadata / verdict / taxonomy ────────────────────────────────────────────
// `swp_article.metadata` is jsonb but Hasura returns it as a JSON-encoded
// STRING — it must be parsed. The verdict + taxonomy live in `subject[]`.

export type Subject = { scheme: string; code: string; name: string };
export type ArticleMetadata = {
  subject?: Subject[];
  byline?: string | null;
  language?: string | null;
  [key: string]: unknown;
};

/** Parse the metadata jsonb (Hasura returns a string). Null-safe. */
export function parseMetadata(raw: string | null | undefined): ArticleMetadata {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ArticleMetadata;
  } catch {
    return {};
  }
}

/** First subject for a taxonomy scheme (e.g. "Debunk", "countries", "01harm"). */
export function findSubject(
  meta: ArticleMetadata,
  scheme: string,
): Subject | undefined {
  return meta.subject?.find((s) => s.scheme === scheme);
}

/**
 * The fact-check verdict ("False", "Altered", "Hoax", …) from the `Debunk`
 * scheme. Returns undefined when an article carries no verdict tag.
 */
export function getVerdict(raw: string | null | undefined): string | undefined {
  return findSubject(parseMetadata(raw), "Debunk")?.name;
}

/**
 * Display labels for the ISO language codes PesaCheck publishes in. The card's
 * `Story.language` is a human label (parity with the static design data), while
 * the server-side language *filter* keys off the raw `swp_article_metadata.language`
 * code — see `lib/data/fact-check-filters.ts`.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  am: "Amharic",
  en: "English",
  fr: "French",
  om: "Afaan Oromo",
  so: "Somali",
  sw: "Swahili",
};

function languageLabel(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  return LANGUAGE_LABELS[code] ?? code;
}

// ── Story (listing card) ─────────────────────────────────────────────────────
// Maps a raw `swp_article` (as returned by the content-list query) to the Figma
// `Story` card type. Keeps components on `Story`, not the backend shape.

/**
 * Raw article shape selected by `GET_CONTENT_LIST_ITEMS`. Every field is
 * optional/nullable — staging data is sparse (missing body, image, verdict).
 */
export type RawArticle = {
  id: number | string;
  title: string;
  slug: string;
  lead?: string | null;
  body?: string | null;
  published_at?: string | null;
  metadata?: string | null;
  swp_route?: { slug?: string | null; staticprefix?: string | null } | null;
  swp_article_feature_media?: {
    description?: string | null;
    renditions?: Rendition[] | null;
  } | null;
};

function pickStoryImage(renditions: Rendition[] | undefined): string {
  for (const name of STORY_RENDITIONS) {
    const url = findRendition(renditions, name);
    if (url) return url;
  }
  // Last resort: any rendition that resolves to a URL.
  for (const r of renditions ?? []) {
    const url = findRendition([r], r.name);
    if (url) return url;
  }
  return STORY_IMAGE_FALLBACK;
}

/** Strip HTML tags and collapse whitespace — `lead`/`body` may carry markup. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Short month + day (e.g. "Jul 28"), in UTC for deterministic output. */
export function formatStoryDate(
  published: string | null | undefined,
): string | undefined {
  if (!published) return undefined;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Estimated read time from body word count (~200 wpm). Undefined if no body. */
export function computeReadTime(
  body: string | null | undefined,
): string | undefined {
  const words = stripHtml(body ?? "")
    .split(" ")
    .filter(Boolean).length;
  if (words === 0) return undefined;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

/** Article link: `/fact-checks/<desk>/<slug>` (canonical [desk]/[slug] route). */
function storyHref(article: RawArticle): string {
  const desk = article.swp_route?.slug;
  return desk
    ? `/fact-checks/${desk}/${article.slug}`
    : `/fact-checks/${article.slug}`;
}

// ── Article (single fact-check) ──────────────────────────────────────────────

/** Extra relations selected only by the single-article query. */
export type RawFullArticle = RawArticle & {
  swp_article_metadata?: { byline?: string | null } | null;
  swp_article_authors?:
    | { swp_author?: { name?: string | null } | null }[]
    | null;
  swp_article_keywords?:
    | {
        swp_keyword?: { name?: string | null } | null;
      }[]
    | null;
  swp_article_related?: { swp_article?: RawArticle | null }[] | null;
};

/** Map a raw single article to the `Article` type. Null-safe (staging is sparse). */
export function mapArticle(raw: RawFullArticle): Article {
  const meta = parseMetadata(raw.metadata);

  const authors = (raw.swp_article_authors ?? [])
    .map((a) => a.swp_author?.name?.trim())
    .filter((name): name is string => Boolean(name));

  const tags = (raw.swp_article_keywords ?? [])
    .map((k) => k.swp_keyword?.name?.trim())
    .filter((name): name is string => Boolean(name));

  const relatedStories = (raw.swp_article_related ?? [])
    .map((r) => r.swp_article)
    .filter((article): article is RawArticle => article != null)
    .map(mapStory);

  const { bodyHtml, footnotes } = renderArticleBody(raw.body);

  return {
    slug: raw.slug,
    format: "short",
    image: pickStoryImage(
      raw.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt: raw.swp_article_feature_media?.description?.trim() || raw.title,
    title: raw.title,
    verdict: findSubject(meta, "Debunk")?.name,
    tags,
    date: formatStoryDate(raw.published_at) ?? "",
    readTime: computeReadTime(raw.body) ?? "",
    author:
      authors.join(", ") ||
      meta.byline?.trim() ||
      raw.swp_article_metadata?.byline?.trim() ||
      "PesaCheck",
    desk: raw.swp_route?.slug ?? undefined,
    // The body is rendered as HTML; the structured paragraph fields are unused.
    leadParagraphs: [],
    bodyParagraphs: [],
    bodyHtml,
    footnotes,
    relatedStories,
  };
}

/** Map a raw content-list article to the `Story` card type. Null-safe. */
export function mapStory(article: RawArticle): Story {
  const meta = parseMetadata(article.metadata);
  const lead = article.lead ? stripHtml(article.lead) : "";
  return {
    image: pickStoryImage(
      article.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt:
      article.swp_article_feature_media?.description?.trim() || article.title,
    verdict: findSubject(meta, "Debunk")?.name,
    title: article.title,
    excerpt: lead || undefined,
    // Display taxonomy from the jsonb `subject[]` / `language` (the server-side
    // filters key off the normalized relation, but the labels live in jsonb).
    region: findSubject(meta, "countries")?.name,
    topic: findSubject(meta, "01harm")?.name,
    language: languageLabel(meta.language),
    date: formatStoryDate(article.published_at),
    readTime: computeReadTime(article.body),
    href: storyHref(article),
  };
}

// ── Media Centre ─────────────────────────────────────────────────────────────
// The three rows are curated content lists like the homepage ones, so they
// arrive as the same `RawArticle`.

/**
 * Vocabulary naming a Media Centre entry: the kicker above a clipping (design:
 * "International newsrooms"), an announcement's tag ("Network") and a research
 * strand's document kind ("Journal article"). Its own scheme rather than the
 * `01harm` harm-type taxonomy the fact-checks use — these labels say what an
 * entry *is* on this page, which is a different question from what harm a
 * fact-check addresses.
 *
 * Untagged entries drop the label rather than print a placeholder, so the
 * sections read correctly before the vocabulary is populated.
 */
export const MEDIA_CENTRE_LABEL_SCHEME = "media_centre_label";

/** Long form date for the announcements rail, e.g. `15 Jul 2026`. */
export function formatLongDate(
  published: string | null | undefined,
): string | undefined {
  if (!published) return undefined;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Map a raw content-list article to a Media Centre clipping card. */
export function mapNewsItem(article: RawArticle): NewsItem {
  const meta = parseMetadata(article.metadata);
  return {
    image: pickStoryImage(
      article.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt:
      article.swp_article_feature_media?.description?.trim() || article.title,
    outlet: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    title: article.title,
    date: formatStoryDate(article.published_at) ?? "",
    readTime: computeReadTime(article.body) ?? "",
    href: storyHref(article),
  };
}

/**
 * Map a raw content-list article to a research strand. `index` is the article's
 * position in the curated list, which is what picks the accent — nothing in the
 * schema carries a colour.
 */
export function mapResearchStrand(
  article: RawArticle,
  index: number,
): ResearchStrand {
  const meta = parseMetadata(article.metadata);
  return {
    label: article.title,
    kind: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    body: article.lead ? stripHtml(article.lead) : "",
    tone: RESEARCH_TONES[index % RESEARCH_TONES.length],
    href: RESEARCH_CTA_HREF,
  };
}

/** Map a raw content-list article to a Media Centre announcement row. */
export function mapAnnouncement(article: RawArticle): Announcement {
  const lead = article.lead ? stripHtml(article.lead) : "";
  const meta = parseMetadata(article.metadata);
  return {
    date: formatLongDate(article.published_at) ?? "",
    tag: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    title: article.title,
    excerpt: lead,
    href: storyHref(article),
  };
}
