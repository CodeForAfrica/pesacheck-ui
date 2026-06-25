/**
 * Fact-check listing query. Unlike the home sections (curated content lists),
 * the `/fact-checks` grid is the full body of published fact-checks, so this
 * queries `swp_article` directly. Adapted from
 * `pesacheck-pwa-app-router/services/collectionService.queries.js`
 * (`GET_COLLECTION_LATEST_ARTICLES_QUERY`).
 *
 * It selects the same article fields `GET_CONTENT_LIST_ITEMS` does so `mapStory`
 * can consume the rows unchanged — including `metadata` (jsonb) for the `Debunk`
 * verdict and `body` for `readTime`.
 *
 * Note: there is no server-side filter that cleanly isolates fact-checks from
 * other published content (homepage content-blocks, editorial test stubs) on
 * staging — they share `route`/`profile`. The caller (`getFactChecks`) narrows
 * to articles carrying a `Debunk` verdict, which IS the product's definition of
 * a fact-check. See `lib/data/stories.ts`.
 */

/** Published articles for a tenant, newest first. */
export const GET_FACT_CHECK_ARTICLES = /* GraphQL */ `
  query GetFactCheckArticles($tenant: String!, $limit: Int = 60) {
    items: swp_article(
      where: {
        tenant_code: { _eq: $tenant }
        published_at: { _is_null: false }
      }
      order_by: { published_at: desc }
      limit: $limit
    ) {
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
`;
