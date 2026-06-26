/**
 * Single-article query.
 *
 * Selects everything `mapArticle` needs: body (HTML, rendered via
 * `renderBody`), the `Debunk` verdict (`metadata` jsonb), feature media,
 * authors, keywords, and related articles.
 *
 * Related articles select the same subset `mapStory` consumes, so they map to
 * `Story` cards unchanged.
 */
export const GET_ARTICLE_BY_SLUG = /* GraphQL */ `
  query GetArticleBySlug($tenant: String!, $slug: String!) {
    article: swp_article(
      where: {
        tenant_code: { _eq: $tenant }
        slug: { _eq: $slug }
        published_at: { _is_null: false }
      }
      limit: 1
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
        name
        staticprefix
      }
      swp_article_metadata {
        byline
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
      swp_article_authors {
        swp_author {
          name
          role
        }
      }
      swp_article_keywords {
        swp_keyword {
          name
          slug
        }
      }
      swp_article_related {
        swp_article {
          id
          title
          slug
          lead
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
    }
  }
`;
