import { FaqGroups } from "@/components/about/FaqGroups";
import { FAQ_LIST, getFaqGroups } from "@/lib/data/faqs";
import type { PageSection } from "@/lib/data/pages";

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
const LIST_SECTIONS = {
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
} as const;

export type SectionTemplate = keyof typeof LIST_SECTIONS;

function entryFor(template: string | undefined) {
  return template && template in LIST_SECTIONS
    ? LIST_SECTIONS[template as SectionTemplate]
    : undefined;
}

export function isListSection(template: string | undefined): boolean {
  return entryFor(template) !== undefined;
}

/** Whether the built-in renders its own headings, so the page omits the one it
 *  would otherwise put above a section. */
export function hasOwnHeadings(template: string | undefined): boolean {
  const entry = entryFor(template);
  return entry !== undefined && "ownHeadings" in entry && entry.ownHeadings;
}

/**
 * Render the built-in section a page section names, or nothing when the
 * template is one this build does not have — an unknown template degrades the
 * way an unknown nav icon does, rather than failing the page.
 */
export async function ListSection({ section }: { section: PageSection }) {
  const entry = entryFor(section.template);
  if (!entry) return null;

  return entry.render(section.listName?.trim() || entry.defaultList);
}
