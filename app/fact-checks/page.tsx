import type { Metadata } from "next";
import { Suspense } from "react";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksSkeleton } from "@/components/fact-checks/FactChecksSkeleton";
import {
  type FilterSelection,
  parseFilterParams,
} from "@/lib/data/fact-check-filters";
import {
  clampPage,
  pageOffset,
  parsePageParam,
  totalPages,
} from "@/lib/data/pagination";
import {
  FACT_CHECKS_PAGE_SIZE,
  type FactCheckListing,
  getFactChecks,
} from "@/lib/data/stories";
import { FEATURE, FEATURE_SECONDARY, STORIES } from "@/lib/fact-checks-content";

// Floor for when the revalidation webhook doesn't arrive. Next's default for
// a static route is an hour, which is too long for a correction.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fact-Checks — PesaCheck",
  description:
    "Browse PesaCheck's fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.",
};

/** Static design pool, paged the same way as the live query, for fallback. */
const STATIC_POOL = [FEATURE, FEATURE_SECONDARY, ...STORIES];

const LISTING_TITLE = "Fact Checks";

function staticPage(page: number): FactCheckListing {
  const pages = totalPages(STATIC_POOL.length, FACT_CHECKS_PAGE_SIZE);
  const current = clampPage(page, pages);
  const start = pageOffset(current, FACT_CHECKS_PAGE_SIZE);
  return {
    stories: STATIC_POOL.slice(start, start + FACT_CHECKS_PAGE_SIZE),
    page: current,
    totalPages: pages,
    total: STATIC_POOL.length,
  };
}

/**
 * The listing itself, separated so it can suspend on its own: the filters and
 * the search bar stay interactive while a query is in flight, and only the
 * results are replaced by placeholders.
 */
async function Listing({
  page,
  filters,
}: {
  page: number;
  filters: FilterSelection;
}) {
  // Filters narrow the grid server-side; the static fallback ignores them (it's
  // a degraded mode for when Hasura is unreachable) and just pages the design pool.
  const listing =
    (await getFactChecks(page, filters).catch(() => null)) ?? staticPage(page);

  return (
    <FactChecksExplorer
      stories={listing.stories}
      page={listing.page}
      totalPages={listing.totalPages}
      filters={filters}
      title={LISTING_TITLE}
    />
  );
}

export default async function FactChecksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const filters = parseFilterParams(params);

  return (
    // Keyed on the query so every filter or page change suspends afresh —
    // without it React reuses the resolved boundary and the reader sees the
    // previous results until the new ones land, with nothing to say the page
    // is working.
    <Suspense
      key={JSON.stringify(params)}
      fallback={<FactChecksSkeleton title={LISTING_TITLE} />}
    >
      <Listing page={page} filters={filters} />
    </Suspense>
  );
}
