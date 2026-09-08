import { findRendition, type RawArticle } from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";

/**
 * The two portraits beside the About page's intro copy, one article each —
 * the image is the article's feature media and its caption the alt text.
 *
 * A list rather than fields on the section, because the section already
 * carries the copy and an article holds exactly one feature image.
 */
export const INTRO_IMAGES_LIST = "Page — About — Intro Images";

export type IntroImage = { src: string; alt: string };

export async function getIntroImages(
  listName: string = INTRO_IMAGES_LIST,
): Promise<IntroImage[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);
  return articles
    .map((article: RawArticle) => {
      const renditions =
        article.swp_article_feature_media?.renditions ?? undefined;
      for (const name of ["viewImage", "baseImage", "original"]) {
        const src = findRendition(renditions, name);
        if (src) {
          return {
            src,
            alt:
              article.swp_article_feature_media?.description?.trim() ||
              article.title,
          };
        }
      }
      return null;
    })
    .filter((image): image is IntroImage => image != null);
}
