"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pagination } from "@/components/ui/Pagination";
import {
  type FilterSelection,
  filtersToQuery,
} from "@/lib/data/fact-check-filters";

/**
 * URL-driven pagination for a server-paged listing: keeps the active query and
 * filters, changes only `?page=`. Server components can't own the click
 * handler, so this thin client wrapper does the navigation; the listing itself
 * stays server-rendered and re-fetches the new page.
 *
 * Params are taken as props (rather than read with `useSearchParams`) so this
 * doesn't force the page's client subtree out of prerendering.
 */
export function PaginationNav({
  page,
  totalPages,
  filters,
  query,
}: {
  page: number;
  totalPages: number;
  filters: FilterSelection;
  query?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(filtersToQuery(filters));
    if (query?.trim()) params.set("q", query.trim());
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => router.push(url));
  };

  return (
    <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
  );
}
