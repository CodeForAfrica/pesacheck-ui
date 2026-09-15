/**
 * The three editorial article types, each with its own listing page under
 * `/fact-checks`. Superdesk tags an article with one of them on the
 * `content_type` metadata scheme; the site filters each page by the codes below
 * (see `getByContentType` in `lib/data/stories.ts`).
 *
 * `codes` is a list because the site's page names and Superdesk's vocabulary
 * have drifted: staging files quick reads as `quickread`, while the content
 * profile calls the option "Shortform". Matching both keeps the page correct
 * whichever the desk uses.
 */
export type ArticleType = {
  /** URL segment under `/fact-checks`. */
  slug: string;
  /** Page heading and nav label. */
  title: string;
  /** Accepted `content_type` codes in Superdesk. */
  codes?: string[];
  /**
   * Accepted **Project** values, for a type filed under that vocabulary rather
   * than the editorial article type. Integers because Project drives
   * Superdesk's built-in `priority` field.
   */
  projects?: number[];
  /** Page metadata description — also what the type means editorially. */
  description: string;
};

export const QUICK_READS: ArticleType = {
  slug: "quick-reads",
  title: "Quick Reads",
  codes: ["quickread", "shortform"],
  description:
    "Quick, single-verdict fact-checks published daily on specific claims circulating across Africa.",
};

export const EXPLAINERS: ArticleType = {
  slug: "explainers",
  title: "Explainers",
  codes: ["explainer"],
  description:
    "Longer articles that explain a topic or guide readers on spotting misinformation in a specific area.",
};

/**
 * Longform is filed under **Project** — "the entity/funding body under which
 * this claim belongs" — rather than the editorial article type.
 *
 * Project's vocabulary drives Superdesk's built-in `priority` field (its id is
 * `priority`, though it is labelled "Project"), so the selection is an integer
 * on `swp_article_metadata` rather than an entry in `metadata.subject[]`. `9`
 * is "Long Form".
 */
export const LONGFORM: ArticleType = {
  slug: "longform",
  title: "Longform",
  projects: [9],
  description:
    "In-depth fact-checks of a speech or incident, where multiple statements are checked and each carries its own verdict.",
};

export const ARTICLE_TYPES: ArticleType[] = [QUICK_READS, EXPLAINERS, LONGFORM];

/** Listing route for an article type, e.g. `/fact-checks/quick-reads`. */
export function articleTypeHref(type: ArticleType): string {
  return `/fact-checks/${type.slug}`;
}
