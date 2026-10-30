/**
 * Content desks — the "Content Desks" row on the home page and the
 * `/fact-checks/<slug>` landing pages.
 *
 * A desk gathers one or more **Claim Topics** (the `Harm_type` vocabulary in
 * Superdesk). The catalog below is editorial, not derived: PesaCheck runs five
 * desks, in this order, and the row shows those and nothing else. Tagging an
 * article with a new Claim Topic no longer adds a desk — it files the article
 * under an existing one, or under none.
 *
 * That curation is why a desk's `name` is here rather than read from the
 * vocabulary: "Public Finances" is the desk, `finance` is the topic code
 * behind it, and Covid-19 is not a desk at all — its fact-checks belong to
 * Health. Superdesk also carries no artwork for a vocabulary term and the
 * GraphQL API exposes no vocabulary table (see `docs/fact-check-filters.md`),
 * so the thumbnails are curated here too.
 *
 * This list is the whole catalog: the row renders it as written, with no read
 * behind it. See `docs/fact-check-filters.md` for why deriving it from the
 * topics in use is incompatible with running a fixed five.
 */

export type ContentDesk = {
  /** Display name — editorial, not the Claim Topic's own label. */
  name: string;
  /** URL segment under `/fact-checks`. */
  slug: string;
  /** Card thumbnail. */
  image: string;
  /**
   * The Claim Topic qcodes (`Harm_type`) whose fact-checks the desk lists.
   * Usually one; Health gathers two, because Covid-19 is tagged as its own
   * topic but is not a desk of its own.
   */
  topics: string[];
};

const IMAGES = "/images/content-desks";

/** The five desks, in the order they are shown. */
export const CONTENT_DESKS: ContentDesk[] = [
  {
    name: "Climate",
    slug: "climate",
    image: `${IMAGES}/content2.png`,
    topics: ["climate"],
  },
  {
    name: "Elections",
    slug: "elections",
    image: `${IMAGES}/elections.png`,
    topics: ["elections"],
  },
  {
    name: "Gender",
    slug: "gender",
    image: `${IMAGES}/gender.png`,
    topics: ["gender"],
  },
  {
    name: "Health",
    slug: "health",
    image: `${IMAGES}/content3.png`,
    topics: ["health", "covid"],
  },
  {
    name: "Public Finances",
    slug: "public-finances",
    image: `${IMAGES}/public-finance.png`,
    topics: ["finance"],
  },
];

/**
 * Desk URLs that no longer exist, and where they go instead.
 *
 * Two kinds: Claim Topics that had a desk of their own before the catalog was
 * cut to five (`/fact-checks/employment`), and the design-era slugs that
 * predate slugs coming from topic codes (`/fact-checks/climate-change`). A
 * topic whose content moved keeps its readers — Covid-19 fact-checks are on
 * the Health desk — and the rest go to the full listing, where the Topic
 * filter still reaches them.
 *
 * Redirects are temporary (307), not permanent: which desks PesaCheck runs is
 * an editorial decision that may change again, and a 308 is cached by browsers
 * indefinitely. Applied in `next.config.ts`.
 */
export const RETIRED_DESKS: Record<string, string> = {
  "climate-change": "/fact-checks/climate",
  covid: "/fact-checks/health",
  education: "/fact-checks",
  employment: "/fact-checks",
  migration: "/fact-checks",
  nutrition: "/fact-checks",
  politics: "/fact-checks",
  religion: "/fact-checks",
  scams: "/fact-checks",
  sports: "/fact-checks",
  tourism: "/fact-checks",
  transport: "/fact-checks",
  wildlife: "/fact-checks",
  xenophobia: "/fact-checks",
};

export function deskBySlug(slug: string): ContentDesk | undefined {
  return CONTENT_DESKS.find((desk) => desk.slug === slug);
}
