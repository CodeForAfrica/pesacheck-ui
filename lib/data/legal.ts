import { renderBody } from "@/lib/data/body";
import type { RawArticle } from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";

/**
 * Clauses of a legal document, one article each: the headline is the clause
 * title and the body its text. They are numbered by position, so list order is
 * the document's order — moving a clause renumbers everything after it, which
 * is what a legal document expects.
 */
export const PRIVACY_SECTIONS_LIST = "Page — Privacy Policy — Sections";

export type LegalSection = {
  /** The article slug, used as the clause's anchor. */
  id: string;
  title: string;
  bodyHtml: string;
};

/** Clauses in curated order, or `[]` when the list is missing or empty. */
export async function getLegalSections(
  listName: string = PRIVACY_SECTIONS_LIST,
): Promise<LegalSection[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);

  return articles
    .map((article: RawArticle) => {
      const bodyHtml = renderBody(article.body || article.lead) ?? "";
      // A clause with no text is not a clause: numbering it would leave a
      // heading with nothing under it in a document people rely on.
      return bodyHtml
        ? { id: article.slug, title: article.title, bodyHtml }
        : null;
    })
    .filter((section): section is LegalSection => section != null);
}
