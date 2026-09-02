import { gql, TENANT_CODE } from "@/lib/data/client";
import type { FilterDimension } from "@/lib/data/fact-check-filters";
import { GET_MENUS } from "@/lib/data/queries/navigation";
import {
  NAV_ICON_BY_FILTER,
  NAV_ICON_BY_HREF,
  NAV_ICON_FALLBACK,
  NAV_MENU_META,
  type NavIconKey,
  type NavLink,
  type NavMenuItem,
} from "@/lib/site";

/**
 * The menu that drives the header. Create it in Publisher under exactly this
 * name and the nav switches from the static fallback to live links on the next
 * revalidation.
 */
export const MAIN_NAVIGATION = "Main Navigation";

/** One row of `swp_menu`, as selected by `GET_MENUS`. */
type RawMenu = {
  id: number;
  name?: string | null;
  label?: string | null;
  uri?: string | null;
  parent_id?: number | null;
  root_id?: number | null;
  level?: number | null;
  extras?: string | null;
};

/**
 * Publisher's menu API accepts only `name`, `label`, `uri`, `parent` and
 * `route`, rejecting anything else with "This form should not contain extra
 * fields" — the `extras` column is not writable through it. So the menu
 * carries structure (which links exist, their labels, order and targets) and
 * everything presentational is resolved here from the destination.
 *
 * The one exception an editor can express is the filter dimension, which rides
 * in the URL: `/fact-checks?filter=language` opens the header's filter panel
 * on that dimension instead of navigating.
 */
const FILTER_DIMENSIONS: FilterDimension[] = ["language", "topic", "region"];

/** Split `/fact-checks?filter=language` into its href and dimension. */
function parseHref(uri: string): {
  href: string;
  filterDimension?: FilterDimension;
} {
  const [path, query] = uri.split("?", 2);
  if (!query) return { href: uri };

  const requested = new URLSearchParams(query).get("filter");
  const filterDimension = FILTER_DIMENSIONS.find((d) => d === requested);

  // An unrecognised query stays on the href — it may mean something to the
  // page — while a recognised one is consumed, being an instruction to the
  // header rather than part of the destination.
  return filterDimension ? { href: path, filterDimension } : { href: uri };
}

function iconFor(href: string, filterDimension?: FilterDimension): NavIconKey {
  if (filterDimension) {
    return NAV_ICON_BY_FILTER[filterDimension] ?? NAV_ICON_FALLBACK;
  }
  return NAV_ICON_BY_HREF[href] ?? NAV_ICON_FALLBACK;
}

/**
 * Items with no label or destination are dropped rather than rendered as dead
 * links: a nav entry that goes nowhere is worse than one that is missing,
 * because it still looks clickable.
 */
function toMenuItem(row: RawMenu): NavMenuItem | null {
  const label = row.label?.trim() || row.name?.trim();
  const uri = row.uri?.trim();
  if (!label || !uri) return null;

  const { href, filterDimension } = parseHref(uri);
  return {
    label,
    href,
    icon: iconFor(href, filterDimension),
    ...(filterDimension ? { filterDimension } : {}),
  };
}

/**
 * Build the header's links from Publisher's `Main Navigation` menu.
 *
 * The tree is three levels: the root is the menu itself, its children are the
 * top-level links, and their children are mega-menu items. A top-level link
 * with children becomes a mega-menu; one without is a plain link — nothing
 * needs configuring for that, it follows from the shape of the tree.
 *
 * Returns `[]` when the menu is absent or has no usable links, which is what
 * tells the layout to keep the static nav.
 */
export async function getNavigation(
  name = MAIN_NAVIGATION,
): Promise<NavLink[]> {
  const { menus } = await gql<{ menus: RawMenu[] }>(GET_MENUS, {
    tenant: TENANT_CODE,
  });

  const root = menus.find((m) => m.name === name && m.parent_id == null);
  if (!root) return [];

  const childrenOf = (id: number) =>
    menus.filter((m) => m.parent_id === id && m.id !== id);

  const links: NavLink[] = [];
  for (const row of childrenOf(root.id)) {
    const label = row.label?.trim() || row.name?.trim();
    if (!label) continue;

    const items = childrenOf(row.id)
      .map(toMenuItem)
      .filter((item): item is NavMenuItem => item != null);

    // A link with a menu can borrow its first item's destination, which is
    // what the static nav does (About Us → /about).
    const uri = row.uri?.trim();
    const href = uri ? parseHref(uri).href : items[0]?.href;
    if (!href) continue;

    const meta = NAV_MENU_META[href];
    links.push({
      label,
      href,
      ...(items.length > 0
        ? {
            menu: {
              description: meta?.description ?? "",
              items,
              ...(meta?.rows ? { rows: meta.rows } : {}),
            },
          }
        : {}),
    });
  }

  return links;
}
