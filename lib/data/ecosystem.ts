import {
  ECOSYSTEM_GROUP_SCHEME,
  findSubject,
  mapEcosystemItem,
  parseMetadata,
} from "@/lib/data/map";
import { getContentListArticles } from "@/lib/data/stories";
import type { EcosystemGroup } from "@/lib/ecosystem-content";

/**
 * Curated list backing the Our Ecosystem page. Create it in Publisher under
 * exactly this name, one article per organisation.
 */
export const ECOSYSTEM_LIST = "About — Ecosystem";

/**
 * Ecosystem entries, grouped by the `ecosystem_group` vocabulary.
 *
 * Groups are not configured anywhere and are not sorted: they appear in the
 * order their first entry does in the curated list, and entries keep their
 * curated order inside each group — the same rule the FAQs page uses, so an
 * editor learns it once.
 *
 * The accent cycle runs across the whole list rather than restarting per
 * group, which is what keeps adjacent cards in different colours where the
 * groups are uneven.
 */
export async function getEcosystemGroups(): Promise<EcosystemGroup[]> {
  const articles = await getContentListArticles(ECOSYSTEM_LIST);

  const groups = new Map<string, EcosystemGroup>();
  articles.forEach((article, index) => {
    const title =
      findSubject(parseMetadata(article.metadata), ECOSYSTEM_GROUP_SCHEME)
        ?.name ?? "";

    let group = groups.get(title);
    if (!group) {
      group = { title, items: [] };
      groups.set(title, group);
    }
    group.items.push(mapEcosystemItem(article, index));
  });

  return [...groups.values()];
}
