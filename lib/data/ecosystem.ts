import {
  ECOSYSTEM_GROUP_SCHEME,
  findSubject,
  mapEcosystemItem,
  mapEcosystemRole,
  parseMetadata,
} from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";
import type { EcosystemGroup, EcosystemRole } from "@/lib/ecosystem-content";

/**
 * Curated list backing the Our Ecosystem page. Create it in Publisher under
 * exactly this name, one article per organisation.
 */
export const ECOSYSTEM_LIST = "Page — Our Ecosystem — Partners";

/**
 * Curated list backing the "How we build the ecosystem" cards. Separate from
 * the partner list because these are not organisations — they are what
 * PesaCheck does for the ecosystem, and the two are curated independently.
 */
export const ECOSYSTEM_ROLES_LIST = "Page — Our Ecosystem — Roles";

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
export async function getEcosystemGroups(
  listName: string = ECOSYSTEM_LIST,
): Promise<EcosystemGroup[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);

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

/**
 * The "How we build the ecosystem" cards, in curated order.
 *
 * Not capped: the grid is three columns and wraps, so a fourth role reads as a
 * second row rather than being silently dropped. What a fourth role does need
 * is an icon — see `ECOSYSTEM_ROLE_ICONS`.
 */
export async function getEcosystemRoles(
  listName: string = ECOSYSTEM_ROLES_LIST,
): Promise<EcosystemRole[]> {
  return (await getContentListArticles(listName, ANY_ROUTE)).map(
    mapEcosystemRole,
  );
}
