/**
 * Cache tags. Each `gql()` call declares which tags its result belongs to;
 * `revalidateTag` then drops the cached response and any page rendered from
 * it. An untagged read is still cached, but only its TTL can refresh it.
 *
 * Tags are coarse on purpose: an article change busts every listing rather
 * than working out which listings contained it.
 */

/** Seconds a cached read is reused when nothing revalidates it. */
export const DEFAULT_REVALIDATE = 300;

export const TAGS = {
  /** One article, by slug. */
  article: (slug: string) => `article:${slug}`,

  /** Any bulk read of `swp_article`: the grids, search, desk listings. */
  articles: "articles",

  /** One curated content list, by its Publisher name (`Homepage — Hero`). */
  contentList: (name: string) => `content-list:${name}`,

  /** Every curated list — what an article edit busts. */
  contentLists: "content-lists",

  /** `swp_route`: the content desks and CMS pages that exist. */
  routes: "routes",

  /** `swp_menu`: the header and footer links. */
  navigation: "navigation",

  /**
   * The Region / Language / Topic dropdowns, derived from article taxonomy.
   *
   * Not tagged `articles`: they render in the root layout, so that would put
   * every page in the site behind every article edit. Their hourly TTL covers
   * the rare case of a new taxonomy value appearing.
   */
  filterOptions: "filter-options",
} as const;

/** One request to `/api/revalidate`: a Publisher webhook, or a direct call. */
export type RevalidateRequest = {
  /** Publisher's `X-WEBHOOK-EVENT`, absent on a direct call. */
  event?: string;
  /** The serialized entity, or the direct payload. */
  body?: {
    slug?: unknown;
    tags?: unknown;
  } | null;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Cache tags for a Publisher webhook event — `article[published]`,
 * `menu[updated]`, and the rest of the list in Publisher's webhook form. An
 * unrecognised event returns none.
 */
export function tagsForEvent(
  event: string,
  subject: { slug?: unknown } = {},
): string[] {
  const [entity] = event.split("[", 1);

  switch (entity) {
    // `article[preview]` renders an unpublished draft, so it must not reach
    // the live cache. Publish, update, unpublish and cancel all should.
    case "article":
      return event === "article[preview]"
        ? []
        : tagsForArticle(str(subject.slug));

    // Routes decide which desks exist and which desk a listing sits under.
    case "route":
      return [TAGS.routes, TAGS.articles];

    case "menu":
      return [TAGS.navigation];

    // Packages arrive before Publisher has made an article of them; the
    // `article[*]` event that follows is the one carrying a slug.
    default:
      return [];
  }
}

/**
 * The article's own page, plus everything that lists it. No column says which
 * content lists an article sits in, so every list is busted.
 *
 * Without a slug, only the listings.
 */
export function tagsForArticle(slug: string): string[] {
  return [
    ...(slug ? [TAGS.article(slug)] : []),
    TAGS.articles,
    TAGS.contentLists,
  ];
}

/**
 * Tags for one request to `/api/revalidate`.
 *
 * An event takes precedence over the body rather than combining with it.
 * Every Publisher entity carries a `slug`, so reading both would make
 * `route[updated]` bust an article page named after the desk, and
 * `article[preview]` bust anything at all.
 */
export function tagsForDelivery({ event, body }: RevalidateRequest): string[] {
  const payload = body ?? {};

  if (event) return [...new Set(tagsForEvent(event, payload))];

  const named = Array.isArray(payload.tags)
    ? payload.tags.map(str).filter(Boolean)
    : [];
  const slug = str(payload.slug);

  return [...new Set(slug ? [...named, ...tagsForArticle(slug)] : named)];
}
