import type { Metadata } from "next";
import { MediaCentreAnnouncements } from "@/components/about/MediaCentreAnnouncements";
import { MediaCentreEvent } from "@/components/about/MediaCentreEvent";
import { MediaCentreHero } from "@/components/about/MediaCentreHero";
import { MediaCentreNews } from "@/components/about/MediaCentreNews";
import { MediaCentreResearch } from "@/components/about/MediaCentreResearch";
import {
  getMediaCentreAnnouncements,
  getMediaCentreNews,
  getMediaCentreResearch,
} from "@/lib/data/media-centre";
import {
  ANNOUNCEMENTS,
  NEWS,
  RESEARCH_STRANDS,
} from "@/lib/media-centre-content";

export const metadata: Metadata = {
  title: "Media Centre — PesaCheck",
  description:
    "Where PesaCheck has been cited in research and other major publications.",
};

// Revalidate every 5 minutes instead of freezing the curated lists at build
// time, matching the homepage.
export const revalidate = 300;

/**
 * An unreachable Hasura and a list nobody has curated yet arrive the same way
 * here — as nothing to show — and neither section has an empty state, so both
 * fall back to the design copy in `lib/media-centre-content`.
 */
function withFallback<T>(live: T[] | null, fallback: T[]): T[] {
  return live && live.length > 0 ? live : fallback;
}

export default async function MediaCentrePage() {
  // Each section falls back on its own, so one missing list never blanks another.
  const [research, news, announcements] = await Promise.all([
    getMediaCentreResearch().catch(() => null),
    getMediaCentreNews().catch(() => null),
    getMediaCentreAnnouncements().catch(() => null),
  ]);

  return (
    <>
      <MediaCentreHero />
      <MediaCentreResearch strands={withFallback(research, RESEARCH_STRANDS)} />
      <MediaCentreNews items={withFallback(news, NEWS)} />
      <MediaCentreAnnouncements
        announcements={withFallback(announcements, ANNOUNCEMENTS)}
      />
      <MediaCentreEvent />
    </>
  );
}
