import { articleExtra, findRendition, type RawArticle } from "@/lib/data/map";
import { CTA_FIELDS } from "@/lib/data/pages";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";
import type { Logo } from "@/lib/site";

/**
 * The two logo walls: allies on the Partners page and in the footer, partners
 * likewise. One article per organisation — headline is the name, feature media
 * the logo, and `cta_url` its website, reusing the link fields the tools and
 * page call-outs already use.
 */
export const ALLIES_LIST = "Page — Partners — Allies";
export const PARTNERS_LIST = "Page — Partners — Partners";

/** Rendition preference: a logo wants the largest clean copy, not a thumbnail. */
const LOGO_RENDITIONS = ["original", "baseImage", "viewImage"];

/**
 * A logo needs an image, a link and its intrinsic size — `next/image` requires
 * width and height, and a wall of logos at the wrong aspect ratio is worse
 * than one logo missing. An entry lacking any of them is dropped.
 */
function toLogo(article: RawArticle): Logo | null {
  const renditions = article.swp_article_feature_media?.renditions ?? undefined;
  const href = articleExtra(article, CTA_FIELDS.url);
  if (!renditions || !href) return null;

  for (const name of LOGO_RENDITIONS) {
    const rendition = renditions.find((r) => r.name === name);
    const src = findRendition(renditions, name);
    if (!src || !rendition?.width || !rendition?.height) continue;

    return {
      src,
      alt:
        article.swp_article_feature_media?.description?.trim() || article.title,
      width: rendition.width,
      height: rendition.height,
      href,
    };
  }
  return null;
}

/** Logos in curated order, or `[]` when the list is missing or empty. */
export async function getLogos(listName: string): Promise<Logo[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);
  return articles.map(toLogo).filter((logo): logo is Logo => logo != null);
}

/**
 * Both walls in one call. The footer renders them on every page, so they are
 * fetched together rather than twice, and each falls back on its own.
 */
export async function getLogoWalls(): Promise<{
  allies: Logo[];
  partners: Logo[];
}> {
  const [allies, partners] = await Promise.all([
    getLogos(ALLIES_LIST).catch(() => []),
    getLogos(PARTNERS_LIST).catch(() => []),
  ]);
  return { allies, partners };
}
