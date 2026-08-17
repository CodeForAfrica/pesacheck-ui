import type { Metadata } from "next";
import { MediaCentreAnnouncements } from "@/components/about/MediaCentreAnnouncements";
import { MediaCentreEvent } from "@/components/about/MediaCentreEvent";
import { MediaCentreHero } from "@/components/about/MediaCentreHero";
import { MediaCentreNews } from "@/components/about/MediaCentreNews";
import { MediaCentreResearch } from "@/components/about/MediaCentreResearch";

export const metadata: Metadata = {
  title: "Media Centre — PesaCheck",
  description:
    "Where PesaCheck has been cited in research and other major publications.",
};

export default function MediaCentrePage() {
  return (
    <>
      <MediaCentreHero />
      <MediaCentreResearch />
      <MediaCentreNews />
      <MediaCentreAnnouncements />
      <MediaCentreEvent />
    </>
  );
}
