import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { ARTICLES, getArticleBySlug } from "@/lib/article-content";
import { CONTENT_DESKS } from "@/lib/content-desks";
import { getArticle } from "@/lib/data/article";

type Params = Promise<{ desk: string; slug: string }>;

export function generateStaticParams() {
  return CONTENT_DESKS.flatMap((desk) =>
    Object.keys(ARTICLES).map((slug) => ({ desk: desk.slug, slug })),
  );
}

async function resolveArticle(slug: string) {
  return (await getArticle(slug).catch(() => null)) ?? getArticleBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolveArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — PesaCheck`,
    description: article.leadParagraphs[0],
  };
}

export default async function DeskArticlePage({ params }: { params: Params }) {
  const { slug } = await params;

  // Article is canonical: a live fact-check sits on a language route (e.g.
  // `english`), not a curated content desk, so we don't gate on the desk slug.
  const article = await resolveArticle(slug);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
