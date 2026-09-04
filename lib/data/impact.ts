import { findSubject, parseMetadata, type RawArticle } from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";
import { type ImpactStat, NAV_ICONS, type NavIconKey } from "@/lib/site";

/**
 * The four figures in the impact band, one article each: the headline is the
 * figure ("10,000+ Fact-checks") and the lead the line beneath it.
 */
export const IMPACT_LIST = "Page — About — Impact";

/**
 * Vocabulary naming a stat's icon. Its qcodes are `NAV_ICONS` keys — the same
 * fixed set the navigation draws from, since a component cannot come from a
 * CMS and there is no reason for a second registry of the same icons.
 */
export const IMPACT_ICON_SCHEME = "impact_icon";

const FALLBACK_ICON: NavIconKey = "globe";

function iconFor(article: RawArticle): NavIconKey {
  const code = findSubject(
    parseMetadata(article.metadata),
    IMPACT_ICON_SCHEME,
  )?.code;
  return code && code in NAV_ICONS ? (code as NavIconKey) : FALLBACK_ICON;
}

function plain(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Impact figures in curated order. An untagged stat gets the fallback icon
 * rather than rendering an empty badge, the way the ecosystem roles do.
 */
export async function getImpactStats(
  listName: string = IMPACT_LIST,
): Promise<ImpactStat[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);
  return articles.map((article) => ({
    icon: iconFor(article),
    value: article.title,
    label: plain(article.lead),
  }));
}
