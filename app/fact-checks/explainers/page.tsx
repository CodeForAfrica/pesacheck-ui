import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { EXPLAINERS } from "@/lib/article-types";

// Backstop for a revalidation webhook that never arrived (see
// `app/api/revalidate/route.ts`): without it these pages are prerendered once
// and never rebuilt, so a Superdesk edit would wait for the next deploy.
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
