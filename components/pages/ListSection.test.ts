import { describe, expect, it } from "vitest";
import {
  hasOwnHeadings,
  isFullBleed,
  isListSection,
} from "@/components/pages/ListSection";

describe("isListSection", () => {
  it("recognises the templates this build ships", () => {
    for (const t of [
      "faq-questions",
      "ecosystem-groups",
      "ecosystem-roles",
      "tools-showcase",
      "allies-logos",
      "partners-logos",
      "team-grid",
      "impact-stats",
    ]) {
      expect(isListSection(t)).toBe(true);
    }
  });

  it("rejects a template this build does not have, rather than throwing", () => {
    // An editor can pick a code from a vocabulary that outruns the deploy; the
    // section renders nothing instead of failing the page.
    expect(isListSection("no-such-template")).toBe(false);
    expect(isListSection(undefined)).toBe(false);
    expect(isListSection("")).toBe(false);
  });
});

describe("template traits", () => {
  it("marks the banded ecosystem sections as full bleed", () => {
    // Their backgrounds run edge to edge, so they render outside the page's
    // container rather than inside its column.
    expect(isFullBleed("ecosystem-groups")).toBe(true);
    expect(isFullBleed("ecosystem-roles")).toBe(true);
  });

  it("keeps the question grid in the column", () => {
    expect(isFullBleed("faq-questions")).toBe(false);
  });

  it("treats every built-in as bringing its own headings", () => {
    for (const t of ["faq-questions", "ecosystem-groups", "ecosystem-roles"]) {
      expect(hasOwnHeadings(t)).toBe(true);
    }
  });

  it("reports nothing for a template this build does not have", () => {
    expect(isFullBleed("no-such-template")).toBe(false);
    expect(hasOwnHeadings("no-such-template")).toBe(false);
  });
});
