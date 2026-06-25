import { gql, TENANT_CODE } from "@/lib/data/client";
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

/** One page of the fact-checks listing: the mapped cards + paging metadata. */
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
 * editorial knowledge, not derivable from the schema. Confirmed on staging;
 * mirrors the language collections in docs/migration-plan.md. PR4 reuses these
 * for the language filter.
 */
export const LANGUAGE_ROUTE_SLUGS = [
  "english",
  "français",
  "kiswahili",
  "african-languages",
];

/**
 * Fact-checks per listing page. One large feature + one secondary + an 8-card
 * grid fill a page (mirrors the Figma layout). Pages are fetched from the DB by offset
 */
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
 * fact-checks are published under topic desks (staging desks are empty;
 * everything currently sits on `english`).
 *
 * `page` is 1-based and clamped to `[1, totalPages]`.
 */
export async function getFactChecks(page = 1): Promise<FactCheckListing> {
  const { total, items } = await gql<FactCheckResponse>(
    GET_FACT_CHECK_ARTICLES,
    {
      tenant: TENANT_CODE,
      limit: FACT_CHECKS_PAGE_SIZE,
      offset: pageOffset(page, FACT_CHECKS_PAGE_SIZE),
    },
  );

  const pages = totalPages(total.aggregate.totalCount, FACT_CHECKS_PAGE_SIZE);
  return {
    stories: items.map(mapStory),
    page: clampPage(page, pages),
    totalPages: pages,
  };
}
