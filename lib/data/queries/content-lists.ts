/**
 * Content-list queries. Content lists are the homepage curation (manual + auto
 * lists), mapping 1:1 to Figma home sections — `Homepage — Spotlight`,
 * `Homepage — Trending`, `Top news`, etc. Adapted from
 * `pesacheck-pwa-app-router/services/contentListService.queries.js`.
 *
 * Difference from the reference: we also select `metadata` (jsonb) so the mapper
 * can read the `Debunk` verdict, `body` to compute `readTime`, and
 * `swp_article_extra` for the Superdesk custom fields the Media Centre's event
 * cards need (venue and dates, format, languages, cost).
 *
 * `$routeSlugs` filters items to articles published under those routes — the
 * curated lists are polluted with non-article entries (e.g. team-member
 * profiles on the `team` route), so callers scope to the language routes. See
 * `LANGUAGE_ROUTE_SLUGS` in `stories.ts`. There is no structural marker that
 * separates language routes from other collections, so the set is editorial.
 */

/** Items of a single content list, ordered by curated position. */
export const GET_CONTENT_LIST_ITEMS = /* GraphQL */ `
  query GetContentListItems(
    $tenant: String!
    $name: String!
    $routeSlugs: [String!]!
  ) {
    list: swp_content_list(
      where: { name: { _eq: $name }, tenant_code: { _eq: $tenant } }
    ) {
      name
      items: swp_content_list_items(
        where: { swp_article: { swp_route: { slug: { _in: $routeSlugs } } } }
        order_by: { position: asc }
      ) {
        article: swp_article {
          id
          title
          slug
          lead
          body
          published_at
          metadata
          swp_route {
            slug
            staticprefix
          }
          swp_article_extra {
            field_name
            value
          }
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

/**
 * The same list, unfiltered by route. For a list whose membership is
 * deliberate — a page's sections, the team, the ecosystem — where the content
 * is published on its own page's route and the language filter would drop it.
 */
export const GET_CONTENT_LIST_ITEMS_ANY_ROUTE = /* GraphQL */ `
  query GetContentListItemsAnyRoute($tenant: String!, $name: String!) {
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
          published_at
          metadata
          swp_route {
            slug
            staticprefix
          }
          swp_article_extra {
            field_name
            value
          }
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
