/**
 * Live Region / Language / Topic filter options, derived from Superdesk.
 *
 * Options are **not** curated in code: they're folded out of the taxonomy that
 * published fact-checks actually carry (`metadata.subject[]` for region/topic,
 * `swp_article_metadata.language` for language). Tag an article in Superdesk
 * with a new country, harm topic or language and the option appears in the
 * dropdowns on the next revalidation — no code change (issue #60, AC 1 & 4).
 *
 * The read is bounded (`TAXONOMY_SAMPLE_SIZE` newest fact-checks) and cached for
 * `FILTER_OPTIONS_TTL_SECONDS`, so it costs one query per TTL rather than one
 * per request.
 */
import { unstable_cache } from "next/cache";
import { gql, TENANT_CODE } from "@/lib/data/client";
import {
  buildFactCheckWhere,
  EMPTY_FILTERS,
  type FilterOption,
  type FilterOptions,
} from "@/lib/data/fact-check-filters";
import { languageLabel, parseMetadata } from "@/lib/data/map";
import { GET_FACT_CHECK_TAXONOMY } from "@/lib/data/queries/taxonomy";

/**
 * How many of the newest published fact-checks are read to build the option
 * lists. Big enough to cover the taxonomy in active use, small enough to stay a
 * single cheap query (only `metadata` + `language` are selected).
 */
export const TAXONOMY_SAMPLE_SIZE = 300;

/** How long a derived option set is reused before it's rebuilt. */
export const FILTER_OPTIONS_TTL_SECONDS = 3600;

/** Raw row shape returned by `GET_FACT_CHECK_TAXONOMY`. */
export type TaxonomyRow = {
  metadata?: string | null;
  swp_article_metadata?: { language?: string | null } | null;
};

type TaxonomyResponse = { items: TaxonomyRow[] };

/** Collects `{code → label}` per dimension, first non-empty label winning. */
class OptionSet {
  private readonly labels = new Map<string, string>();

  add(code: string | null | undefined, label?: string | null): void {
    const key = code?.trim();
    if (!key) return;
    const current = this.labels.get(key);
    const next = label?.trim();
    // A later row may carry the display name an earlier one lacked.
    if (current && current !== key) return;
    this.labels.set(key, next || key);
  }

  /** Options sorted by label so the dropdowns read alphabetically. */
  toOptions(): FilterOption[] {
    return [...this.labels.entries()]
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}

/**
 * Fold sampled article taxonomy into option lists. Pure — the network lives in
 * `getFilterOptions`.
 *
 * - `region` ← `metadata.subject[scheme="countries"]` (ISO3 code + name)
 * - `topic`  ← `metadata.subject[scheme="01harm"]` (harm code + name)
 * - `language` ← `swp_article_metadata.language`, falling back to the jsonb
 *   `metadata.language`; labelled via the shared ISO-code label map.
 *
 * Codes with no usable display name fall back to the code itself, so a
 * vocabulary addition is never silently dropped from the dropdown.
 */
export function deriveFilterOptions(rows: TaxonomyRow[]): FilterOptions {
  const regions = new OptionSet();
  const topics = new OptionSet();
  const languages = new OptionSet();

  for (const row of rows) {
    const meta = parseMetadata(row.metadata);

    for (const subject of meta.subject ?? []) {
      if (subject.scheme === "countries") {
        regions.add(subject.code, subject.name);
      } else if (subject.scheme === "01harm") {
        topics.add(subject.code, subject.name);
      }
    }

    // The language *filter* keys off the normalized column, so prefer it; the
    // jsonb copy covers rows whose `swp_article_metadata` row is missing.
    const language = row.swp_article_metadata?.language ?? meta.language;
    languages.add(language, languageLabel(language));
  }

  return {
    region: regions.toOptions(),
    language: languages.toOptions(),
    topic: topics.toOptions(),
  };
}

async function fetchFilterOptions(): Promise<FilterOptions> {
  const { items } = await gql<TaxonomyResponse>(GET_FACT_CHECK_TAXONOMY, {
    // Same `Debunk` + tenant + published definition as the listings, so the
    // options can only ever describe articles the grid can actually show.
    where: buildFactCheckWhere(EMPTY_FILTERS, TENANT_CODE),
    limit: TAXONOMY_SAMPLE_SIZE,
  });
  return deriveFilterOptions(items);
}

/**
 * Live filter options, cached across requests for `FILTER_OPTIONS_TTL_SECONDS`.
 * Throws when Hasura is unreachable — callers apply the usual
 * `?? FALLBACK_FILTER_OPTIONS` degraded-mode pattern.
 */
export const getFilterOptions: () => Promise<FilterOptions> = unstable_cache(
  fetchFilterOptions,
  ["fact-check-filter-options", TENANT_CODE],
  { revalidate: FILTER_OPTIONS_TTL_SECONDS },
);
