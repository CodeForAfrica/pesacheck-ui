import { articleExtra, findRendition, type RawArticle } from "@/lib/data/map";
import { CTA_FIELDS } from "@/lib/data/pages";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";
import type { Tool } from "@/lib/tools-content";

/**
 * Curated list of the tools shown on `/tools`, one article each.
 *
 * A tool is an article plus a link: headline is the name, lead the tagline,
 * body the description, feature media the screenshot, and the card's button
 * reuses the `cta_url` / `cta_label` fields the page call-outs already use —
 * a second pair of link fields would only be the same thing under a different
 * name.
 */
export const TOOLS_LIST = "Page — Tools — Tools";

/** Every card says the same thing unless an editor overrides it. */
const DEFAULT_CTA = "Visit website";

/** The whole card links out, so a tool without a URL has nowhere to go. */
function toolHref(article: RawArticle): string | undefined {
  return articleExtra(article, CTA_FIELDS.url);
}

function toolImage(article: RawArticle): string | undefined {
  const renditions = article.swp_article_feature_media?.renditions ?? undefined;
  for (const name of ["viewImage", "baseImage", "original"]) {
    const url = findRendition(renditions, name);
    if (url) return url;
  }
  return undefined;
}

function plain(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tools in curated order. An entry with no link or no screenshot is dropped:
 * the card is a full-bleed image that is entirely a link, so neither degrades
 * into something worth rendering.
 */
export async function getTools(listName: string = TOOLS_LIST): Promise<Tool[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);

  return articles
    .map((article) => {
      const href = toolHref(article);
      const image = toolImage(article);
      if (!href || !image) return null;

      return {
        name: article.title,
        tagline: plain(article.lead),
        body: plain(article.body),
        cta: articleExtra(article, CTA_FIELDS.label) ?? DEFAULT_CTA,
        image,
        href,
      };
    })
    .filter((tool): tool is Tool => tool != null);
}
