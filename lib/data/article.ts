import type { Article } from "@/lib/article-content";
import { TAGS } from "@/lib/data/cache";
import { gql, TENANT_CODE } from "@/lib/data/client";
import { mapArticle, type RawFullArticle } from "@/lib/data/map";
import { GET_ARTICLE_BY_SLUG } from "@/lib/data/queries/article";

type ArticleResponse = { article: RawFullArticle[] };

/**
 * Fetch a single published article by slug as the raw row, or null when none
 * matches. Callers that need more than the `Article` type carries — the
 * content profile, or a custom field — read it from here and map it
 * themselves; `getArticle` is this plus `mapArticle`.
 */
export async function getRawArticle(
  slug: string,
): Promise<RawFullArticle | null> {
  const { article } = await gql<ArticleResponse>(
    GET_ARTICLE_BY_SLUG,
    { tenant: TENANT_CODE, slug },
    { tags: [TAGS.article(slug)] },
  );
  return article[0] ?? null;
}

/**
 * Fetch a single published fact-check by slug as the `Article` type. Throws when
 * no article matches, so pages can fall back to static content with
 * `(await getArticle(slug).catch(() => null)) ?? getArticleBySlug(slug)`.
 */
export async function getArticle(slug: string): Promise<Article> {
  const raw = await getRawArticle(slug);
  if (!raw) throw new Error(`Article not found: ${slug}`);

  return mapArticle(raw);
}
