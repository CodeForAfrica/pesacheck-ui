/**
 * Route queries. Routes are PesaCheck's content desks + sections (collections)
 * and CMS pages (content). Ported/adapted from
 * `pesacheck-pwa-app-router/services/routeService.queries.js`.
 */

/** Collection-type routes for a tenant — the content desks. */
export const GET_COLLECTION_ROUTES = /* GraphQL */ `
  query GetCollectionRoutes($tenant: String!) {
    swp_route(
      where: { tenant_code: { _eq: $tenant }, type: { _eq: "collection" } }
      order_by: { name: asc }
    ) {
      id
      name
      slug
      type
    }
  }
`;
