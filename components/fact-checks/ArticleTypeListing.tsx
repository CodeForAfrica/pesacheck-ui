import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import type { ArticleType } from "@/lib/article-types";
import { parseFilterParams } from "@/lib/data/fact-check-filters";
import { parsePageParam } from "@/lib/data/pagination";
import { getByContentType } from "@/lib/data/stories";

type SearchParams = Record<string, string | string[] | undefined>;

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

  const listing = (await getByContentType(type.codes, page, filters).catch(
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
