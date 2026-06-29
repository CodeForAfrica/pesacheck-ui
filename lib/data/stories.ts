import { gql, TENANT_CODE } from "@/lib/data/client";
import {
  buildFactCheckWhere,
  EMPTY_FILTERS,
  type FactCheckWhere,
  type FilterSelection,
} from "@/lib/data/fact-check-filters";
import { mapStory, type RawArticle } from "@/lib/data/map";
import { clampPage, pageOffset, totalPages } from "@/lib/data/pagination";
import { GET_CONTENT_LIST_ITEMS } from "@/lib/data/queries/content-lists";
import { GET_FACT_CHECK_ARTICLES } from "@/lib/data/queries/fact-checks";
import type { Story } from "@/lib/home-content";

type ContentListResponse = {
  list: { items: { article: RawArticle | null }[] }[];
};

type FactCheckResponse = {
  total: { aggregate: { totalCount: number } };
  items: RawArticle[];
};

export type FactCheckListing = {
  stories: Story[];
  page: number;
  totalPages: number;
};

/**
 * Routes for PesaCheck's publishing languages. Curated home lists mix real
 * fact-check articles (on these routes) with non-article entries — notably
 * team-member profiles on the `team` route — so we scope listings to language
 * routes. No column distinguishes a language route from any other collection
 * (`team`, `climate-change`, … are all `type: "collection"`), so this set is
 * editorial knowledge, not derivable from the schema.
 *
 * These should ideally not be hard-coded here and should be revisited once
 * we have cleaner data on staging.
 */
export const LANGUAGE_ROUTE_SLUGS = [
  "english",
  "français",
  "kiswahili",
  "african-languages",
];

export const FACT_CHECKS_PAGE_SIZE = 10;

/** Fetch a content list's language articles, in curated order, as `Story[]`. */
async function getContentListStories(name: string): Promise<Story[]> {
  const { list } = await gql<ContentListResponse>(GET_CONTENT_LIST_ITEMS, {
    tenant: TENANT_CODE,
    name,
    routeSlugs: LANGUAGE_ROUTE_SLUGS,
  });

  const items = list[0]?.items ?? [];
  return items
    .map((item) => item.article)
    .filter((article): article is RawArticle => article != null)
    .map(mapStory);
}

export function getSpotlight(): Promise<Story[]> {
  return getContentListStories("Homepage — Spotlight");
}

export function getTrending(): Promise<Story[]> {
  return getContentListStories("Homepage — Trending");
}

export function getLatest(): Promise<Story[]> {
  return getContentListStories("Top news");
}

export function getHeroPreview(): Promise<Story[]> {
  return getContentListStories("Homepage — Hero");
}

/**
 * A page of published fact-checks as `Story[]`, newest first — backs the
 * `/fact-checks` grid. Queries `swp_article` directly (not a curated list) and
 * paginates server-side via `limit`/`offset` + an `_aggregate` count.
 *
 * A "fact-check" is an article carrying a `Debunk` verdict; the query enforces
 * that server-side (see `GET_FACT_CHECK_ARTICLES`), which also excludes the
 * other published content sharing these routes (homepage content-blocks,
 * editorial test stubs). The filter is route-agnostic, so it keeps working once
 * fact-checks are published under topic desks.
 *
 * `filters` (region/topic/language) narrow the listing **server-side** — they're
 * folded into the same `where` and aggregate, so `totalPages` reflects them. See
 * `buildFactCheckWhere` in `lib/data/fact-check-filters.ts`.
 *
 * A page beyond the (filtered) result set is clamped to the last valid page and
 * re-fetched, so an out-of-range `?page=` shows the last page rather than an
 * empty grid that reads as "no matches". A genuinely empty result set
 * (`total === 0`) still returns no stories — the correct empty state.
 */
export function getFactChecks(
  page = 1,
  filters: FilterSelection = EMPTY_FILTERS,
): Promise<FactCheckListing> {
  return getFactCheckListing(buildFactCheckWhere(filters, TENANT_CODE), page);
}

/**
 * Fact-checks for a single content desk as a `FactCheckListing` — backs the desk
 * landing pages (`/fact-checks/<slug>`). A desk is a `swp_route` collection, so
 * this is `getFactChecks` scoped to that route via `buildFactCheckWhere`'s
 * `routeSlug` argument: same `Debunk` definition, same server-side pagination and
 * filtering, just narrowed to articles published on `slug`'s route.
 */
export function getByDesk(
  slug: string,
  page = 1,
  filters: FilterSelection = EMPTY_FILTERS,
): Promise<FactCheckListing> {
  return getFactCheckListing(
    buildFactCheckWhere(filters, TENANT_CODE, slug),
    page,
  );
}

/**
 * Shared paged fetch behind `getFactChecks`/`getByDesk`: runs `where` for the
 * requested page, clamps an over-range `?page=` to the last real page (so it
 * shows the last slice rather than an empty grid that reads as "no matches"),
 * and re-fetches only when the clamp actually moved the page.
 */
async function getFactCheckListing(
  where: FactCheckWhere,
  page: number,
): Promise<FactCheckListing> {
  const fetchPage = (p: number) =>
    gql<FactCheckResponse>(GET_FACT_CHECK_ARTICLES, {
      where,
      limit: FACT_CHECKS_PAGE_SIZE,
      offset: pageOffset(p, FACT_CHECKS_PAGE_SIZE),
    });

  let { total, items } = await fetchPage(page);
  const pages = totalPages(total.aggregate.totalCount, FACT_CHECKS_PAGE_SIZE);
  const current = clampPage(page, pages);

  // Requested page overran a non-empty result set → re-fetch the last real page.
  if (current !== page && total.aggregate.totalCount > 0) {
    ({ items } = await fetchPage(current));
  }

  return {
    stories: items.map(mapStory),
    page: current,
    totalPages: pages,
  };
}
