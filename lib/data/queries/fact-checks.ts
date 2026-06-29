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
 * **Filtering (server-side):** the `where` is passed as a typed
 * `swp_article_bool_exp` variable built in JS (`buildFactCheckWhere` in
 * `lib/data/fact-check-filters.ts`) — it always carries the `Debunk` clause and
 * adds region/topic/language clauses for whichever filters are active. The same
 * `$where` backs both `items` and the `total` aggregate so `totalPages` reflects
 * the active filters.
 *
 * `$limit`/`$offset` page the listing; `total` returns the (filtered) unpaged
 * count so the caller can compute `totalPages` without over-fetching.
 */

/** One page of published fact-checks (newest first) + the total count. */
export const GET_FACT_CHECK_ARTICLES = /* GraphQL */ `
  query GetFactCheckArticles(
    $where: swp_article_bool_exp!
    $limit: Int!
    $offset: Int!
  ) {
    total: swp_article_aggregate(where: $where) {
      aggregate {
        totalCount: count
      }
    }
    items: swp_article(
      where: $where
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
