import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { QUICK_READS } from "@/lib/article-types";

// Floor for when the revalidation webhook doesn't arrive. Next's default for
// a static route is an hour, which is too long for a correction.
export const revalidate = 300;

export const metadata: Metadata = {
  title: `${QUICK_READS.title} — PesaCheck`,
  description: QUICK_READS.description,
};

export default function QuickReadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ArticleTypeListing type={QUICK_READS} searchParams={searchParams} />;
}
