import type { ReactNode } from "react";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutTeam } from "@/components/about/AboutTeam";
import { EcosystemGroups } from "@/components/about/EcosystemGroups";
import { EcosystemRoles } from "@/components/about/EcosystemRoles";
import { FaqGroups } from "@/components/about/FaqGroups";
import { MediaCentreAnnouncements } from "@/components/about/MediaCentreAnnouncements";
import { MediaCentreEvent } from "@/components/about/MediaCentreEvent";
import { MediaCentreNews } from "@/components/about/MediaCentreNews";
import { MediaCentreResearch } from "@/components/about/MediaCentreResearch";
import { AlliesSection } from "@/components/partners/AlliesSection";
import { OurPartnersSection } from "@/components/partners/OurPartnersSection";
import { ToolsShowcase } from "@/components/tools/ToolsShowcase";
import { AllyPartnerStrip } from "@/components/ui/AllyPartnerStrip";
import { Impact } from "@/components/ui/Impact";
import {
  ECOSYSTEM_LIST,
  ECOSYSTEM_ROLES_LIST,
  getEcosystemGroups,
  getEcosystemRoles,
} from "@/lib/data/ecosystem";
import { FAQ_LIST, getFaqGroups } from "@/lib/data/faqs";
import { getImpactStats, IMPACT_LIST } from "@/lib/data/impact";
import { getIntroImages, INTRO_IMAGES_LIST } from "@/lib/data/intro-images";
import { ALLIES_LIST, getLogos, PARTNERS_LIST } from "@/lib/data/logos";
import {
  getMediaCentreAnnouncements,
  getMediaCentreEvents,
  getMediaCentreNews,
  getMediaCentreResearch,
  MEDIA_CENTRE_LISTS,
} from "@/lib/data/media-centre";
import type { PageSection } from "@/lib/data/pages";
import { getTeam, TEAM_LIST } from "@/lib/data/team";
import { getTools, TOOLS_LIST } from "@/lib/data/tools";

/**
 * One built-in section: where it reads from, how it renders, and the two
 * traits the page needs to lay it out.
 */
type ListSectionEntry = {
  /** The list this reads when the page names none. */
  defaultList: string;
  /** Renders its own headings, so the page omits the one above it. */
  ownHeadings?: boolean;
  /** Spans the viewport rather than sitting in the page's column. */
  fullBleed?: boolean;
  render: (listName: string, section: PageSection) => Promise<ReactNode>;
};

/** A section's body as plain text — some built-ins take a standfirst. */
function bodyText(section: PageSection): string | undefined {
  const text = section.bodyHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text || undefined;
}

/**
 * The built-in sections an editor can place on a page.
 *
 * A React component cannot come from a CMS, so this is the set a build ships
 * and the vocabulary's qcodes are the contract with it. Each entry pairs a
 * fetcher with the component that renders what it returns, and names the list
 * it reads by default so a page usually needs only to pick the template.
 *
 * Adding a section type is a code change — the same bargain as the nav icons.
 * What an editor gains is placing and ordering the existing ones on any page.
 */
