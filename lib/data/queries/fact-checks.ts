/**
 * Fact-check listing query. Unlike the home sections (curated content lists),
 * the `/fact-checks` grid is the full body of published fact-checks, so this
 * queries `swp_article` directly.
 *
 * It selects the same article fields `GET_CONTENT_LIST_ITEMS` does so `mapStory`
 * can consume the rows unchanged — including `metadata` (jsonb) for the `Debunk`
 * verdict and `body` for `readTime`.
 *
 * **Fact-check filter (server-side):** an article is a fact-check iff it carries
 * a `Debunk` verdict. We match that via the normalized
 * `swp_article_metadata.swp_article_metadata_subjects` relation rather than the
 * jsonb `metadata` column — Hasura exposes `metadata` as an opaque `String`, so
 * it has no jsonb operators and cannot be filtered or paginated server-side. The
 * normalized relation is indexable, so it scales (production will hold tens of
 * thousands of fact-checks; the grid must never fetch them all). It also cleanly
 * excludes the other published content on the same routes (homepage
 * content-blocks, editorial test stubs). See `getFactChecks` in
 * `lib/data/stories.ts`.
 *
 * `$limit`/`$offset` page the listing; `total` returns the unpaged count so the
 * caller can compute `totalPages` without over-fetching.
 */

const FACT_CHECK_WHERE = `{
  tenant_code: { _eq: $tenant }
  published_at: { _is_null: false }
  swp_article_metadata: {
    swp_article_metadata_subjects: { scheme: { _eq: "Debunk" } }
  }
}`;

/** One page of published fact-checks (newest first) + the total count. */
export const GET_FACT_CHECK_ARTICLES = /* GraphQL */ `
  query GetFactCheckArticles($tenant: String!, $limit: Int!, $offset: Int!) {
    total: swp_article_aggregate(where: ${FACT_CHECK_WHERE}) {
      aggregate {
        totalCount: count
      }
    }
    items: swp_article(
      where: ${FACT_CHECK_WHERE}
      order_by: { published_at: desc }
      limit: $limit
      offset: $offset
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
