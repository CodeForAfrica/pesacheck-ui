import { mapAnnouncement, mapNewsItem } from "@/lib/data/map";
import { getContentListArticles } from "@/lib/data/stories";
import type { Announcement, NewsItem } from "@/lib/media-centre-content";

/**
 * Curated lists backing the Media Centre, named the way the homepage ones are
 * (`Homepage — Spotlight`). Create them in Publisher under exactly these names
 * and the sections switch from the static fallback to live content on the next
 * request — nothing here needs to change.
 *
 * The event spotlight has no list: an event carries a venue, dates, format,
 * languages and cost, none of which a Superdesk article can express yet, so it
 * still reads from `lib/media-centre-content`.
 */
export const MEDIA_CENTRE_LISTS = {
  news: "Media Centre — In the News",
  announcements: "Media Centre — Announcements",
} as const;

/** Press clippings for the "In the news" row, in curated order. */
export async function getMediaCentreNews(): Promise<NewsItem[]> {
  const articles = await getContentListArticles(MEDIA_CENTRE_LISTS.news);
  return articles.map(mapNewsItem);
}

/** Announcements for the list below it, in curated order. */
export async function getMediaCentreAnnouncements(): Promise<Announcement[]> {
  const articles = await getContentListArticles(
    MEDIA_CENTRE_LISTS.announcements,
  );
  return articles.map(mapAnnouncement);
}
