import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleBodyShort } from "@/components/article/ArticleBodyShort";
import { ArticleFootnotes } from "@/components/article/ArticleFootnotes";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleHeroShort } from "@/components/article/ArticleHeroShort";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";
import { RelatedStories } from "@/components/article/RelatedStories";
import { ARTICLES, getArticleBySlug } from "@/lib/article-content";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";

type Params = Promise<{ desk: string; slug: string }>;

export function generateStaticParams() {
  return CONTENT_DESKS.flatMap((desk) =>
    Object.keys(ARTICLES).map((slug) => ({ desk: desk.slug, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
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

  // Long-form keeps the full-bleed hero layout; everything else (the default
  // debunk layout) uses the short-form layout.
  if (article.format === "long") {
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

  return (
    <>
      <ArticleHeroShort article={article} />

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex gap-5 px-5 pb-12 pt-8 sm:px-8 lg:gap-5 lg:px-[100px] lg:pb-[60px]">
          <ArticleSidebar article={article} />
          <ArticleBodyShort article={article} />
        </div>
      </div>

      <ArticleFootnotes footnotes={article.footnotes} />

      <RelatedStories stories={article.relatedStories} />
    </>
  );
}
