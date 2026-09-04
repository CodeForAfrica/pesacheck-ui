import {
  FAQ_GROUP_SCHEME,
  findSubject,
  mapFaqItem,
  parseMetadata,
} from "@/lib/data/map";
import { getContentListArticles } from "@/lib/data/stories";
import type { FaqGroup } from "@/lib/faqs-content";

/**
 * Curated list of the FAQ questions, one article each.
 *
 * Named as a companion to `Page — FAQs`, which carries the page's hero and
 * call-out bar. They stay separate lists deliberately: a question is not a
 * page section, and the two are ordered for different reasons — question order
 * decides which group heading comes first, section order decides the page.
 * Merging them would put both rules in one list with nothing on screen to say
 * which drag did what.
 */
export const FAQ_LIST = "Page — FAQs — Questions";

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
export async function getFaqGroups(
  listName: string = FAQ_LIST,
): Promise<FaqGroup[]> {
  const articles = await getContentListArticles(listName);

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
