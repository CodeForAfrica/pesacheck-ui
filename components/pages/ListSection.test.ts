import { describe, expect, it } from "vitest";
import { isListSection } from "@/components/pages/ListSection";

describe("isListSection", () => {
  it("recognises the templates this build ships", () => {
    expect(isListSection("faq-questions")).toBe(true);
  });

  it("rejects a template this build does not have, rather than throwing", () => {
    // An editor can pick a code from a vocabulary that outruns the deploy; the
    // section renders nothing instead of failing the page.
    expect(isListSection("team-grid")).toBe(false);
    expect(isListSection(undefined)).toBe(false);
    expect(isListSection("")).toBe(false);
  });
});
