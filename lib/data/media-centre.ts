import {
  mapAnnouncement,
  mapNewsItem,
  mapResearchStrand,
  mapSpotlightEvent,
  mapUpcomingEvent,
} from "@/lib/data/map";
import { ANY_ROUTE, getContentListArticles } from "@/lib/data/stories";
import type {
  Announcement,
  NewsItem,
  ResearchStrand,
  SpotlightEvent,
  UpcomingEvent,
} from "@/lib/media-centre-content";

/**
 * Curated lists backing the Media Centre, named the way the homepage ones are
 * (`Homepage — Spotlight`). Create them in Publisher under exactly these names
 * and the sections switch from the static fallback to live content on the next
 * request — nothing here needs to change.
 *
 * The events list carries both the spotlight and the cards under it — first
 * item featured, the rest upcoming. What makes an event an event (venue, dates,
 * format, languages, cost) rides along as Superdesk custom fields; see
 * `EVENT_FIELDS` in `lib/data/map.ts`.
 */
export const MEDIA_CENTRE_LISTS = {
  research: "Page — Media Centre — In Research",
  news: "Page — Media Centre — In the News",
  announcements: "Page — Media Centre — Announcements",
  events: "Page — Media Centre — Spotlight",
} as const;

/**
 * Citation strands for the "In research" grid, in curated order. Each strand is
 * an article: the title is the label, the lead is the copy, the Media Centre
 * label names the document kind, and the accent comes from the article's position
 * (see `mapResearchStrand`).
 */
export async function getMediaCentreResearch(
  listName: string = MEDIA_CENTRE_LISTS.research,
): Promise<ResearchStrand[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);
  return articles.map(mapResearchStrand);
}

/** Press clippings for the "In the news" row, in curated order. */
export async function getMediaCentreNews(
  listName: string = MEDIA_CENTRE_LISTS.news,
): Promise<NewsItem[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);
  return articles.map(mapNewsItem);
}

/**
 * The events rail: the first article in the list is the spotlight, the rest
 * become the "Also coming up" cards. One list rather than two so an editor
 * promotes an event by dragging it to the top.
 *
 * Returns `null` for the spotlight when the list is missing or empty, which is
 * what tells the page to fall back to the design copy.
 */
export async function getMediaCentreEvents(
  listName: string = MEDIA_CENTRE_LISTS.events,
): Promise<{
  spotlight: SpotlightEvent | null;
  upcoming: UpcomingEvent[];
}> {
  const [featured, ...rest] = await getContentListArticles(listName, ANY_ROUTE);
  return {
    spotlight: featured ? mapSpotlightEvent(featured) : null,
    upcoming: rest.map(mapUpcomingEvent),
  };
}

/** Announcements for the list below it, in curated order. */
export async function getMediaCentreAnnouncements(
  listName: string = MEDIA_CENTRE_LISTS.announcements,
): Promise<Announcement[]> {
  const articles = await getContentListArticles(listName, ANY_ROUTE);
  return articles.map(mapAnnouncement);
}
