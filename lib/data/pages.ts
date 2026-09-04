import { renderBody } from "@/lib/data/body";
import { gql, TENANT_CODE } from "@/lib/data/client";
import {
  articleExtra,
  findRendition,
  findSubject,
  parseMetadata,
  type RawArticle,
} from "@/lib/data/map";
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

/**
 * Vocabulary marking what a section is on its page. Only `hero` means
 * anything: it names the section that becomes the banner, so the hero can be
 * moved, replaced or reordered without its position mattering.
 *
 * A page whose sections carry no tag falls back to treating the first item as
 * the hero, which is how the first pages were authored.
 */
export const PAGE_SECTION_SCHEME = "page_section_role";
export const HERO_CODE = "hero";
export const CTA_CODE = "cta";

/**
 * Superdesk custom fields for a call-to-action section's button. The copy is
 * the section's own headline and lead; only the button has nowhere else to
 * live. Both optional — without a URL there is no button, and the section
 * renders as an ordinary one.
 */
export const CTA_FIELDS = {
  label: "cta_label",
  url: "cta_url",
} as const;

/** The role an article is tagged with on its page, if any. */
function roleOf(article: RawArticle): string | undefined {
  return findSubject(parseMetadata(article.metadata), PAGE_SECTION_SCHEME)
    ?.code;
}

/** The banner at the top of a page. */
export type PageHero = {
  title: string;
  subtitle: string;
  image?: string;
};

/** The call-out bar at the foot of a page. */
export type PageCta = {
  heading: string;
  body: string;
  label: string;
  href: string;
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
  /** Present only when a section is tagged `cta` and carries a URL. */
  cta?: PageCta;
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

/**
 * A section's in-page anchor, from its slug.
 *
 * Slugs are unique across the whole tenant, but anchors only need to be unique
 * within a page — and two pages legitimately both have a "Who We Are". So a
 * slugline may be namespaced with its page (`methodology-who-we-are`) and the
 * page prefix is stripped here, leaving the anchor the design intended.
 *
 * A section whose own name starts with the page name (`about` / `about-us`)
 * would lose that word; namespacing is opt-in precisely so an editor can avoid
 * it by leaving the slugline unprefixed where the plain one is free.
 */
function sectionAnchor(slug: string, routeSlug: string): string {
  const prefix = `${routeSlug}-`;
  return slug.startsWith(prefix) && slug.length > prefix.length
    ? slug.slice(prefix.length)
    : slug;
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
 * A tagged section becomes a CTA only when it names somewhere to go. Without a
 * URL the button would be decorative, so the section is dropped rather than
 * rendered as a dead call to action.
 */
function toCta(article: RawArticle | undefined): PageCta | undefined {
  if (!article) return undefined;
  const href = articleExtra(article, CTA_FIELDS.url);
  if (!href) return undefined;

  return {
    heading: article.title,
    body: heroText(article.lead),
    label: articleExtra(article, CTA_FIELDS.label) ?? "Get in touch",
    href,
  };
}

/**
 * Fetch a page by URL path, or null when no such route exists or its list is
 * empty. Null is what tells a page to fall back to its static content, and
 * what makes the catch-all route 404 rather than render an empty shell.
 *
 * The hero is the section tagged `hero` through `PAGE_SECTION_SCHEME`: its
 * headline is the page title, its lead the standfirst and its feature media
 * the banner image. Tagging rather than position means the hero can sit
 * anywhere in the list and be swapped for another section without dragging.
 *
 * Untagged pages fall back to the first item, so the pages authored before the
 * vocabulary existed keep working.
 */
export async function getPage(path: string): Promise<Page | null> {
  const wanted = `/${path.replace(/^\/+|\/+$/g, "")}`;

  // Matched on the static prefix, which is the URL Publisher serves the route
  // at, so a nested page like `/about/principles` resolves without this
  // needing to know it is nested. Deliberately not falling back to the slug:
  // that would also serve `/about/principles` at `/principles`, giving one
  // page two URLs.
  const route = (await getRoutes()).find((r) => r.staticprefix === wanted);
  if (!route?.name) return null;

  const { list } = await gql<SectionsResponse>(GET_PAGE_SECTIONS, {
    tenant: TENANT_CODE,
    name: pageListName(route.name),
  });

  const articles = (list[0]?.items ?? [])
    .map((item) => item.article)
    .filter((article): article is RawArticle => article != null);

  // An explicit tag wins; otherwise the first item is the hero, which is how
  // pages authored before the vocabulary existed still work.
  const taggedHero = articles.find((a) => roleOf(a) === HERO_CODE);
  const heroArticle = taggedHero ?? articles[0];
  if (!heroArticle) return null;

  const ctaArticle = articles.find(
    (a) => a !== heroArticle && roleOf(a) === CTA_CODE,
  );
  const cta = toCta(ctaArticle);

  // A CTA is lifted out of the body — it is a call-out bar at the foot of the
  // page, not something the rail scrolls to. Only when it became one, though:
  // a tagged section with no URL stays an ordinary section rather than
  // disappearing from the page altogether.
  const rest = articles.filter(
    (article) =>
      article !== heroArticle && !(cta !== undefined && article === ctaArticle),
  );

  return {
    slug: path,
    title: route.name,
    description: route.description?.trim() || undefined,
    hero: {
      title: heroArticle.title,
      subtitle: heroText(heroArticle.lead),
      image: sectionImage(heroArticle),
    },
    cta,
    sections: rest.map((article) => ({
      id: sectionAnchor(article.slug, route.slug ?? ""),
      title: article.title,
      // The body carries the section's paragraphs, bullet lists and images as
      // authored, which is what lets one renderer serve pages whose designs
      // differ only in the blocks they use.
      bodyHtml: renderBody(article.body || article.lead) ?? "",
      image: sectionImage(article),
    })),
  };
}
