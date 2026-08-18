import type { Metadata } from "next";
import { SearchExplorer } from "@/components/search/SearchExplorer";
import { parseFilterParams } from "@/lib/data/fact-check-filters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

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
  const filters = parseFilterParams(params);

  return <SearchExplorer query={q} filters={filters} />;
}
