import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";
import { ARTICLES, getArticleBySlug } from "@/lib/article-content";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";
import { ArticleBody } from "@/components/article/ArticleBody";
import { RelatedStories } from "@/components/article/RelatedStories";

type Params = Promise<{ desk: string; slug: string }>;

export function generateStaticParams() {
  return CONTENT_DESKS.flatMap((desk) =>
    Object.keys(ARTICLES).map((slug) => ({ desk: desk.slug, slug }))
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — PesaCheck`,
    description: article.leadParagraphs[0],
  };
}

export default async function DeskArticlePage({ params }: { params: Params }) {
  const { desk: deskSlug, slug } = await params;

  // Both the desk and the article must exist.
  const desk = deskBySlug(deskSlug);
  const article = getArticleBySlug(slug);
  if (!desk || !article) notFound();

  return (
    <>
      <ArticleHero article={article} />

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex gap-5 px-5 pb-16 pt-16 sm:px-8 lg:gap-5 lg:pl-[100px] lg:pr-[100px]">
          <ArticleSidebar article={article} />
          <ArticleBody article={article} />
        </div>
      </div>

      <RelatedStories stories={article.relatedStories} />
    </>
  );
}
