import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { EXPLAINERS } from "@/lib/article-types";

export const metadata: Metadata = {
  title: `${EXPLAINERS.title} — PesaCheck`,
  description: EXPLAINERS.description,
};

export default function ExplainersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ArticleTypeListing type={EXPLAINERS} searchParams={searchParams} />;
}
