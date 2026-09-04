import type { Metadata } from "next";
import { FaqCta } from "@/components/about/FaqCta";
import { FaqGroups } from "@/components/about/FaqGroups";
import { FaqHero } from "@/components/about/FaqHero";
import { getFaqGroups } from "@/lib/data/faqs";
import { getPage } from "@/lib/data/pages";
import { FAQ_GROUPS } from "@/lib/faqs-content";

export const metadata: Metadata = {
  title: "FAQs — PesaCheck",
  description:
    "Answers to frequently asked questions about PesaCheck — our articles, policies and how to use the site.",
};

// Revalidate every 5 minutes rather than freezing the curated list at build
// time, matching the homepage and the Media Centre.
export const revalidate = 300;

export default async function FaqsPage() {
  // An unreachable Hasura and a list nobody has curated yet arrive the same way
  // — as nothing to show — and the page has no empty state, so both fall back
  // to the design copy.
  // The questions come from their own list, grouped; the hero and the call-out
  // bar come from the page's sections like any other page. Both fall back
  // independently to the design copy.
  const [groups, page] = await Promise.all([
    getFaqGroups().catch(() => null),
    getPage("about/faqs").catch(() => null),
  ]);

  return (
    <>
      <FaqHero hero={page?.hero} />
      <FaqGroups groups={groups?.length ? groups : FAQ_GROUPS} />
      <FaqCta cta={page?.cta} />
    </>
  );
}
