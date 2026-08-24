import { describe, expect, it } from "vitest";
import {
  deriveFilterOptions,
  type TaxonomyRow,
} from "@/lib/data/filter-options";

/** Build a row the way Hasura returns it: `metadata` is a JSON *string*. */
const row = (
  meta: Record<string, unknown>,
  language?: string | null,
): TaxonomyRow => ({
  metadata: JSON.stringify(meta),
  swp_article_metadata: language === undefined ? null : { language },
});

const subject = (scheme: string, code: string, name: string) => ({
  scheme,
  code,
  name,
});

describe("deriveFilterOptions", () => {
  it("derives region and topic options from the metadata subjects", () => {
    const options = deriveFilterOptions([
      row(
        {
          subject: [
            subject("Debunk", "false", "False"),
            subject("countries", "KEN", "Kenya"),
            subject("01harm", "polit_harm", "Political"),
          ],
        },
        "en",
      ),
    ]);

    expect(options.region).toEqual([{ code: "KEN", label: "Kenya" }]);
    expect(options.topic).toEqual([{ code: "polit_harm", label: "Political" }]);
    expect(options.language).toEqual([{ code: "en", label: "English" }]);
  });

  it("dedupes codes across articles and sorts by label", () => {
    const options = deriveFilterOptions([
      row({ subject: [subject("countries", "UGA", "Uganda")] }, "en"),
      row({ subject: [subject("countries", "KEN", "Kenya")] }, "fr"),
      row({ subject: [subject("countries", "UGA", "Uganda")] }, "en"),
    ]);

    expect(options.region).toEqual([
      { code: "KEN", label: "Kenya" },
      { code: "UGA", label: "Uganda" },
    ]);
    expect(options.language).toEqual([
      { code: "en", label: "English" },
      { code: "fr", label: "French" },
    ]);
  });

  it("picks up a vocabulary addition with no code change", () => {
    // A scheme value that appears in no curated list still becomes an option.
    const options = deriveFilterOptions([
      row({ subject: [subject("countries", "MWI", "Malawi")] }, "ny"),
    ]);
    expect(options.region).toEqual([{ code: "MWI", label: "Malawi" }]);
    // Unknown language codes have no label map entry — the code stands in.
    expect(options.language).toEqual([{ code: "ny", label: "ny" }]);
  });

  it("falls back to the code when a subject carries no display name", () => {
    const options = deriveFilterOptions([
      row({ subject: [{ scheme: "01harm", code: "cyber_harm", name: "" }] }),
      // A later article naming the same code upgrades the label.
      row({ subject: [subject("01harm", "cyber_harm", "Cyber")] }),
    ]);
    expect(options.topic).toEqual([{ code: "cyber_harm", label: "Cyber" }]);
  });

  it("prefers the normalized language column over the jsonb copy", () => {
    const options = deriveFilterOptions([
      {
        metadata: JSON.stringify({ language: "fr" }),
        swp_article_metadata: { language: "en" },
      },
    ]);
    expect(options.language).toEqual([{ code: "en", label: "English" }]);
  });

  it("falls back to the jsonb language when the relation row is missing", () => {
    const options = deriveFilterOptions([
      { metadata: JSON.stringify({ language: "sw" }) },
    ]);
    expect(options.language).toEqual([{ code: "sw", label: "Swahili" }]);
  });

  it("ignores unparseable, empty and untagged rows", () => {
    const options = deriveFilterOptions([
      { metadata: "not json" },
      { metadata: null, swp_article_metadata: { language: null } },
      row({}),
      row({ subject: [] }, ""),
    ]);
    expect(options).toEqual({ region: [], language: [], topic: [] });
  });
});
