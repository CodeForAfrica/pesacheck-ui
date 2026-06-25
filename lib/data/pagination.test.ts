import { describe, expect, it } from "vitest";
import {
  clampPage,
  pageOffset,
  parsePageParam,
  totalPages,
} from "@/lib/data/pagination";

describe("parsePageParam", () => {
  it("parses a positive integer string", () => {
    expect(parsePageParam("3")).toBe(3);
  });

  it("defaults missing/empty to page 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("")).toBe(1);
  });

  it("rejects non-positive and non-numeric values", () => {
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-2")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam("NaN")).toBe(1);
  });

  it("takes the first entry of a repeated query param", () => {
    expect(parsePageParam(["4", "9"])).toBe(4);
    expect(parsePageParam([])).toBe(1);
  });

  it("truncates a leading-numeric string the same way parseInt does", () => {
    expect(parsePageParam("2things")).toBe(2);
  });
});

describe("totalPages", () => {
  it("rounds up partial pages", () => {
    expect(totalPages(10, 10)).toBe(1);
    expect(totalPages(11, 10)).toBe(2);
    expect(totalPages(5, 2)).toBe(3);
  });

  it("returns at least 1 page for an empty corpus", () => {
    expect(totalPages(0, 10)).toBe(1);
  });

  it("is null-safe against a zero or negative page size", () => {
    expect(totalPages(50, 0)).toBe(1);
    expect(totalPages(50, -10)).toBe(1);
  });

  it("clamps a negative count to one page", () => {
    expect(totalPages(-5, 10)).toBe(1);
  });
});

describe("pageOffset", () => {
  it("is 0-based off the 1-based page", () => {
    expect(pageOffset(1, 10)).toBe(0);
    expect(pageOffset(2, 10)).toBe(10);
    expect(pageOffset(3, 2)).toBe(4);
  });

  it("clamps sub-1 pages to the first page", () => {
    expect(pageOffset(0, 10)).toBe(0);
    expect(pageOffset(-3, 10)).toBe(0);
  });
});

describe("clampPage", () => {
  it("passes through an in-range page", () => {
    expect(clampPage(2, 3)).toBe(2);
  });

  it("clamps above the total down to the last page", () => {
    expect(clampPage(9, 3)).toBe(3);
  });

  it("clamps below 1 up to the first page", () => {
    expect(clampPage(0, 3)).toBe(1);
    expect(clampPage(-5, 3)).toBe(1);
  });

  it("never returns less than 1, even for a zero total", () => {
    expect(clampPage(1, 0)).toBe(1);
  });
});

describe("offset + totalPages round-trip", () => {
  // The contract getFactChecks/staticPage rely on: a page within range maps to
  // an offset that lands inside the corpus.
  it("keeps every in-range page's offset below the item count", () => {
    const count = 5;
    const pageSize = 2;
    const pages = totalPages(count, pageSize); // 3
    for (let p = 1; p <= pages; p++) {
      expect(pageOffset(clampPage(p, pages), pageSize)).toBeLessThan(count);
    }
  });
});
