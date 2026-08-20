import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { QUICK_READS } from "@/lib/article-types";

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
