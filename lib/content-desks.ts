/**
 * Content desks — the "Content Desks" row on the home page and the
 * `/fact-checks/<slug>` landing pages.
 *
 * A desk is a **Claim Topic** (the `Harm_type` vocabulary in Superdesk), not a
 * route. The live catalog is folded out of the Claim Topics that published
 * fact-checks actually carry (`lib/data/desks.ts`), and a desk page lists the
 * fact-checks tagged with its topic code. Tagging content with a new Claim
 * Topic adds a desk; no code change.
 *
 * Superdesk carries no artwork for a vocabulary term and the GraphQL API
 * exposes no vocabulary table at all (see `docs/fact-check-filters.md`), so the
 * thumbnails stay curated here, keyed by topic code.
 *
 * `CONTENT_DESKS` is the degraded-mode fallback only — for when Hasura is
 * unreachable. Pages follow the usual seam:
 * `(await getContentDesks().catch(() => null)) ?? CONTENT_DESKS`.
 */

export type ContentDesk = {
  /** Display name — the Claim Topic's label in Superdesk. */
  name: string;
  /** URL segment under `/fact-checks`, derived from `topic`. */
  slug: string;
  /** Card thumbnail — curated, see `deskImage`. */
  image: string;
  /** The Claim Topic qcode (`Harm_type`) whose fact-checks the desk lists. */
  topic: string;
};

const IMAGES = "/images/content-desks";

/** Shown for a Claim Topic that has no curated artwork yet. */
export const DEFAULT_DESK_IMAGE = `${IMAGES}/content4.png`;

/**
 * Curated thumbnail per Claim Topic code. Codes are the vocabulary's own
 * qcodes; anything not listed falls back to `DEFAULT_DESK_IMAGE` rather than
 * dropping the desk, so a newly tagged topic still appears in the row.
 */
const DESK_IMAGES: Record<string, string> = {
  climate: `${IMAGES}/content2.png`,
  elections: `${IMAGES}/elections.png`,
  employment: `${IMAGES}/public-finance.png`,
  finance: `${IMAGES}/public-finance.png`,
  gender: `${IMAGES}/gender.png`,
  health: `${IMAGES}/content3.png`,
  migration: `${IMAGES}/content4.png`,
  politics: `${IMAGES}/elections.png`,
  scams: `${IMAGES}/scams.png`,
};

export function deskImage(topic: string): string {
  return DESK_IMAGES[topic.trim().toLowerCase()] ?? DEFAULT_DESK_IMAGE;
}

/**
 * URL segment for a Claim Topic code. Superdesk qcodes are free-form (they can
 * carry spaces, case and underscores), so they are normalised rather than used
 * raw. Returns `""` for a code with nothing URL-safe in it — `getContentDesks`
 * drops those instead of linking to `/fact-checks/`.
 */
export function deskSlug(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A live Claim Topic option (`lib/data/filter-options.ts`) as a desk. */
export function deskFromTopic(topic: {
  code: string;
  label: string;
}): ContentDesk {
  return {
    name: topic.label,
    slug: deskSlug(topic.code),
    image: deskImage(topic.code),
    topic: topic.code,
  };
}

/**
 * Degraded-mode catalog: the desks from the original Figma design, each keyed
 * to the Claim Topic code it corresponds to. Also serves as the alias table for
 * the design-era URLs (`/fact-checks/climate-change` still resolves, even
 * though the live desk for that topic is `/fact-checks/climate`).
 */
export const CONTENT_DESKS: ContentDesk[] = [
  {
    name: "Climate Change",
    slug: "climate-change",
    image: deskImage("climate"),
    topic: "climate",
  },
  {
    name: "Gender",
    slug: "gender",
    image: deskImage("gender"),
    topic: "gender",
  },
  {
    name: "Elections",
    slug: "elections",
    image: deskImage("elections"),
    topic: "elections",
  },
  {
    name: "Public Finances",
    slug: "public-finances",
    image: deskImage("finance"),
    topic: "finance",
  },
  { name: "Scams", slug: "scams", image: deskImage("scams"), topic: "scams" },
  {
    name: "Health",
    slug: "health",
    image: deskImage("health"),
    topic: "health",
  },
  {
    name: "Migration",
    slug: "migration",
    image: deskImage("migration"),
    topic: "migration",
  },
];

export function deskBySlug(slug: string): ContentDesk | undefined {
  return CONTENT_DESKS.find((desk) => desk.slug === slug);
}
