import { Suspense } from "react";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksSkeleton } from "@/components/fact-checks/FactChecksSkeleton";
import type { ArticleType } from "@/lib/article-types";
import {
  type FilterSelection,
  parseFilterParams,
} from "@/lib/data/fact-check-filters";
import { parsePageParam } from "@/lib/data/pagination";
import { getByArticleType } from "@/lib/data/stories";

type SearchParams = Record<string, string | string[] | undefined>;

async function Listing({
  type,
  page,
  filters,
}: {
  type: ArticleType;
  page: number;
  filters: FilterSelection;
}) {
  const listing = (await getByArticleType(type, page, filters).catch(
    () => null,
  )) ?? { stories: [], page: 1, totalPages: 1, total: 0 };

  return (
    <FactChecksExplorer
      title={type.title}
      stories={listing.stories}
      page={listing.page}
      totalPages={listing.totalPages}
      filters={filters}
    />
  );
}

/**
 * The listing shared by the Quick Reads, Explainers and Longform pages: the
 * `/fact-checks` grid scoped to one article type, under the type's own heading.
 *
 * Unlike the other listings this one has no static fallback. The design pool in
 * `lib/fact-checks-content` carries no article type, so serving it here would
 * put quick reads under the Longform heading whenever Hasura is unreachable —
 * worse than the empty state, which reads correctly either way (a type nobody
 * has published yet is genuinely empty).
 */
export async function ArticleTypeListing({
  type,
  searchParams,
}: {
  type: ArticleType;
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const filters = parseFilterParams(params);

  return (
    // Keyed on the query so each filter or page change suspends afresh.
    <Suspense
      key={JSON.stringify(params)}
      fallback={<FactChecksSkeleton title={type.title} />}
    >
      <Listing type={type} page={page} filters={filters} />
    </Suspense>
  );
}
