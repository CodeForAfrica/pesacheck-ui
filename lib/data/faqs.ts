import {
  FAQ_GROUP_SCHEME,
  findSubject,
  mapFaqItem,
  parseMetadata,
} from "@/lib/data/map";
import { getContentListArticles } from "@/lib/data/stories";
import type { FaqGroup } from "@/lib/faqs-content";

/**
 * Curated list backing the FAQs page, named the way the other lists are.
 * Create it in Publisher under exactly this name, one article per question,
 * and the page switches from the static fallback to live content on the next
 * request.
 */
export const FAQ_LIST = "About — FAQs";

/**
 * Questions for the FAQs page, grouped by the `faq_group` vocabulary.
 *
 * Groups are not configured anywhere and are not sorted: they appear in the
 * order their first question does in the curated list, and questions keep
 * their curated order inside each group. That makes list position the single
 * thing an editor arranges — dragging a question to the top of the list
 * promotes its whole group.
 *
 * Untagged questions collect in one leading group with no title, which the
 * page renders without a heading rather than dropping.
 */
export async function getFaqGroups(): Promise<FaqGroup[]> {
  const articles = await getContentListArticles(FAQ_LIST);

  const groups = new Map<string, FaqGroup>();
  for (const article of articles) {
    const title =
      findSubject(parseMetadata(article.metadata), FAQ_GROUP_SCHEME)?.name ??
      "";

    let group = groups.get(title);
    if (!group) {
      group = { title, items: [] };
      groups.set(title, group);
    }
    group.items.push(mapFaqItem(article));
  }

  return [...groups.values()];
}
