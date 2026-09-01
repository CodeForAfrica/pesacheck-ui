import type { TeamMember } from "@/lib/about-content";
import type { Article } from "@/lib/article-content";
import { renderArticleBody } from "@/lib/data/body";
import { mediaAssetUrl } from "@/lib/data/media";
import {
  ECOSYSTEM_LOGO_FALLBACK,
  ECOSYSTEM_ROLE_ICON_FALLBACK,
  ECOSYSTEM_ROLE_ICONS,
  ECOSYSTEM_TONES,
  type EcosystemItem,
  type EcosystemRole,
} from "@/lib/ecosystem-content";
import type { Story } from "@/lib/home-content";
import {
  type Announcement,
  EVENT_CTA_LABEL,
  type NewsItem,
  RESEARCH_TONES,
  type ResearchStrand,
  type SpotlightEvent,
  type UpcomingEvent,
} from "@/lib/media-centre-content";

/**
 * Preference order for the card image. Staging exposes
 * `thumbnail|viewImage|baseImage|original|square`; prod/local may differ, so the
 * picker just takes the first name that resolves and falls back to any rendition.
 * `viewImage` (≈640px) is the best balance for cards; bigger crops are fallbacks.
 */
const STORY_RENDITIONS = [
  "viewImage",
  "baseImage",
  "original",
  "square",
  "thumbnail",
];

/** Shown when an article has no resolvable rendition (keeps next/image happy). */
const STORY_IMAGE_FALLBACK = "/images/spotlight/long-format3-2.png";

// ── Media ───────────────────────────────────────────────────────────────────

export type Rendition = {
  name: string;
  width?: number;
  height?: number;
  image?: {
    asset_id: string;
    file_extension?: string;
    variants?: string[];
  };
};

/**
 * Resolve a rendition by name to a media URL. Prefers the `.webp` variant.
 * Mirrors `helpers.ts:findRendition`. Returns undefined if not found.
 */
export function findRendition(
  renditions: Rendition[] | undefined,
  name: string,
): string | undefined {
  const rendition = renditions?.find((r) => r.name === name);
  const image = rendition?.image;
  if (!image) return undefined;
  if (image.variants?.includes("webp")) {
    return mediaAssetUrl(image.asset_id, "webp");
  }
  return mediaAssetUrl(image.asset_id, image.file_extension ?? "webp");
}

// ── Metadata / verdict / taxonomy ────────────────────────────────────────────
// `swp_article.metadata` is jsonb but Hasura returns it as a JSON-encoded
// STRING — it must be parsed. The verdict + taxonomy live in `subject[]`.

export type Subject = { scheme: string; code: string; name: string };
export type ArticleMetadata = {
  subject?: Subject[];
  byline?: string | null;
  language?: string | null;
  /** Name of the Superdesk content profile the item was authored against. */
  profile?: string | null;
  [key: string]: unknown;
};

/** Parse the metadata jsonb (Hasura returns a string). Null-safe. */
export function parseMetadata(raw: string | null | undefined): ArticleMetadata {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ArticleMetadata;
  } catch {
    return {};
  }
}

/** First subject for a taxonomy scheme (e.g. "Debunk", "countries", "01harm"). */
export function findSubject(
  meta: ArticleMetadata,
  scheme: string,
): Subject | undefined {
  return meta.subject?.find((s) => s.scheme === scheme);
}

/**
 * The fact-check verdict ("False", "Altered", "Hoax", …) from the `Debunk`
 * scheme. Returns undefined when an article carries no verdict tag.
 */
export function getVerdict(raw: string | null | undefined): string | undefined {
  return findSubject(parseMetadata(raw), "Debunk")?.name;
}

/**
 * Display labels for the ISO language codes PesaCheck publishes in. The card's
 * `Story.language` is a human label (parity with the static design data), while
 * the server-side language *filter* keys off the raw `swp_article_metadata.language`
 * code — see `lib/data/fact-check-filters.ts`.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  am: "Amharic",
  en: "English",
  fr: "French",
  om: "Afaan Oromo",
  so: "Somali",
  sw: "Swahili",
};

export function languageLabel(
  code: string | null | undefined,
): string | undefined {
  if (!code) return undefined;
  return LANGUAGE_LABELS[code] ?? code;
}

// ── Story (listing card) ─────────────────────────────────────────────────────
// Maps a raw `swp_article` (as returned by the content-list query) to the Figma
// `Story` card type. Keeps components on `Story`, not the backend shape.

/**
 * Raw article shape selected by `GET_CONTENT_LIST_ITEMS`. Every field is
 * optional/nullable — staging data is sparse (missing body, image, verdict).
 */
