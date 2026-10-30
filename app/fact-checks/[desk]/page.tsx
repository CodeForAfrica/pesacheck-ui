import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleView } from "@/components/article/ArticleView";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksHero } from "@/components/fact-checks/FactChecksHero";
import { FactChecksSkeleton } from "@/components/fact-checks/FactChecksSkeleton";
import { ARTICLES, getArticleBySlug } from "@/lib/article-content";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";
import { getArticle } from "@/lib/data/article";
import {
  type FilterSelection,
  parseFilterParams,
} from "@/lib/data/fact-check-filters";
import { isArchiveProfile } from "@/lib/data/map";
import {
  clampPage,
  pageOffset,
  parsePageParam,
  totalPages,
} from "@/lib/data/pagination";
import {
  FACT_CHECKS_PAGE_SIZE,
  type FactCheckListing,
  getByDesk,
  getDeskHero,
} from "@/lib/data/stories";
import { FEATURE, FEATURE_SECONDARY, STORIES } from "@/lib/fact-checks-content";

// Floor for when the revalidation webhook doesn't arrive. Next's default for
// a static route is an hour, which is too long for a correction.
export const revalidate = 300;

type Params = Promise<{ desk: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Static design pool, paged like the live query, for the desk fallback. */
const STATIC_POOL = [FEATURE, FEATURE_SECONDARY, ...STORIES];

function staticPage(page: number): FactCheckListing {
  const pages = totalPages(STATIC_POOL.length, FACT_CHECKS_PAGE_SIZE);
  const current = clampPage(page, pages);
  const start = pageOffset(current, FACT_CHECKS_PAGE_SIZE);
  return {
    stories: STATIC_POOL.slice(start, start + FACT_CHECKS_PAGE_SIZE),
    page: current,
    totalPages: pages,
    total: STATIC_POOL.length,
  };
}

// Prerender every content desk + all known article slugs. The catalog is the
// whole set of desk URLs — a desk with few published fact-checks behind it
// still has a page, and still appears in the row.
export async function generateStaticParams() {
  const articleParams = Object.keys(ARTICLES).map((slug) => ({ desk: slug }));
  return [
    ...CONTENT_DESKS.map((desk) => ({ desk: desk.slug })),
    ...articleParams,
  ];
}

async function resolveArticle(slug: string) {
  const live = await getArticle(slug).catch(() => null);
  // This segment is either a desk or an article slug, so an entry that is not
  // in the archive would be served here as a fact-check. Page sections and FAQ
  // questions were.
  if (live) return isArchiveProfile(live.profile) ? live : null;
  return getArticleBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { desk: slug } = await params;

  const article = await resolveArticle(slug);
  if (article) {
    return {
      title: `${article.title} — PesaCheck`,
      description: article.leadParagraphs[0],
    };
  }

  const desk = deskBySlug(slug);
  if (desk) {
    return {
      title: `${desk.name} Fact-Checks — PesaCheck`,
      description: `Browse PesaCheck's ${desk.name} fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.`,
    };
  }

  return {};
}

async function DeskListing({
  topics,
  page,
  filters,
}: {
  /** The desk's Claim Topic codes (`Harm_type`), not its URL slug. */
  topics: string[];
  page: number;
  filters: FilterSelection;
}) {
  const listing =
    (await getByDesk(topics, page, filters).catch(() => null)) ??
    staticPage(page);

  return (
    <FactChecksExplorer
      stories={listing.stories}
      page={listing.page}
      totalPages={listing.totalPages}
      filters={filters}
    />
  );
}

export default async function ContentDeskOrArticlePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { desk: slug } = await params;

  // Article slug takes precedence over desk slug.
  const article = await resolveArticle(slug);
  if (article) {
    return <ArticleView article={article} />;
  }

  // The catalog is curated, so the slug resolves without a round-trip.
  const desk = deskBySlug(slug);
  if (!desk) notFound();

  const sp = await searchParams;
  const page = parsePageParam(sp.page);
  const filters = parseFilterParams(sp);

  // Only the hero is awaited here: it does not change with filters, so it
  // should not be replaced by a placeholder every time one is applied.
  const heroStories = await getDeskHero(desk).catch(() => null);

  return (
    <>
      <FactChecksHero topic={desk.name} stories={heroStories ?? undefined} />
      <Suspense
        key={JSON.stringify(sp)}
        fallback={<FactChecksSkeleton title="Fact Checks" />}
      >
        <DeskListing topics={desk.topics} page={page} filters={filters} />
      </Suspense>
      <FactChecksContentDesks activeSlug={desk.slug} desks={CONTENT_DESKS} />
    </>
  );
}
