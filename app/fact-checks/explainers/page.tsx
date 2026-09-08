import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { EXPLAINERS } from "@/lib/article-types";

// Backstop for a revalidation webhook that never arrived (see
// `app/api/revalidate/route.ts`). Without it these pages take Next's default
// for a static route — one hour — so a correction sat behind an hour of
// cached HTML. Five minutes is the floor; the webhook is what makes it
// seconds.
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
