import { describe, expect, it } from "vitest";
import {
  buildFactCheckWhere,
  countActiveFilters,
  EMPTY_FILTERS,
  type FilterOptions,
  type FilterSelection,
  filterLabel,
  filtersToQuery,
  hasActiveFilters,
  parseFilterParams,
  selectedFilterLabels,
} from "@/lib/data/fact-check-filters";

const sel = (over: Partial<FilterSelection> = {}): FilterSelection => ({
  region: [],
  language: [],
  topic: [],
  ...over,
});

describe("buildFactCheckWhere", () => {
  it("always scopes by tenant, published, and the Debunk verdict", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "e6lkum");
    expect(where.tenant_code).toEqual({ _eq: "e6lkum" });
    expect(where.published_at).toEqual({ _is_null: false });
    expect(where._and).toEqual([
      {
        swp_article_metadata: {
          swp_article_metadata_subjects: { scheme: { _eq: "Debunk" } },
        },
      },
    ]);
  });

  it("adds a region clause on the `countrymention1` scheme with _in (OR within)", () => {
    const where = buildFactCheckWhere(sel({ region: ["UGA", "ZAF"] }), "t");
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "countrymention1" },
          code: { _in: ["UGA", "ZAF"] },
        },
      },
    });
  });

  it("adds a topic clause on the `Harm_type` scheme", () => {
    const where = buildFactCheckWhere(sel({ topic: ["elections"] }), "t");
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "Harm_type" },
          code: { _in: ["elections"] },
        },
      },
    });
  });

  it("matches language on the article column OR the Debunklang subject", () => {
    const where = buildFactCheckWhere(
      sel({ language: ["en", "debunkful"] }),
      "t",
    );
    expect(where._and).toContainEqual({
      _or: [
        { swp_article_metadata: { language: { _in: ["en", "debunkful"] } } },
        {
          swp_article_metadata: {
            swp_article_metadata_subjects: {
              scheme: { _eq: "Debunklang" },
              code: { _in: ["en", "debunkful"] },
            },
          },
        },
      ],
    });
  });

  it("ANDs dimensions as separate clauses (Debunk + region + topic + lang)", () => {
    const where = buildFactCheckWhere(
      sel({ region: ["UGA"], topic: ["elections"], language: ["en"] }),
      "t",
    );
    expect(where._and).toHaveLength(4);
  });

  it("omits inactive dimensions (never emits an empty _in)", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t");
    const serialized = JSON.stringify(where);
    expect(serialized).not.toContain('"_in":[]');
    expect(where._and).toHaveLength(1);
  });

  it("scopes to a desk route when routeSlug is given (still Debunk)", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t", {
      routeSlug: "climate-change",
    });
    expect(where._and).toContainEqual({
      swp_route: { slug: { _eq: "climate-change" } },
    });
    // Debunk clause kept; route is an additional AND clause.
    expect(where._and).toHaveLength(2);
  });

  it("omits the route clause when routeSlug is absent", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t");
    expect(JSON.stringify(where)).not.toContain("swp_route");
  });

  it("ANDs a desk route together with active filters", () => {
    const where = buildFactCheckWhere(sel({ topic: ["elections"] }), "t", {
      routeSlug: "elections",
    });
    expect(where._and).toContainEqual({
      swp_route: { slug: { _eq: "elections" } },
    });
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "Harm_type" },
          code: { _in: ["elections"] },
        },
      },
    });
    expect(where._and).toHaveLength(3);
  });

  it("scopes to an article type on the `content_type` scheme (still Debunk)", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t", {
      contentTypes: ["quickread", "shortform"],
    });
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "content_type" },
          code: { _in: ["quickread", "shortform"] },
        },
      },
    });
    expect(where._and).toHaveLength(2);
  });

  it("omits the content-type clause when no codes are given", () => {
    for (const scope of [{}, { contentTypes: [] }]) {
      const where = buildFactCheckWhere(EMPTY_FILTERS, "t", scope);
      expect(JSON.stringify(where)).not.toContain("content_type");
      expect(where._and).toHaveLength(1);
    }
  });

  it("ANDs an article type together with a desk route and active filters", () => {
    const where = buildFactCheckWhere(sel({ language: ["en"] }), "t", {
      routeSlug: "elections",
      contentTypes: ["longform"],
    });
    expect(where._and).toHaveLength(4);
  });
});

