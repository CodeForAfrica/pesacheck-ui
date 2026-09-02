import { renderBody } from "@/lib/data/body";
import { gql, TENANT_CODE } from "@/lib/data/client";
import { findRendition, type RawArticle } from "@/lib/data/map";
import { GET_PAGE_SECTIONS, GET_ROUTES } from "@/lib/data/queries/pages";

/**
 * A page's sections live in a content list named for its route: the route
 * `knowledge` is backed by `Page — Knowledge`. Naming it after the route's
 * **name** rather than its slug keeps the list readable in Publisher's picker,
 * where an editor sees a column of list names and nothing else.
 */
export const PAGE_LIST_PREFIX = "Page — ";

export function pageListName(routeName: string): string {
  return `${PAGE_LIST_PREFIX}${routeName}`;
}

/** The banner at the top of a page. */
export type PageHero = {
  title: string;
  subtitle: string;
  image?: string;
};

/** One titled, anchor-linkable section of a page's body. */
export type PageSection = {
  /** The article slug, used as the in-page anchor. */
  id: string;
  title: string;
  /** Sanitised HTML — paragraphs, lists and images as authored. */
  bodyHtml: string;
  image?: string;
};

export type Page = {
  slug: string;
  title: string;
  description?: string;
  hero: PageHero;
  sections: PageSection[];
};

type RawRoute = {
  id: number;
  name?: string | null;
  slug?: string | null;
  type?: string | null;
  staticprefix?: string | null;
  description?: string | null;
};

type SectionsResponse = {
  list: { name: string; items: { article: RawArticle | null }[] }[];
};

/** Every route for the tenant — the set of pages that can exist. */
export async function getRoutes(): Promise<RawRoute[]> {
  const { routes } = await gql<{ routes: RawRoute[] }>(GET_ROUTES, {
    tenant: TENANT_CODE,
  });
  return routes;
}

/** The hero standfirst is plain text: it sits over artwork, not in prose. */
function heroText(lead: string | null | undefined): string {
  return (
    renderBody(lead)
      ?.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}

function sectionImage(article: RawArticle): string | undefined {
  const renditions = article.swp_article_feature_media?.renditions ?? undefined;
  for (const name of ["viewImage", "baseImage", "original"]) {
    const url = findRendition(renditions, name);
    if (url) return url;
  }
  return undefined;
}

/**
 * Fetch a page by route slug, or null when no such route exists or its list is
 * empty. Null is what tells a page to fall back to its static content, and
 * what makes the catch-all route 404 rather than render an empty shell.
 *
 * The **first** item in the list is the hero — its headline is the page title
 * and its lead the standfirst — and the rest are body sections. That keeps the
 * hero editable as just another section, at the cost that reordering the list
 * changes which section is the banner.
 */
export async function getPage(slug: string): Promise<Page | null> {
  const route = (await getRoutes()).find((r) => r.slug === slug);
  if (!route?.name) return null;

  const { list } = await gql<SectionsResponse>(GET_PAGE_SECTIONS, {
    tenant: TENANT_CODE,
    name: pageListName(route.name),
  });

  const articles = (list[0]?.items ?? [])
    .map((item) => item.article)
    .filter((article): article is RawArticle => article != null);

  const [heroArticle, ...rest] = articles;
  if (!heroArticle) return null;

  return {
    slug,
    title: route.name,
    description: route.description?.trim() || undefined,
    hero: {
      title: heroArticle.title,
      subtitle: heroText(heroArticle.lead),
      image: sectionImage(heroArticle),
    },
    sections: rest.map((article) => ({
      id: article.slug,
      title: article.title,
      // The body carries the section's paragraphs, bullet lists and images as
      // authored, which is what lets one renderer serve pages whose designs
      // differ only in the blocks they use.
      bodyHtml: renderBody(article.body || article.lead) ?? "",
      image: sectionImage(article),
    })),
  };
}
