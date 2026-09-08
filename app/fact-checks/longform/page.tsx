import type { Metadata } from "next";
import { ArticleTypeListing } from "@/components/fact-checks/ArticleTypeListing";
import { LONGFORM } from "@/lib/article-types";

// Floor for when the revalidation webhook doesn't arrive. Next's default for
// a static route is an hour, which is too long for a correction.
export const revalidate = 300;

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
