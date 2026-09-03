/**
 * Page queries. A static page is a Publisher **route** plus a content list of
 * its sections, so an editor can add a page without a deploy:
 *
 *   swp_route(slug: "knowledge")   declares the page exists
 *   content list "Page — Knowledge" holds its sections, first one the hero
 *
 * Unlike the listing queries, sections are **not** filtered to the language
 * routes. `LANGUAGE_ROUTE_SLUGS` exists because curated story lists get
 * polluted with non-article entries, but a page's sections are exactly what an
 * editor put in its own list — filtering them by route would drop a section
 * published anywhere other than a language desk, which is the likely case for
 * page copy.
 */

/** Routes for the tenant, which is the list of pages that can exist. */
export const GET_ROUTES = /* GraphQL */ `
  query GetRoutes($tenant: String!) {
    routes: swp_route(where: { tenant_code: { _eq: $tenant } }) {
      id
      name
      slug
      type
      staticprefix
      description
    }
  }
`;

/** A page's sections, in curated order. */
export const GET_PAGE_SECTIONS = /* GraphQL */ `
  query GetPageSections($tenant: String!, $name: String!) {
    list: swp_content_list(
      where: { name: { _eq: $name }, tenant_code: { _eq: $tenant } }
    ) {
      name
      items: swp_content_list_items(order_by: { position: asc }) {
        article: swp_article {
          id
          title
          slug
          lead
          body
          metadata
          swp_article_feature_media {
            description
            renditions: swp_image_renditions {
              name
              width
              height
              image: swp_image {
                asset_id
                file_extension
                variants
              }
            }
          }
        }
      }
    }
  }
`;
