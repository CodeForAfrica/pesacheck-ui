import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksHero } from "@/components/fact-checks/FactChecksHero";
import { ARTICLES, getArticleBySlug } from "@/lib/article-content";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";
import { getArticle } from "@/lib/data/article";
import { parseFilterParams } from "@/lib/data/fact-check-filters";
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
} from "@/lib/data/stories";
import { FEATURE, FEATURE_SECONDARY, STORIES } from "@/lib/fact-checks-content";

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
  };
}

// Prerender all known content desks + all known article slugs.
export function generateStaticParams() {
  const deskParams = CONTENT_DESKS.map((desk) => ({ desk: desk.slug }));
  const articleParams = Object.keys(ARTICLES).map((slug) => ({ desk: slug }));
  return [...deskParams, ...articleParams];
}

async function resolveArticle(slug: string) {
  return (await getArticle(slug).catch(() => null)) ?? getArticleBySlug(slug);
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

  const desk = deskBySlug(slug);
  if (!desk) notFound();

  const sp = await searchParams;
  const page = parsePageParam(sp.page);
  const filters = parseFilterParams(sp);
  const listing =
    (await getByDesk(desk.slug, page, filters).catch(() => null)) ??
    staticPage(page);

  return (
    <>
      <FactChecksHero topic={desk.name} />
      <FactChecksExplorer
        stories={listing.stories}
        page={listing.page}
        totalPages={listing.totalPages}
        filters={filters}
      />
      <FactChecksContentDesks activeSlug={desk.slug} />
    </>
  );
}
