import { describe, expect, it } from "vitest";
import {
  buildFactCheckWhere,
  EMPTY_FILTERS,
  type FilterSelection,
  filtersToQuery,
  parseFilterParams,
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

  it("adds a region clause on the `countries` scheme with _in (OR within)", () => {
    const where = buildFactCheckWhere(sel({ region: ["UGA", "ZAF"] }), "t");
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "countries" },
          code: { _in: ["UGA", "ZAF"] },
        },
      },
    });
  });

  it("adds a topic clause on the `01harm` scheme", () => {
    const where = buildFactCheckWhere(sel({ topic: ["polit_harm"] }), "t");
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "01harm" },
          code: { _in: ["polit_harm"] },
        },
      },
    });
  });

  it("filters language on the metadata.language column", () => {
    const where = buildFactCheckWhere(sel({ language: ["en", "fr"] }), "t");
    expect(where._and).toContainEqual({
      swp_article_metadata: { language: { _in: ["en", "fr"] } },
    });
  });

  it("ANDs dimensions as separate clauses (Debunk + region + topic + lang)", () => {
    const where = buildFactCheckWhere(
      sel({ region: ["UGA"], topic: ["polit_harm"], language: ["en"] }),
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
    const where = buildFactCheckWhere(EMPTY_FILTERS, "t", "climate-change");
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
    const where = buildFactCheckWhere(
      sel({ topic: ["polit_harm"] }),
      "t",
      "elections",
    );
    expect(where._and).toContainEqual({
      swp_route: { slug: { _eq: "elections" } },
    });
    expect(where._and).toContainEqual({
      swp_article_metadata: {
        swp_article_metadata_subjects: {
          scheme: { _eq: "01harm" },
          code: { _in: ["polit_harm"] },
        },
      },
    });
    expect(where._and).toHaveLength(3);
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
