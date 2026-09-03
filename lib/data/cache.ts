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

/** One changed row, as a webhook describes it — only the columns tags need. */
export type ChangedRow = {
  slug?: unknown;
  name?: unknown;
  tenant_code?: unknown;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Cache tags for a changed row of `table` — the map `/api/revalidate` applies
 * to a Hasura event payload.
 *
 * An unknown table returns nothing, which the endpoint reports rather than
 * swallowing: a trigger on a table nobody reads should look like a
 * misconfiguration, not like success.
 */
export function tagsForTable(table: string, row: ChangedRow = {}): string[] {
  switch (table) {
    // The child tables carry an `article_id` but no slug, so a change there
    // refreshes the listings and not the article's own page. That is not the
    // gap it looks like: Publisher rewrites the `swp_article` row whenever
    // Superdesk republishes, and that event names the slug.
    case "swp_article":
    case "swp_article_extra":
    case "swp_article_metadata": {
      const slug = str(row.slug);
      return [
        ...(slug ? [TAGS.article(slug)] : []),
        TAGS.articles,
        TAGS.contentLists,
      ];
    }

    // A list's items are rows of their own, and they carry no list name — so
    // a reorder can only say "some list changed".
    case "swp_content_list":
    case "swp_content_list_item": {
      const name = str(row.name);
      return [...(name ? [TAGS.contentList(name)] : []), TAGS.contentLists];
    }

    // Routes decide which desks exist and which desk a listing belongs to.
    case "swp_route":
      return [TAGS.routes, TAGS.articles];

    case "swp_menu":
      return [TAGS.navigation];

    default:
      return [];
  }
}

/**
 * Tags for an article named directly — a manual `curl`, or a Superdesk-side
 * webhook shaped by hand. Same breadth as the `swp_article` event: the article
 * plus everything that lists it.
 */
export function tagsForArticle(slug: string): string[] {
  return [TAGS.article(slug), TAGS.articles, TAGS.contentLists];
}
