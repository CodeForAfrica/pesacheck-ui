/**
 * Cache tags — the vocabulary that connects a Superdesk edit to the pages it
 * should refresh.
 *
 * Every `gql()` call declares the tags its result belongs to. Next records them
 * on both the cached fetch and on any prerendered page that rendered it, so
 * `revalidateTag(tag)` in `app/api/revalidate/route.ts` drops the fetch *and*
 * the pages built from it. Without a tag a read is still cached, just
 * un-bustable — it only refreshes when its TTL runs out.
 *
 * Tags are deliberately coarse. A mis-scoped tag means an edit that never
 * reaches the site, which is invisible; an over-broad one means a few extra
 * re-renders, which is cheap. So an article change busts every listing rather
 * than trying to work out which listings contained it.
 */

/** Seconds a cached read is reused when nothing revalidates it. */
export const DEFAULT_REVALIDATE = 300;

export const TAGS = {
  /**
   * One article, by slug — the fact-check page, and the team / media-centre
   * pages that are also articles underneath.
   */
  article: (slug: string) => `article:${slug}`,

  /**
   * Anything that reads `swp_article` in bulk: the fact-check grids, search,
   * the desk listings, the filter dropdowns. Any article edit busts this,
   * because a listing shows titles, images and verdicts that just changed.
   */
  articles: "articles",

  /**
   * One curated content list, by its Publisher name (`Homepage — Hero`,
   * `About — Team`, …). Reordering a list touches only the pages reading it.
   */
  contentList: (name: string) => `content-list:${name}`,

  /** Every curated list at once — what an article edit busts, since any list may show it. */
  contentLists: "content-lists",

  /** `swp_route` — the content desks that exist. */
  routes: "routes",

  /** `swp_menu` — the header and footer link rows. */
  navigation: "navigation",

  /**
   * The Region / Language / Topic dropdowns, which are folded out of the
   * taxonomy on published articles.
   *
   * Kept off `articles` on purpose. The dropdowns live in the root layout, so
   * an `articles` tag here would put every page in the site — Privacy Policy
   * included — behind every article edit, and tag-based revalidation would
   * degrade into a full rebuild per edit. The options only move when someone
   * tags content with a *new* region or topic, which their hourly TTL covers.
   */
  filterOptions: "filter-options",
} as const;

/**
 * One delivery to `/api/revalidate`: either a Publisher webhook (an event, and
 * the entity it serialized) or a direct request naming what to drop.
 */
export type RevalidateRequest = {
  /** Publisher's `X-WEBHOOK-EVENT`, absent on a direct request. */
  event?: string;
  /** The webhook body, or the direct payload. */
  body?: {
    slug?: unknown;
    tags?: unknown;
  } | null;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Cache tags for a Publisher webhook event — the map `/api/revalidate` applies.
 *
 * Event names are Publisher's own (`article[published]`, `menu[updated]`, …);
 * the full list is in its webhook form. Anything unrecognised returns nothing,
 * which the endpoint reports rather than swallowing: a webhook subscribed to
 * the wrong event should look like a misconfiguration, not like success.
 */
export function tagsForEvent(
  event: string,
  subject: { slug?: unknown } = {},
): string[] {
  const [entity] = event.split("[", 1);

  switch (entity) {
    // Publish, update, unpublish and cancel all change what a reader sees, and
    // all name the article. `article[preview]` deliberately does not: it
    // renders an unpublished draft, and must not push one into the live cache.
    case "article":
      return event === "article[preview]"
        ? []
        : tagsForArticle(str(subject.slug));

    // Routes decide which content desks exist and which desk a listing sits
    // under, so a route change moves both.
    case "route":
      return [TAGS.routes, TAGS.articles];

    case "menu":
      return [TAGS.navigation];

    // Packages are the incoming Superdesk items, before Publisher has turned
    // them into articles. The `article[*]` event that follows is the one with
    // a slug, so acting here would only revalidate early.
    default:
      return [];
  }
}

/**
 * Tags for one article — what an `article[*]` event busts, and what a manual
 * `{"slug": …}` call means.
 *
 * Deliberately generous: the article's own page, every listing, and every
 * curated list. A listing card carries the title, image and verdict that just
 * changed, and no column says which lists an article sits in. The cost is a
 * few extra re-renders; the cost of guessing too narrowly is an edit that
 * never appears.
 *
 * An event with no slug still busts the listings — better a listing refresh
 * than nothing.
 */
export function tagsForArticle(slug: string): string[] {
  return [
    ...(slug ? [TAGS.article(slug)] : []),
    TAGS.articles,
    TAGS.contentLists,
  ];
}

/**
 * Tags for one delivery — what `/api/revalidate` acts on.
 *
 * An event and the body are never combined. Every Publisher entity carries a
 * `slug`, so reading the body as a direct request would undo what the event
 * map decided: a `route[updated]` would bust an article page named after the
 * desk, and an `article[preview]` would push a draft into the live cache
 * despite the event mapping to nothing.
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
