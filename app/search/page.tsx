import type { Metadata } from "next";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import {
  hasActiveFilters,
  parseFilterParams,
} from "@/lib/data/fact-check-filters";
import { getFilterOptions } from "@/lib/data/filter-options";
import { parsePageParam } from "@/lib/data/pagination";
import {
  type FactCheckListing,
  getFactChecks,
  searchFactChecks,
} from "@/lib/data/stories";
import {
  FALLBACK_FILTER_OPTIONS,
  FEATURE,
  FEATURE_SECONDARY,
  STORIES,
} from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Design pool, used only when Hasura is unreachable. */
const STATIC_POOL: Story[] = [FEATURE, FEATURE_SECONDARY, ...STORIES];

const EMPTY_LISTING: FactCheckListing = {
  stories: [],
  page: 1,
  totalPages: 1,
  total: 0,
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" — PesaCheck` : "Search — PesaCheck",
    description: "Search PesaCheck fact-checks, articles, and topics.",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const page = parsePageParam(params.page);
  const filters = parseFilterParams(params);
  const searched = Boolean(q.trim()) || hasActiveFilters(filters);

  // Results + the option labels for the "searched for" line, each degrading on
  // its own. Searching only runs once there's something to search for; an
  // unsearched page just shows the prompt and the latest fact-checks.
  const [listing, filterOptions] = await Promise.all([
    searched
      ? searchFactChecks(q, page, filters).catch(() => null)
      : Promise.resolve(EMPTY_LISTING),
    getFilterOptions().catch(() => null),
  ]);

  // The "Latest Articles" strip only appears under an empty state, so it's only
  // worth a query when there's nothing to list.
  const needsLatest = !listing || listing.stories.length === 0;
  const latest = needsLatest
    ? await getFactChecks(1)
        .then((l) => l.stories)
        .catch(() => STATIC_POOL)
    : [];

  return (
    <SearchExplorer
      query={q}
      filters={filters}
      filterOptions={filterOptions ?? FALLBACK_FILTER_OPTIONS}
      listing={listing ?? EMPTY_LISTING}
      // A failed search must not read as "no matches found".
      unavailable={listing === null}
      // 7 cards fill the strip's two rows in the design.
      latest={latest.slice(0, 7)}
    />
  );
}
