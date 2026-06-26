import type { Article } from "@/lib/article-content";
import { gql, TENANT_CODE } from "@/lib/data/client";
import { mapArticle, type RawFullArticle } from "@/lib/data/map";
import { GET_ARTICLE_BY_SLUG } from "@/lib/data/queries/article";

type ArticleResponse = { article: RawFullArticle[] };

/**
 * Fetch a single published fact-check by slug as the `Article` type. Throws when
 * no article matches, so pages can fall back to static content with
 * `(await getArticle(slug).catch(() => null)) ?? getArticleBySlug(slug)`.
 */
export async function getArticle(slug: string): Promise<Article> {
  const { article } = await gql<ArticleResponse>(GET_ARTICLE_BY_SLUG, {
    tenant: TENANT_CODE,
    slug,
  });

  const raw = article[0];
  if (!raw) throw new Error(`Article not found: ${slug}`);

  return mapArticle(raw);
}
