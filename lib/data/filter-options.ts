/**
 * Live Region / Language / Topic filter options, derived from Superdesk.
 *
 * Options are folded out of the taxonomy published fact-checks carry — region
 * and topic from `metadata.subject[]`, language from the debunk-language subject
 * merged with the article language. Tagging content with a new value surfaces
 * the option on the next revalidation.
 *
 * The read is bounded (`TAXONOMY_SAMPLE_SIZE`) and cached
 * (`FILTER_OPTIONS_TTL_SECONDS`), so it costs one query per TTL rather than one
 * per request.
 */
import { unstable_cache } from "next/cache";
import { gql, TENANT_CODE } from "@/lib/data/client";
import {
  buildFactCheckWhere,
  DEBUNK_LANG_SCHEME,
  EMPTY_FILTERS,
  type FilterOption,
  type FilterOptions,
  SUBJECT_SCHEME,
} from "@/lib/data/fact-check-filters";
import { languageLabel, parseMetadata } from "@/lib/data/map";
import { GET_FACT_CHECK_TAXONOMY } from "@/lib/data/queries/taxonomy";

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * How many of the newest published fact-checks are read to build the option
 * lists. Overridable via `FILTER_OPTIONS_SAMPLE_SIZE`.
 */
export const TAXONOMY_SAMPLE_SIZE = envInt("FILTER_OPTIONS_SAMPLE_SIZE", 300);

/**
 * How long a derived option set is reused before it's rebuilt. Overridable via
 * `FILTER_OPTIONS_TTL_SECONDS`.
 */
export const FILTER_OPTIONS_TTL_SECONDS = envInt(
  "FILTER_OPTIONS_TTL_SECONDS",
  3600,
);

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
 * - `region` ← `metadata.subject[scheme=countrymention1]` (ISO3 code + name)
 * - `topic`  ← `metadata.subject[scheme=Harm_type]` (claim-topic code + name)
 * - `language` ← the article language (ISO, from the column, jsonb copy as
 *   fallback) merged with the debunk language (`Debunklang` subject); a debunk
 *   language whose label already appears as a desk language is dropped, so its
 *   codes stay on the ISO option.
 *
 * Codes with no usable display name fall back to the code itself, so a
 * vocabulary addition is never silently dropped from the dropdown.
 */
export function deriveFilterOptions(rows: TaxonomyRow[]): FilterOptions {
  const regions = new OptionSet();
  const topics = new OptionSet();
  const articleLanguages = new OptionSet();
  const debunkLanguages = new OptionSet();

  for (const row of rows) {
    const meta = parseMetadata(row.metadata);

    for (const subject of meta.subject ?? []) {
      if (subject.scheme === SUBJECT_SCHEME.region) {
        regions.add(subject.code, subject.name);
      } else if (subject.scheme === SUBJECT_SCHEME.topic) {
        topics.add(subject.code, subject.name);
      } else if (subject.scheme === DEBUNK_LANG_SCHEME) {
        debunkLanguages.add(subject.code, subject.name);
      }
    }

    // The article-language column is the fallback source; the jsonb copy covers
    // rows whose `swp_article_metadata` row is missing.
    const language = row.swp_article_metadata?.language ?? meta.language;
    articleLanguages.add(language, languageLabel(language));
  }

  return {
    region: regions.toOptions(),
    language: mergeLanguageOptions(articleLanguages, debunkLanguages),
    topic: topics.toOptions(),
  };
}

/**
 * Article-language options plus debunk-language options, deduped by label:
 * a debunk language that names a desk language (e.g. "English") is dropped in
 * favour of the ISO option, so filtering keys off the fully-populated column;
 * debunk-only languages (e.g. Fulani) keep their vocabulary code.
 */
function mergeLanguageOptions(
  articleLanguages: OptionSet,
  debunkLanguages: OptionSet,
): FilterOption[] {
  const article = articleLanguages.toOptions();
  const seen = new Set(article.map((o) => o.label.toLowerCase()));
  const debunkOnly = debunkLanguages
    .toOptions()
    .filter((o) => !seen.has(o.label.toLowerCase()));
  return [...article, ...debunkOnly].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
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
