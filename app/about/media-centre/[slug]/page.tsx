import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import type { Article } from "@/lib/article-content";
import { getArticle } from "@/lib/data/article";
import { isMediaCentreProfile } from "@/lib/data/map";

type Params = Promise<{ slug: string }>;

// Matches the section page rather than the article archive: these entries are
// curated alongside it and change on the same cadence.
export const revalidate = 300;

/**
 * Media Centre entries are live-only. There is no static fallback the way
 * fact-checks have one — `lib/article-content` holds sample debunks, and
 * rendering one of those here would put a fact-check at a Media Centre URL.
 *
 * The profile check is what keeps the two routes from both answering for the
 * same slug: `getArticle` looks an article up by slug alone, so without it
 * every fact-check would also resolve under `/about/media-centre/`.
 */
async function resolveEntry(slug: string): Promise<Article | null> {
  const article = await getArticle(slug).catch(() => null);
  if (!article || !isMediaCentreProfile(article.profile)) return null;
  return article;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolveEntry(slug);
  if (!article) return {};
  return {
    title: `${article.title} — PesaCheck`,
    description: article.leadParagraphs[0],
  };
}

export default async function MediaCentreEntryPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const article = await resolveEntry(slug);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
