import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { LONGFORM } from "@/lib/article-types";

export const metadata: Metadata = {
  title: `${LONGFORM.title} — PesaCheck`,
  description: LONGFORM.description,
};

export default function LongformPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ArticleTypeListing type={LONGFORM} searchParams={searchParams} />;
}
