import type { TeamMember } from "@/lib/about-content";
import type { Article } from "@/lib/article-content";
import { getRawArticle } from "@/lib/data/article";
import {
  articleExtra,
  isTeamProfile,
  mapArticle,
  mapTeamMember,
  parseMetadata,
  TEAM_FIELDS,
} from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";

/**
 * Curated list backing the "Our team" grid, named the way the other lists are.
 * Create it in Publisher under exactly this name, one article per person, and
 * the section switches from the static fallback to live staff on the next
 * request.
 *
 * Order is curated rather than alphabetical: leadership reads first, which no
 * sort would produce.
 */
export const TEAM_LIST = "About — Team";

/** Staff for the "Our team" grid, in curated order. */
export async function getTeam(): Promise<TeamMember[]> {
  return (await getContentListArticles(TEAM_LIST, ANY_ROUTE)).map(
    mapTeamMember,
  );
}

/** A staff member's page, with the two custom fields their card also uses. */
export type TeamMemberPage = {
  article: Article;
  role?: string;
  linkedin?: string;
};

/**
 * One staff member by slug, or null when the slug is not a published team
 * member. The profile check is what stops every fact-check also answering
 * under `/about/team/`, since articles are looked up by slug alone.
 */
export async function getTeamMember(
  slug: string,
): Promise<TeamMemberPage | null> {
  const raw = await getRawArticle(slug).catch(() => null);
  if (!raw || !isTeamProfile(parseMetadata(raw.metadata).profile)) return null;

  return {
    article: mapArticle(raw),
    role: articleExtra(raw, TEAM_FIELDS.role),
    linkedin: articleExtra(raw, TEAM_FIELDS.linkedin),
  };
}
