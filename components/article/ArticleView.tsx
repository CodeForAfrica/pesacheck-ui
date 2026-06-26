import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleBodyShort } from "@/components/article/ArticleBodyShort";
import { ArticleFootnotes } from "@/components/article/ArticleFootnotes";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleHeroShort } from "@/components/article/ArticleHeroShort";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";
import { RelatedStories } from "@/components/article/RelatedStories";
import type { Article } from "@/lib/article-content";

export function ArticleView({ article }: { article: Article }) {
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
        {article.relatedStories.length > 0 && (
          <RelatedStories stories={article.relatedStories} />
        )}
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
      {article.footnotes.length > 0 && (
        <ArticleFootnotes footnotes={article.footnotes} />
      )}
      {article.relatedStories.length > 0 && (
        <RelatedStories stories={article.relatedStories} />
      )}
    </>
  );
}
