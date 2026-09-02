/**
 * Navigation query. Publisher stores menus in `swp_menu` as a nested set:
 * `root_id` groups a whole tree, `parent_id` gives its shape, and `lft` gives
 * sibling order.
 *
 * Every menu row for the tenant is fetched in one go rather than walking the
 * tree — a site's menus are a handful of rows, and one flat ordered list is
 * cheaper to reason about than a nested query whose relationship names differ
 * between Hasura versions. The mapper picks out the tree it wants by root.
 *
 * `uri` is the link target. `route_id` points at a Publisher route instead,
 * but the pages being linked (`/about/faqs`, `/tools`) are Next routes with no
 * Publisher equivalent, so `uri` is what the mapper reads.
 */
export const GET_MENUS = /* GraphQL */ `
  query GetMenus($tenant: String!) {
    menus: swp_menu(
      where: { tenant_code: { _eq: $tenant } }
      order_by: { lft: asc }
    ) {
      id
      name
      label
      uri
      parent_id
      root_id
      level
      extras
    }
  }
`;