const LIST_SECTIONS: Record<string, ListSectionEntry> = {
  "faq-questions": {
    defaultList: FAQ_LIST,
    // The question groups carry their own headings, so the page must not add
    // one above them — the design goes straight from the hero to the groups.
    ownHeadings: true,
    async render(listName: string) {
      const groups = await getFaqGroups(listName).catch(() => null);
      // No fallback to the design copy here: a section an editor placed and
      // left empty should read as empty, not silently show placeholder
      // questions from the repository.
      return groups?.length ? <FaqGroups groups={groups} bare /> : null;
    },
  },

  "tools-showcase": {
    defaultList: TOOLS_LIST,
    // Carries its own "More than fact-checking" heading and blurb.
    ownHeadings: true,
    async render(listName: string) {
      const tools = await getTools(listName).catch(() => null);
      return tools?.length ? <ToolsShowcase tools={tools} bare /> : null;
    },
  },

  "media-research": {
    defaultList: MEDIA_CENTRE_LISTS.research,
    ownHeadings: true,
    async render(listName: string, section: PageSection) {
      const strands = await getMediaCentreResearch(listName).catch(() => null);
      return strands?.length ? (
        <MediaCentreResearch strands={strands} title={section.title} bare />
      ) : null;
    },
  },

  "media-news": {
    defaultList: MEDIA_CENTRE_LISTS.news,
    // Sits on its own tinted band across the page.
    fullBleed: true,
    async render(listName: string, section: PageSection) {
      const items = await getMediaCentreNews(listName).catch(() => null);
      return items?.length ? (
        <MediaCentreNews items={items} title={section.title} />
      ) : null;
    },
  },

  "media-announcements": {
    defaultList: MEDIA_CENTRE_LISTS.announcements,
    ownHeadings: true,
    async render(listName: string, section: PageSection) {
      const announcements = await getMediaCentreAnnouncements(listName).catch(
        () => null,
      );
      return announcements?.length ? (
        <MediaCentreAnnouncements
          announcements={announcements}
          title={section.title}
          bare
        />
      ) : null;
    },
  },

  "media-events": {
    defaultList: MEDIA_CENTRE_LISTS.events,
    ownHeadings: true,
    async render(listName: string, section: PageSection) {
      const events = await getMediaCentreEvents(listName).catch(() => null);
      // The list carries the whole rail: first item featured, rest upcoming.
      return events?.spotlight ? (
        <MediaCentreEvent
          event={events.spotlight}
          upcoming={events.upcoming}
          title={section.title}
          bare
        />
      ) : null;
    },
  },

  "about-intro": {
    // Two portraits beside the copy — a layout prose cannot express, which is
    // why the intro is a template rather than an ordinary section.
    defaultList: INTRO_IMAGES_LIST,
    ownHeadings: true,
    async render(listName: string, section: PageSection) {
      const images = await getIntroImages(listName).catch(() => null);
      const paragraphs = section.bodyHtml
        .split(/<\/p>/)
        .map((p) =>
          p
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean);
      if (paragraphs.length === 0) return null;

      return (
        <AboutIntro
          paragraphs={paragraphs}
          images={images?.length ? images : undefined}
          bare
        />
      );
    },
  },

  "team-grid": {
    defaultList: TEAM_LIST,
    ownHeadings: true,
    async render(listName: string) {
      const team = await getTeam(listName).catch(() => null);
      return team?.length ? <AboutTeam team={team} bare /> : null;
    },
  },

  "impact-stats": {
    defaultList: IMPACT_LIST,
    ownHeadings: true,
    async render(listName: string) {
      const stats = await getImpactStats(listName).catch(() => null);
      return stats?.length ? <Impact stats={stats} bare /> : null;
    },
  },

  "ally-partner-strip": {
    // Reads both walls, so its `defaultList` is only the allies; the partner
    // list is fixed. A page wanting different sets would need two sections.
    defaultList: ALLIES_LIST,
    ownHeadings: true,
    fullBleed: true,
    async render(listName: string, section: PageSection) {
      const [allies, partners] = await Promise.all([
        getLogos(listName).catch(() => []),
        getLogos(PARTNERS_LIST).catch(() => []),
      ]);
      if (!allies.length && !partners.length) return null;

      return (
        <AllyPartnerStrip
          allies={allies}
          partners={partners}
          blurb={bodyText(section)}
        />
      );
    },
  },

  "allies-logos": {
    defaultList: ALLIES_LIST,
    ownHeadings: true,
    async render(listName: string, section: PageSection) {
      const logos = await getLogos(listName).catch(() => null);
      return logos?.length ? (
        <AlliesSection logos={logos} description={bodyText(section)} bare />
      ) : null;
    },
  },

  "partners-logos": {
    defaultList: PARTNERS_LIST,
    ownHeadings: true,
    // The partner wall sits on its own tinted band across the page.
    fullBleed: true,
    async render(listName: string, section: PageSection) {
      const logos = await getLogos(listName).catch(() => null);
      return logos?.length ? (
        <OurPartnersSection logos={logos} description={bodyText(section)} />
      ) : null;
    },
  },

  "ecosystem-groups": {
    defaultList: ECOSYSTEM_LIST,
    ownHeadings: true,
    // Each group is a full-width band with its own background, so this one
    // renders outside the page's container rather than inside its column.
    fullBleed: true,
    async render(listName: string, section: PageSection) {
      const groups = await getEcosystemGroups(listName).catch(() => null);
      // The standfirst above the bands comes from the section body: it runs
      // longer than a headline allows.
      return groups?.length ? (
        <EcosystemGroups groups={groups} intro={bodyText(section)} />
      ) : null;
    },
  },

  "ecosystem-roles": {
    defaultList: ECOSYSTEM_ROLES_LIST,
    ownHeadings: true,
    fullBleed: true,
    async render(listName: string, section: PageSection) {
      const roles = await getEcosystemRoles(listName).catch(() => null);
      return roles?.length ? (
        <EcosystemRoles roles={roles} title={section.title} />
      ) : null;
    },
  },
};

function entryFor(template: string | undefined): ListSectionEntry | undefined {
  return template ? LIST_SECTIONS[template] : undefined;
}

export function isListSection(template: string | undefined): boolean {
  return entryFor(template) !== undefined;
}

/** Whether the built-in renders its own headings, so the page omits the one it
 *  would otherwise put above a section. */
export function hasOwnHeadings(template: string | undefined): boolean {
  return entryFor(template)?.ownHeadings === true;
}

/**
 * Whether the built-in spans the viewport rather than sitting in the page's
 * column — a banded section whose backgrounds run edge to edge cannot be
 * nested inside the container without becoming a different design.
 */
export function isFullBleed(template: string | undefined): boolean {
  return entryFor(template)?.fullBleed === true;
}

/**
 * Render the built-in section a page section names, or nothing when the
 * template is one this build does not have — an unknown template degrades the
 * way an unknown nav icon does, rather than failing the page.
 */
export async function ListSection({ section }: { section: PageSection }) {
  const entry = entryFor(section.template);
  if (!entry) return null;

  return entry.render(section.listName?.trim() || entry.defaultList, section);
}
