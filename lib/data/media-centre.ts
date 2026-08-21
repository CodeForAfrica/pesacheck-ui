import {
  mapAnnouncement,
  mapNewsItem,
  mapResearchStrand,
} from "@/lib/data/map";
import { getContentListArticles } from "@/lib/data/stories";
import type {
  Announcement,
  NewsItem,
  ResearchStrand,
} from "@/lib/media-centre-content";

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
  research: "Media Centre — In Research",
  news: "Media Centre — In the News",
  announcements: "Media Centre — Announcements",
} as const;

/**
 * Citation strands for the "In research" grid, in curated order. Each strand is
 * an article: the title is the label, the lead is the copy, the topic subject
 * is the document-kind pill, and the accent comes from the article's position
 * (see `mapResearchStrand`). The CTA is fixed — it asks the reader to get in
 * touch, not to open the article.
 */
export async function getMediaCentreResearch(): Promise<ResearchStrand[]> {
  const articles = await getContentListArticles(MEDIA_CENTRE_LISTS.research);
  return articles.map(mapResearchStrand);
}

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
