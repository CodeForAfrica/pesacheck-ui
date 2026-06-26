import type { Metadata } from "next";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import {
  filtersToQuery,
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

export const metadata: Metadata = {
  title: "Fact-Checks — PesaCheck",
  description:
    "Browse PesaCheck's fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.",
};

/** Static design pool, paged the same way as the live query, for fallback. */
const STATIC_POOL = [FEATURE, FEATURE_SECONDARY, ...STORIES];

function staticPage(page: number): FactCheckListing {
  const pages = totalPages(STATIC_POOL.length, FACT_CHECKS_PAGE_SIZE);
  const current = clampPage(page, pages);
  const start = pageOffset(current, FACT_CHECKS_PAGE_SIZE);
  return {
    stories: STATIC_POOL.slice(start, start + FACT_CHECKS_PAGE_SIZE),
    page: current,
    totalPages: pages,
  };
}

export default async function FactChecksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const filters = parseFilterParams(params);

  // Filters narrow the grid server-side; the static fallback ignores them (it's
  // a degraded mode for when Hasura is unreachable) and just pages the design pool.
  const listing =
    (await getFactChecks(page, filters).catch(() => null)) ?? staticPage(page);

  return (
    <>
      <FactChecksExplorer
        // Re-key on the applied filters so navigation resets the staged selection.
        key={JSON.stringify(filtersToQuery(filters))}
        stories={listing.stories}
        page={listing.page}
        totalPages={listing.totalPages}
        filters={filters}
      />
      <FactChecksContentDesks />
    </>
  );
}
