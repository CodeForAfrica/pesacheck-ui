import { describe, expect, it } from "vitest";
import {
  findRendition,
  findSubject,
  getVerdict,
  parseMetadata,
  type Rendition,
} from "@/lib/data/map";

// MEDIA_URL is set to "https://media.test/" in vitest.config.ts.

describe("findRendition", () => {
  const renditions: Rendition[] = [
    {
      name: "16-9",
      image: { asset_id: "abc", file_extension: "jpg", variants: ["webp"] },
    },
    {
      name: "4-3",
      image: { asset_id: "def", file_extension: "png", variants: [] },
    },
    { name: "no-image" },
  ];

  it("prefers the webp variant when present", () => {
    expect(findRendition(renditions, "16-9")).toBe(
      "https://media.test/abc.webp",
    );
  });

  it("falls back to the file extension when webp is absent", () => {
    expect(findRendition(renditions, "4-3")).toBe("https://media.test/def.png");
  });

  it("returns undefined when the rendition name is not found", () => {
    expect(findRendition(renditions, "missing")).toBeUndefined();
  });

  it("returns undefined when the rendition has no image", () => {
    expect(findRendition(renditions, "no-image")).toBeUndefined();
  });

  it("returns undefined when renditions is undefined", () => {
    expect(findRendition(undefined, "16-9")).toBeUndefined();
  });
});

describe("parseMetadata", () => {
  it("parses a valid JSON string", () => {
    expect(parseMetadata('{"language":"en","subject":[]}')).toEqual({
      language: "en",
      subject: [],
    });
  });

  it("returns {} for null, undefined, and empty string", () => {
    expect(parseMetadata(null)).toEqual({});
    expect(parseMetadata(undefined)).toEqual({});
    expect(parseMetadata("")).toEqual({});
  });

  it("returns {} (does not throw) for malformed JSON", () => {
    expect(parseMetadata("{not valid")).toEqual({});
  });
});

describe("findSubject", () => {
  const meta = parseMetadata(
    JSON.stringify({
      subject: [
        { scheme: "Debunk", code: "false", name: "False" },
        { scheme: "countries", code: "SOM", name: "Somalia" },
        { scheme: "countries", code: "KEN", name: "Kenya" },
      ],
    }),
  );

  it("finds the subject for a scheme", () => {
    expect(findSubject(meta, "Debunk")).toEqual({
      scheme: "Debunk",
      code: "false",
      name: "False",
    });
  });

  it("returns the first match when a scheme repeats", () => {
    expect(findSubject(meta, "countries")?.code).toBe("SOM");
  });

  it("returns undefined when the scheme is absent", () => {
    expect(findSubject(meta, "platform")).toBeUndefined();
  });

  it("returns undefined when there is no subject array", () => {
    expect(findSubject({}, "Debunk")).toBeUndefined();
  });
});

describe("getVerdict", () => {
  // Shape mirrors real staging fact-checks (e.g. id 8 "FALSE: Equating Somalia…").
  const falseArticle = JSON.stringify({
    subject: [
      { scheme: "01harm", code: "polit_harm", name: "Political" },
      { scheme: "Debunk", code: "false", name: "False" },
    ],
  });

  it("extracts the verdict from the Debunk scheme", () => {
    expect(getVerdict(falseArticle)).toBe("False");
  });

  it("returns undefined when subject[] is empty (untagged article)", () => {
    // Mirrors the French fact-check (id 5) that carries no subjects.
    expect(getVerdict(JSON.stringify({ subject: [] }))).toBeUndefined();
  });

  it("returns undefined when there is no Debunk subject", () => {
    const noVerdict = JSON.stringify({
      subject: [{ scheme: "countries", code: "KEN", name: "Kenya" }],
    });
    expect(getVerdict(noVerdict)).toBeUndefined();
  });

  it("returns undefined for null / malformed metadata", () => {
    expect(getVerdict(null)).toBeUndefined();
    expect(getVerdict("{broken")).toBeUndefined();
  });
});
