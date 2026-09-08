import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { EXPLAINERS } from "@/lib/article-types";

// Floor for when the revalidation webhook doesn't arrive. Next's default for
// a static route is an hour, which is too long for a correction.
export const revalidate = 300;

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
