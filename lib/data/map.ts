/**
 * Mappers from raw Superdesk `swp_*` shapes to the Figma UI types
 * (`Story`, `Article`, `ContentDesk`). Keep these the single place that knows
 * the backend shape — pages and components stay on the existing typed contract.
 *
 * Ported from `pesacheck-pwa-app-router/services/helpers.ts` where noted.
 */

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "";

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
// See docs/migration-plan.md Phase-1 notes.

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