export type RawArticle = {
  id: number | string;
  title: string;
  slug: string;
  lead?: string | null;
  body?: string | null;
  published_at?: string | null;
  metadata?: string | null;
  swp_route?: { slug?: string | null; staticprefix?: string | null } | null;
  /** Superdesk custom fields, as `field_name` / `value` pairs. */
  swp_article_extra?:
    | {
        field_name?: string | null;
        value?: string | null;
      }[]
    | null;
  swp_article_feature_media?: {
    description?: string | null;
    renditions?: Rendition[] | null;
  } | null;
};

function pickStoryImage(renditions: Rendition[] | undefined): string {
  for (const name of STORY_RENDITIONS) {
    const url = findRendition(renditions, name);
    if (url) return url;
  }
  // Last resort: any rendition that resolves to a URL.
  for (const r of renditions ?? []) {
    const url = findRendition([r], r.name);
    if (url) return url;
  }
  return STORY_IMAGE_FALLBACK;
}

/**
 * The named entities Superdesk's editor actually emits. Anything unrecognised
 * is left as written rather than guessed at, so an author who typed "&foo;"
 * sees "&foo;".
 */
const HTML_ENTITIES: Record<string, string> = {
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

/**
 * Decode character references. `&amp;` goes last: decoding it first would turn
 * the encoded text `&amp;lt;` into a real `<` instead of the literal "&lt;".
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(
      /&([a-z]+);/gi,
      (match, name: string) => HTML_ENTITIES[name.toLowerCase()] ?? match,
    )
    .replace(/&amp;/g, "&");
}

/**
 * Strip HTML tags and collapse whitespace — `lead`/`body` and the Superdesk
 * custom fields all carry markup, the last of which arrive wrapped in a `<p>`
 * however plain the author's input was.
 */
function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Short month + day (e.g. "Jul 28"), in UTC for deterministic output. */
export function formatStoryDate(
  published: string | null | undefined,
): string | undefined {
  if (!published) return undefined;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Estimated read time from body word count (~200 wpm). Undefined if no body. */
export function computeReadTime(
  body: string | null | undefined,
): string | undefined {
  const words = stripHtml(body ?? "")
    .split(" ")
    .filter(Boolean).length;
  if (words === 0) return undefined;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

/** Article link: `/fact-checks/<desk>/<slug>` (canonical [desk]/[slug] route). */
function storyHref(article: RawArticle): string {
  const desk = article.swp_route?.slug;
  return desk
    ? `/fact-checks/${desk}/${article.slug}`
    : `/fact-checks/${article.slug}`;
}

/**
 * Superdesk content profiles whose articles belong to the Media Centre rather
 * than the fact-check archive. Publisher reports the profile by name in
 * `metadata.profile`, which is the only signal distinguishing the two: Media
 * Centre entries publish to the same language routes fact-checks do, because
 * `LANGUAGE_ROUTE_SLUGS` is what content lists are filtered to.
 */
const MEDIA_CENTRE_PROFILES = ["Event", "Announcement", "Research Citations"];

/**
 * Profile names are compared loosely because Publisher reports Superdesk's
 * internal name, not the label an editor sees: "Research Citations" arrives as
 * "ResearchCitations". Matching the exact string would work for single-word
 * profiles and silently fail for the rest.
 */
function normaliseProfile(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

const MEDIA_CENTRE_PROFILE_KEYS = new Set(
  MEDIA_CENTRE_PROFILES.map(normaliseProfile),
);

/** Where Media Centre entries live, one flat segment under the section page. */
const MEDIA_CENTRE_BASE = "/about/media-centre";

/** Whether a content profile name is one the Media Centre owns. */
export function isMediaCentreProfile(
  profile: string | null | undefined,
): boolean {
  return (
    Boolean(profile) &&
    MEDIA_CENTRE_PROFILE_KEYS.has(normaliseProfile(profile as string))
  );
}

/** Whether an article was authored against one of the Media Centre profiles. */
export function isMediaCentreEntry(
  metadata: string | null | undefined,
): boolean {
  return isMediaCentreProfile(parseMetadata(metadata).profile);
}

/** The profile a staff member is authored against, and where their page lives. */
const TEAM_PROFILE = normaliseProfile("Team Member");
const TEAM_BASE = "/about/team";

/** Whether a content profile name is the one staff profiles use. */
export function isTeamProfile(profile: string | null | undefined): boolean {
  return (
    Boolean(profile) && normaliseProfile(profile as string) === TEAM_PROFILE
  );
}

/** A staff member's own page: `/about/team/<slug>`. */
export function teamHref(slug: string): string {
  return `${TEAM_BASE}/${slug}`;
}

/**
 * Link to an entry's own page. A Media Centre entry is not a fact-check and
 * reads wrongly under `/fact-checks`, so it gets its own URL; anything else
 * keeps the archive's.
 */
function entryHref(article: RawArticle): string {
  return isMediaCentreEntry(article.metadata)
    ? `${MEDIA_CENTRE_BASE}/${article.slug}`
    : storyHref(article);
}

// ── Article (single fact-check) ──────────────────────────────────────────────

/** Extra relations selected only by the single-article query. */
export type RawFullArticle = RawArticle & {
  swp_article_metadata?: { byline?: string | null } | null;
  swp_article_authors?:
    | { swp_author?: { name?: string | null } | null }[]
    | null;
  swp_article_keywords?:
    | {
        swp_keyword?: { name?: string | null } | null;
      }[]
    | null;
  swp_article_related?: { swp_article?: RawArticle | null }[] | null;
};

/** Map a raw single article to the `Article` type. Null-safe (staging is sparse). */
export function mapArticle(raw: RawFullArticle): Article {
  const meta = parseMetadata(raw.metadata);

  const authors = (raw.swp_article_authors ?? [])
    .map((a) => a.swp_author?.name?.trim())
    .filter((name): name is string => Boolean(name));

  const tags = (raw.swp_article_keywords ?? [])
    .map((k) => k.swp_keyword?.name?.trim())
    .filter((name): name is string => Boolean(name));

  const relatedStories = (raw.swp_article_related ?? [])
    .map((r) => r.swp_article)
    .filter((article): article is RawArticle => article != null)
    .map(mapStory);

  const { bodyHtml, footnotes } = renderArticleBody(raw.body);

  return {
    slug: raw.slug,
    format: "short",
    image: pickStoryImage(
      raw.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt: raw.swp_article_feature_media?.description?.trim() || raw.title,
    title: raw.title,
    verdict: findSubject(meta, "Debunk")?.name,
    tags,
    date: formatStoryDate(raw.published_at) ?? "",
    readTime: computeReadTime(raw.body) ?? "",
    author:
      authors.join(", ") ||
      meta.byline?.trim() ||
      raw.swp_article_metadata?.byline?.trim() ||
      "PesaCheck",
    desk: raw.swp_route?.slug ?? undefined,
    profile: typeof meta.profile === "string" ? meta.profile : undefined,
    // The body is rendered as HTML; the structured paragraph fields are unused.
    leadParagraphs: [],
    bodyParagraphs: [],
    bodyHtml,
    footnotes,
    relatedStories,
  };
}

/** Map a raw content-list article to the `Story` card type. Null-safe. */
export function mapStory(article: RawArticle): Story {
  const meta = parseMetadata(article.metadata);
  const lead = article.lead ? stripHtml(article.lead) : "";
  return {
    image: pickStoryImage(
      article.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt:
      article.swp_article_feature_media?.description?.trim() || article.title,
    verdict: findSubject(meta, "Debunk")?.name,
    title: article.title,
    excerpt: lead || undefined,
    // Display taxonomy from the jsonb `subject[]` / `language` (the server-side
    // filters key off the normalized relation, but the labels live in jsonb).
    region: findSubject(meta, "countries")?.name,
    topic: findSubject(meta, "01harm")?.name,
    language: languageLabel(meta.language),
    date: formatStoryDate(article.published_at),
    readTime: computeReadTime(article.body),
    href: storyHref(article),
  };
}

// ── Media Centre ─────────────────────────────────────────────────────────────
// The three rows are curated content lists like the homepage ones, so they
// arrive as the same `RawArticle`.

/**
 * Vocabulary naming a Media Centre entry: the kicker above a clipping (design:
 * "International newsrooms"), an announcement's tag ("Network") and a research
 * strand's document kind ("Journal article"). Its own scheme rather than the
 * `01harm` harm-type taxonomy the fact-checks use — these labels say what an
 * entry *is* on this page, which is a different question from what harm a
 * fact-check addresses.
 *
 * Untagged entries drop the label rather than print a placeholder, so the
 * sections read correctly before the vocabulary is populated.
 */
export const MEDIA_CENTRE_LABEL_SCHEME = "media_centre_label";

/** Long form date for the announcements rail, e.g. `15 Jul 2026`. */
export function formatLongDate(
  published: string | null | undefined,
): string | undefined {
  if (!published) return undefined;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Any rendition that resolves, or undefined. Unlike `pickStoryImage` this does
 * not fall back to a stock photo — a stranger's face on a staff card, or the
 * wrong organisation's logo, is worse than the design's empty placeholder.
 */
function pickExactImage(
  renditions: Rendition[] | undefined,
): string | undefined {
  for (const name of STORY_RENDITIONS) {
    const url = findRendition(renditions, name);
    if (url) return url;
  }
  return undefined;
}

/**
 * Superdesk custom fields carrying what a staff member is, beyond what any
 * article has. Add them to the Team Member profile under exactly these names;
 * both are optional.
 */
export const TEAM_FIELDS = {
  /** Job title, e.g. "CEO + Founder". */
  role: "team_role",
  linkedin: "linkedin_url",
} as const;

/**
 * Map a raw content-list article to a staff card: the headline is the name,
 * the lead is the card bio, the portrait is the feature media. The full bio
 * lives in the body, which only the member's own page renders.
 */
export function mapTeamMember(article: RawArticle): TeamMember {
  return {
    name: article.title,
    role: articleExtra(article, TEAM_FIELDS.role) ?? "",
    bio: article.lead ? stripHtml(article.lead) : "",
    image: pickExactImage(
      article.swp_article_feature_media?.renditions ?? undefined,
    ),
    href: teamHref(article.slug),
    linkedin: articleExtra(article, TEAM_FIELDS.linkedin),
  };
}

/**
 * Vocabulary naming the group an ecosystem entry belongs to ("Fact-checking
 * networks"). Groups are derived from the entries themselves, in the order
 * their first entry appears in the curated list.
 */
export const ECOSYSTEM_GROUP_SCHEME = "ecosystem_group";

/** Superdesk custom fields carrying what an ecosystem partner is. */
export const ECOSYSTEM_FIELDS = {
  /** Relationship, e.g. "Verified signatory". */
  role: "partner_role",
  /** The partner's own website, which is where "Learn More" goes. */
  url: "partner_url",
} as const;

/** Nominal logo box. CSS caps the rendered size; these keep next/image happy. */
const LOGO_BOX = { width: 200, height: 64 };

/**
 * Map a raw content-list article to an ecosystem card. The accent comes from
 * the entry's position, cycling the design's four tones — nothing in the schema
 * carries a colour, so reordering the list reshuffles them.
 *
 * An entry with no `partner_url` falls back to its own article rather than
 * rendering a link to nowhere.
 */
export function mapEcosystemItem(
  article: RawArticle,
  index: number,
): EcosystemItem {
  const renditions = article.swp_article_feature_media?.renditions ?? undefined;
  const sized = renditions?.find((r) => r.image && r.width && r.height);

  return {
    name: article.title,
    role: articleExtra(article, ECOSYSTEM_FIELDS.role) ?? "",
    tone: ECOSYSTEM_TONES[index % ECOSYSTEM_TONES.length],
    logo: {
      src: pickExactImage(renditions) ?? ECOSYSTEM_LOGO_FALLBACK,
      width: sized?.width ?? LOGO_BOX.width,
      height: sized?.height ?? LOGO_BOX.height,
    },
    description: article.lead ? stripHtml(article.lead) : "",
    href: articleExtra(article, ECOSYSTEM_FIELDS.url) ?? storyHref(article),
  };
}

/**
 * Vocabulary naming which icon a "How we build the ecosystem" card carries.
 * The qcodes are the icon ids in `ECOSYSTEM_ROLE_ICONS` — the icons themselves
 * are React components and cannot come from Superdesk, so an editor chooses
 * from the fixed set rather than supplying one.
 */
export const ECOSYSTEM_ROLE_ICON_SCHEME = "ecosystem_role_icon";

/**
 * Map a raw content-list article to a role card: headline is the title, lead
 * is the copy. An untagged role, or one tagged with an icon this build does
 * not have, falls back to the default rather than rendering an empty badge.
 */
export function mapEcosystemRole(article: RawArticle): EcosystemRole {
  const code = findSubject(
    parseMetadata(article.metadata),
    ECOSYSTEM_ROLE_ICON_SCHEME,
  )?.code;

  const icon = ECOSYSTEM_ROLE_ICONS.find((name) => name === code);

  return {
    icon: icon ?? ECOSYSTEM_ROLE_ICON_FALLBACK,
    title: article.title,
    description: article.lead ? stripHtml(article.lead) : "",
  };
}

/** Map a raw content-list article to a Media Centre clipping card. */
export function mapNewsItem(article: RawArticle): NewsItem {
  const meta = parseMetadata(article.metadata);
  return {
    image: pickStoryImage(
      article.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt:
      article.swp_article_feature_media?.description?.trim() || article.title,
    outlet: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    title: article.title,
    date: formatStoryDate(article.published_at) ?? "",
    readTime: computeReadTime(article.body) ?? "",
    href: entryHref(article),
  };
}

/**
 * Map a raw content-list article to a research strand. The CTA opens the strand's
 * own article; only the static fallback, which has no article behind it, sends
 * readers to the contact page instead.
 *
 * `index` is the article's position in the curated list, which is what picks the
 * accent — nothing in the schema carries a colour.
 */
export function mapResearchStrand(
  article: RawArticle,
  index: number,
): ResearchStrand {
  const meta = parseMetadata(article.metadata);
  return {
    label: article.title,
    kind: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    body: article.lead ? stripHtml(article.lead) : "",
    tone: RESEARCH_TONES[index % RESEARCH_TONES.length],
    href: entryHref(article),
  };
}

/** Map a raw content-list article to a Media Centre announcement row. */
export function mapAnnouncement(article: RawArticle): Announcement {
  const lead = article.lead ? stripHtml(article.lead) : "";
  const meta = parseMetadata(article.metadata);
  return {
    date: formatLongDate(article.published_at) ?? "",
    tag: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    title: article.title,
    excerpt: lead,
    href: entryHref(article),
  };
}

/**
 * Superdesk custom fields carrying what an event is, beyond what any article
 * has: where and when it runs, and the three facts in the detail row. Add them
 * to the content profile under exactly these names; each is optional, and a
 * missing one drops its row rather than printing a blank.
 */
export const EVENT_FIELDS = {
  /** Where it happens, e.g. "Nairobi" or "Online". */
  venue: "event_venue",
  /** When it happens, as the author wants it read: "12–13 September 2026". */
  dates: "event_dates",
  /**
   * Venue and dates pre-composed. Superseded by the two fields above; still
   * read so events authored before the split keep their line.
   */
  meta: "event_meta",
  format: "event_format",
  languages: "event_languages",
  cost: "event_cost",
} as const;

/** The separator between venue and dates, matching the design. */
const META_SEPARATOR = " · ";

/**
 * A custom field's value as text. Superdesk stores these as HTML however plain
 * the input — "In person & streamed" arrives as `<p>In person &amp; streamed</p>`
 * — so this strips the wrapper rather than printing it. Undefined when unset or
 * empty, which is what lets a missing field drop its row.
 */
export function articleExtra(
  article: RawArticle,
  field: string,
): string | undefined {
  const match = article.swp_article_extra?.find(
    (extra) => extra.field_name === field,
  );
  const value = match?.value;
  return (value ? stripHtml(value) : "") || undefined;
}

/**
 * The line above the headline: "Nairobi · 12–13 September 2026". Either half
 * may be missing, and one on its own reads fine, so the separator only appears
 * between two present values.
 */
function eventMeta(article: RawArticle): string | undefined {
  const parts = [
    articleExtra(article, EVENT_FIELDS.venue),
    articleExtra(article, EVENT_FIELDS.dates),
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0
    ? parts.join(META_SEPARATOR)
    : articleExtra(article, EVENT_FIELDS.meta);
}

/** Map a raw content-list article to the featured event. */
export function mapSpotlightEvent(article: RawArticle): SpotlightEvent {
  const details = [
    { label: "Format", value: articleExtra(article, EVENT_FIELDS.format) },
    {
      label: "Languages",
      value: articleExtra(article, EVENT_FIELDS.languages),
    },
    { label: "Cost", value: articleExtra(article, EVENT_FIELDS.cost) },
  ].filter((detail): detail is { label: string; value: string } =>
    Boolean(detail.value),
  );

  return {
    image: pickStoryImage(
      article.swp_article_feature_media?.renditions ?? undefined,
    ),
    alt:
      article.swp_article_feature_media?.description?.trim() || article.title,
    meta: eventMeta(article) ?? "",
    title: article.title,
    body: article.lead ? stripHtml(article.lead) : "",
    details,
    cta: { label: EVENT_CTA_LABEL, href: entryHref(article) },
  };
}

/** Map a raw content-list article to an "Also coming up" card. */
export function mapUpcomingEvent(article: RawArticle): UpcomingEvent {
  const meta = parseMetadata(article.metadata);
  return {
    // Falls back to the publish date, which is at least a real date, when the
    // event's own line is unset.
    meta: eventMeta(article) ?? formatLongDate(article.published_at) ?? "",
    title: article.title,
    body: article.lead ? stripHtml(article.lead) : "",
    kind: findSubject(meta, MEDIA_CENTRE_LABEL_SCHEME)?.name ?? "",
    href: entryHref(article),
  };
}