describe("buildFactCheckWhere — free-text search", () => {
  it("ORs the query across title, lead and body", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t", { search: "Ghana" });
    expect(where._and).toContainEqual({
      _or: [
        { title: { _ilike: "%Ghana%" } },
        { lead: { _ilike: "%Ghana%" } },
        { body: { _ilike: "%Ghana%" } },
      ],
    });
    // Debunk clause kept; search is one additional AND clause.
    expect(where._and).toHaveLength(2);
  });

  it("escapes LIKE wildcards in the query", () => {
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t", {
      search: "100%_off\\now",
    });
    expect(JSON.stringify(where)).toContain("%100\\\\%\\\\_off\\\\\\\\now%");
  });

  it("ignores a blank/whitespace-only query", () => {
    for (const search of ["", "   ", undefined]) {
      const where = buildFactCheckWhere(EMPTY_FILTERS, "t", { search });
      expect(where._and).toHaveLength(1);
    }
  });

  it("ANDs the query with active filters and a desk route", () => {
    const where = buildFactCheckWhere(sel({ language: ["en"] }), "t", {
      routeSlug: "elections",
      search: "vote",
    });
    // Debunk + route + search + language
    expect(where._and).toHaveLength(4);
  });
});

describe("filter selection helpers", () => {
  const options: FilterOptions = {
    region: [{ code: "KEN", label: "Kenya" }],
    language: [{ code: "en", label: "English" }],
    topic: [],
  };

  it("resolves a code to its live label", () => {
    expect(filterLabel(options, "region", "KEN")).toBe("Kenya");
  });

  it("falls back to the code when it isn't among the options", () => {
    expect(filterLabel(options, "topic", "polit_harm")).toBe("polit_harm");
  });

  it("lists selected options in dimension order", () => {
    expect(
      selectedFilterLabels(options, sel({ language: ["en"], region: ["KEN"] })),
    ).toEqual([
      { dimension: "region", code: "KEN", label: "Kenya" },
      { dimension: "language", code: "en", label: "English" },
    ]);
  });

  it("reports whether anything is selected", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0);
    const some = sel({ region: ["KEN", "UGA"], topic: ["polit_harm"] });
    expect(hasActiveFilters(some)).toBe(true);
    expect(countActiveFilters(some)).toBe(3);
  });
});

describe("parseFilterParams", () => {
  it("splits comma-separated codes per dimension", () => {
    expect(
      parseFilterParams({ region: "UGA,ZAF", topic: "polit_harm", page: "2" }),
    ).toEqual({ region: ["UGA", "ZAF"], language: [], topic: ["polit_harm"] });
  });

  it("returns empty arrays for missing params", () => {
    expect(parseFilterParams({})).toEqual(EMPTY_FILTERS);
  });

  it("tolerates array-valued params and stray whitespace", () => {
    expect(
      parseFilterParams({ region: ["KEN, NGA"], language: undefined }),
    ).toEqual({ region: ["KEN", "NGA"], language: [], topic: [] });
  });
});

describe("filtersToQuery", () => {
  it("serializes only active dimensions", () => {
    expect(filtersToQuery(sel({ region: ["UGA"], language: ["en"] }))).toEqual({
      region: "UGA",
      language: "en",
    });
  });

  it("is empty for the empty selection", () => {
    expect(filtersToQuery(EMPTY_FILTERS)).toEqual({});
  });

  it("round-trips with parseFilterParams", () => {
    const original = sel({ region: ["UGA", "ZAF"], topic: ["finan_harm"] });
    expect(parseFilterParams(filtersToQuery(original))).toEqual(original);
  });
});
