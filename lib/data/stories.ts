/**
 * Story listings fetched from Hasura content lists. Each function returns the
 * Figma `Story[]` card type (via `mapStory`) so components stay on the contract.
 * Throws on network/GraphQL error — pages use the `?? fallback` pattern.
 *
 * The curated lists map 1:1 to the home sections (verified on staging):
 * `Homepage — Spotlight`, `Homepage — Trending`, `Top news`. Names use an EM
 * DASH (—, U+2014) and must match exactly.
 */
import { gql, TENANT_CODE } from "@/lib/data/client";
import { mapStory, type RawArticle } from "@/lib/data/map";
import { GET_CONTENT_LIST_ITEMS } from "@/lib/data/queries/content-lists";
import type { Story } from "@/lib/home-content";

type ContentListResponse = {
  list: { items: { article: RawArticle | null }[] }[];
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
