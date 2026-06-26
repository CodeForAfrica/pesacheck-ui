export type FilterDimension = "region" | "language" | "topic";

/** Selected option codes per dimension (e.g. `{ region: ["UGA"], … }`). */
export type FilterSelection = Record<FilterDimension, string[]>;

export const FILTER_DIMENSIONS: FilterDimension[] = [
  "region",
  "language",
  "topic",
];

export const EMPTY_FILTERS: FilterSelection = {
  region: [],
  language: [],
  topic: [],
};

/** Subject schemes backing the relation-based dimensions. */
const SUBJECT_SCHEME: Record<"region" | "topic", string> = {
  region: "countries",
  topic: "01harm",
};

export function hasActiveFilters(filters: FilterSelection): boolean {
  return FILTER_DIMENSIONS.some((dim) => filters[dim].length > 0);
}

type SubjectClause = {
  swp_article_metadata: {
    swp_article_metadata_subjects: {
      scheme: { _eq: string };
      code?: { _in: string[] };
    };
  };
};
type LanguageClause = {
  swp_article_metadata: { language: { _in: string[] } };
};
type WhereClause = SubjectClause | LanguageClause;
type SearchParams = Record<string, string | string[] | undefined>;

export type FactCheckWhere = {
  tenant_code: { _eq: string };
  published_at: { _is_null: false };
  _and: WhereClause[];
};

/**
 * Build the `swp_article_bool_exp` for a page of fact-checks under `tenantCode`,
 * narrowed by `filters`. The `Debunk` clause is always present (it's what makes
 * an article a fact-check); each active dimension adds one more `_and` clause.
 * Inactive dimensions are omitted entirely — an empty `_in: []` would match
 * nothing in Hasura, so we never emit one.
 */
export function buildFactCheckWhere(
  filters: FilterSelection,
  tenantCode: string,
): FactCheckWhere {
  const and: WhereClause[] = [
    {
      swp_article_metadata: {
        swp_article_metadata_subjects: { scheme: { _eq: "Debunk" } },
      },
    },
  ];

  for (const dim of ["region", "topic"] as const) {
    const codes = filters[dim];
    if (codes.length > 0) {
      and.push({
        swp_article_metadata: {
          swp_article_metadata_subjects: {
            scheme: { _eq: SUBJECT_SCHEME[dim] },
            code: { _in: codes },
          },
        },
      });
    }
  }

  if (filters.language.length > 0) {
    and.push({
      swp_article_metadata: { language: { _in: filters.language } },
    });
  }

  return {
    tenant_code: { _eq: tenantCode },
    published_at: { _is_null: false },
    _and: and,
  };
}

function parseCsv(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseFilterParams(params: SearchParams): FilterSelection {
  return {
    region: parseCsv(params.region),
    language: parseCsv(params.language),
    topic: parseCsv(params.topic),
  };
}

/** Serialize active dimensions to query params (omits empty dimensions). */
export function filtersToQuery(
  filters: FilterSelection,
): Record<string, string> {
  const query: Record<string, string> = {};
  for (const dim of FILTER_DIMENSIONS) {
    if (filters[dim].length > 0) query[dim] = filters[dim].join(",");
  }
  return query;
}
