export type FilterDimension = "region" | "language" | "topic";

/** Selected option codes per dimension (e.g. `{ region: ["UGA"], … }`). */
export type FilterSelection = Record<FilterDimension, string[]>;

export const FILTER_DIMENSIONS: FilterDimension[] = [
  "region",
  "language",
  "topic",
];

/**
 * The "no filters" selection. Deep-frozen because it's shared as the default
 * argument / fallback prop across call sites — freezing turns an accidental
 * in-place mutation (e.g. `filters.region.push(…)`) into a throw rather than
 * silent corruption of the singleton. Callers that need to mutate clone first.
 */
export const EMPTY_FILTERS: FilterSelection = freezeFilters({
  region: [],
  language: [],
  topic: [],
});

function freezeFilters(filters: FilterSelection): FilterSelection {
  for (const dim of FILTER_DIMENSIONS) Object.freeze(filters[dim]);
  return Object.freeze(filters);
}

/** Subject schemes backing the relation-based dimensions. */
const SUBJECT_SCHEME: Record<"region" | "topic", string> = {
  region: "countries",
  topic: "01harm",
};

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
type RouteClause = {
  swp_route: { slug: { _eq: string } };
};
type WhereClause = SubjectClause | LanguageClause | RouteClause;
type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Scheme carrying the editorial article type (Quick Read / Explainer /
 * Longform). Superdesk publishes it as a metadata subject like any other
 * taxonomy, so it filters the same way the region and topic dimensions do.
 */
export const CONTENT_TYPE_SCHEME = "content_type";

/** Narrows a listing beyond the filter dimensions the reader controls. */
export type FactCheckScope = {
  /** A content-desk route (`swp_route.slug`) — backs the desk pages. */
  routeSlug?: string;
  /**
   * Accepted `content_type` codes — backs the article-type pages. Several
   * codes per type because Superdesk's vocabulary and the site's page names
   * have drifted apart (a Quick Read is filed as `quickread` or `shortform`).
   */
  contentTypes?: string[];
};

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
 *
 * `scope` narrows the listing further, on dimensions the page picks rather than
 * the reader: `routeSlug` to one content desk (`getByDesk`), `contentTypes` to
 * one article type (`getByContentType`). Both are still fact-check listings, so
 * the `Debunk` clause stays and each is just one more `_and` clause on top.
 */
export function buildFactCheckWhere(
  filters: FilterSelection,
  tenantCode: string,
  scope: FactCheckScope = {},
): FactCheckWhere {
  const and: WhereClause[] = [
    {
      swp_article_metadata: {
        swp_article_metadata_subjects: { scheme: { _eq: "Debunk" } },
      },
    },
  ];

  if (scope.routeSlug) {
    and.push({ swp_route: { slug: { _eq: scope.routeSlug } } });
  }

  if (scope.contentTypes && scope.contentTypes.length > 0) {
    and.push({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: CONTENT_TYPE_SCHEME },
          code: { _in: scope.contentTypes },
        },
      },
    });
  }

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
