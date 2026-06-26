import type { Article } from "@/lib/article-content";
import { renderArticleBody } from "@/lib/data/body";
import type { Story } from "@/lib/home-content";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "";
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
    return `${MEDIA_URL}${image.asset_id}.webp`;
  }
  return `${MEDIA_URL}${image.asset_id}.${image.file_extension}`;
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
    date: formatStoryDate(article.published_at),
    readTime: computeReadTime(article.body),
    href: storyHref(article),
  };
}
