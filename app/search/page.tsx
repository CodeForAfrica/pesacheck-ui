import type { Metadata } from "next";
import { SearchExplorer } from "@/components/search/SearchExplorer";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
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
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return <SearchExplorer query={q} />;
}
