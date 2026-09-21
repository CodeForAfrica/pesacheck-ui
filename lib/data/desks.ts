import {
  type ContentDesk,
  deskBySlug,
  deskFromTopic,
} from "@/lib/content-desks";
import { TAGS } from "@/lib/data/cache";
import { gql, TENANT_CODE } from "@/lib/data/client";
import {
  buildFactCheckWhere,
  EMPTY_FILTERS,
  SUBJECT_SCHEME,
} from "@/lib/data/fact-check-filters";
import { TAXONOMY_SAMPLE_SIZE } from "@/lib/data/filter-options";
import { parseMetadata } from "@/lib/data/map";
import { GET_CLAIM_TOPICS } from "@/lib/data/queries/taxonomy";

type ClaimTopicsResponse = { items: { metadata?: string | null }[] };

/**
 * The live content desks, from Superdesk.
 *
 * A desk is a **Claim Topic** (the `Harm_type` vocabulary): the catalog is the
 * distinct Claim Topics carried by published fact-checks, under their Superdesk
 * display names. Tagging an article with a new Claim Topic adds a desk; nothing
 * here is curated except the thumbnails (`deskImage`), which Superdesk has no
 * field for.
 *
 * Reading the tagged articles rather than the vocabulary is forced — this
 * GraphQL API exposes no vocabulary table (`docs/fact-check-filters.md`). It
 * also means the row can only ever show desks with content behind them: the
 * corpus read here is the same one, under the same `Debunk`/tenant/published
 * definition, that `getByDesk` pages through.
 *
 * Throws on network/GraphQL error — callers use `?? CONTENT_DESKS`.
 */
export async function getContentDesks(): Promise<ContentDesk[]> {
  const { items } = await gql<ClaimTopicsResponse>(
    GET_CLAIM_TOPICS,
    {
      where: buildFactCheckWhere(EMPTY_FILTERS, TENANT_CODE, {
        anyTopic: true,
      }),
      limit: TAXONOMY_SAMPLE_SIZE,
    },
    { tags: [TAGS.articles] },
  );

  // `{code → label}`, first non-empty label winning: the display name lives in
  // the `metadata` jsonb, and not every row spells it out.
  const labels = new Map<string, string>();
  for (const item of items) {
    for (const subject of parseMetadata(item.metadata).subject ?? []) {
      if (subject.scheme !== SUBJECT_SCHEME.topic) continue;
      const code = subject.code?.trim();
      if (!code) continue;
      const known = labels.get(code);
      if (known && known !== code) continue;
      labels.set(code, subject.name?.trim() || code);
    }
  }

  const desks = new Map<string, ContentDesk>();
  for (const [code, label] of labels) {
    const desk = deskFromTopic({ code, label });
    // A code with nothing URL-safe in it has no page to link to; two codes that
    // normalise alike would collide, so the first one wins.
    if (desk.slug && !desks.has(desk.slug)) desks.set(desk.slug, desk);
  }

  // Alphabetical, like the Topic dropdown — an order that doesn't reshuffle
  // the row every time something is published.
  return [...desks.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Resolve a `/fact-checks/<slug>` segment to a desk. The live catalog first,
 * then the static one — which both covers Hasura being unreachable and keeps
 * the design-era URLs (`/fact-checks/climate-change`) working now that slugs
 * come from topic codes (`/fact-checks/climate`).
 *
 * `undefined` means the segment names no desk; the page then treats it as an
 * article slug, and 404s if that fails too.
 */
export async function getDesk(slug: string): Promise<ContentDesk | undefined> {
  const desks = await getContentDesks().catch(() => null);
  return desks?.find((desk) => desk.slug === slug) ?? deskBySlug(slug);
}
