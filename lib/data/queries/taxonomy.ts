/**
 * Filter-taxonomy query — the source of the Region / Language / Topic dropdown
 * options (see `lib/data/filter-options.ts`).
 *
 * **Why sample the articles instead of querying a vocabulary table:** the
 * normalized `swp_article_metadata_subjects` relation carries only
 * `scheme`/`code` — no display `name`, no tenant column — so it can't produce a
 * labelled, tenant-scoped option list on its own. The display names live in the
 * article's `metadata` jsonb (`subject[]`, `{ scheme, code, name }`), which
 * Hasura exposes as an opaque `String`. So we read the most recent published
 * fact-checks' `metadata` and fold their subjects into option lists.
 *
 * That also gives the dropdowns the right *contents*: only taxonomy values that
 * actually appear on published fact-checks, so no option ever returns an empty
 * grid, and a newly used region/topic/language shows up with no code change.
 *
 * The sample is bounded (`$limit`, see `TAXONOMY_SAMPLE_SIZE`) and the result is
 * cached, so this never grows into a full-corpus scan.
 */

/** `metadata` (+ the normalized language) for the newest published articles. */
export const GET_FACT_CHECK_TAXONOMY = /* GraphQL */ `
  query GetFactCheckTaxonomy($where: swp_article_bool_exp!, $limit: Int!) {
    items: swp_article(
      where: $where
      order_by: { published_at: desc }
      limit: $limit
    ) {
      metadata
      swp_article_metadata {
        language
      }
    }
  }
`;

/**
 * `metadata` for the newest published fact-checks that carry a **Claim Topic**
 * — the source of the content-desk catalog (`lib/data/desks.ts`).
 *
 * Narrower than `GET_FACT_CHECK_TAXONOMY` on purpose. That one samples the
 * newest fact-checks whatever their tagging, and Claim Topic is applied to a
 * small fraction of the corpus, so which slice it reads decides which topics
 * it sees. The desk row can't live with that — a desk appearing and vanishing
 * between renders means links that 404. Pushing "has a Claim Topic" into the
 * `where` makes the server do the narrowing: `$limit` then bounds the
 * *tagged* articles read, which reaches far deeper into the corpus for the
 * same cost, and every topic it returns has published fact-checks behind it.
 */
export const GET_CLAIM_TOPICS = /* GraphQL */ `
  query GetClaimTopics($where: swp_article_bool_exp!, $limit: Int!) {
    items: swp_article(
      where: $where
      order_by: { published_at: desc }
      limit: $limit
    ) {
      metadata
    }
  }
`;
