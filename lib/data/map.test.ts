import { describe, expect, it } from "vitest";
import {
  computeReadTime,
  findRendition,
  findSubject,
  formatStoryDate,
  getVerdict,
  mapStory,
  parseMetadata,
  type RawArticle,
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

describe("formatStoryDate", () => {
  it("formats an ISO timestamp as short month + day (UTC)", () => {
    expect(formatStoryDate("2024-07-28T23:30:00+00:00")).toBe("Jul 28");
  });

  it("returns undefined for null/undefined/invalid input", () => {
    expect(formatStoryDate(null)).toBeUndefined();
    expect(formatStoryDate(undefined)).toBeUndefined();
    expect(formatStoryDate("not a date")).toBeUndefined();
  });
});

describe("computeReadTime", () => {
  it("estimates minutes from word count (~200 wpm)", () => {
    const body = `${"word ".repeat(400)}`; // 400 words → 2 min
    expect(computeReadTime(body)).toBe("2 min");
  });

  it("strips HTML before counting", () => {
    expect(computeReadTime("<p>one two three</p>")).toBe("1 min");
  });

  it("rounds up to a 1 min floor for short bodies", () => {
    expect(computeReadTime("just a few words")).toBe("1 min");
  });

  it("returns undefined when there is no body", () => {
    expect(computeReadTime(null)).toBeUndefined();
    expect(computeReadTime("")).toBeUndefined();
    expect(computeReadTime("<p></p>")).toBeUndefined();
  });
});

describe("mapStory", () => {
  // Mirrors the shape returned by GET_CONTENT_LIST_ITEMS for a staging article.
  const article: RawArticle = {
    id: 8,
    title: "Equating Somalia and Al-Shabaab is untrue",
    slug: "false-equating-somalia-and-al-shabab-is-untrue",
    lead: "<p>The claim that...</p>",
    body: `<p>${"word ".repeat(200)}</p>`,
    published_at: "2024-07-28T10:00:00+00:00",
    metadata: JSON.stringify({
      subject: [{ scheme: "Debunk", code: "false", name: "False" }],
    }),
    swp_route: { slug: "english", staticprefix: "/english" },
    swp_article_feature_media: {
      description: "A photo caption",
      renditions: [
        {
          name: "viewImage",
          image: { asset_id: "abc", file_extension: "jpg", variants: ["webp"] },
        },
      ],
    },
  };

  it("maps a fully-populated article to a Story", () => {
    expect(mapStory(article)).toEqual({
      image: "https://media.test/abc.webp",
      alt: "A photo caption",
      verdict: "False",
      title: "Equating Somalia and Al-Shabaab is untrue",
      excerpt: "The claim that...",
      date: "Jul 28",
      readTime: "1 min",
      href: "/fact-checks/english/false-equating-somalia-and-al-shabab-is-untrue",
    });
  });

  it("falls back to the title for alt when no media description", () => {
    const story = mapStory({
      ...article,
      swp_article_feature_media: {
        renditions: article.swp_article_feature_media?.renditions,
      },
    });
    expect(story.alt).toBe(article.title);
  });

  it("prefers viewImage but falls back to any resolvable rendition", () => {
    const story = mapStory({
      ...article,
      swp_article_feature_media: {
        renditions: [
          {
            name: "square",
            image: { asset_id: "sq", file_extension: "png", variants: [] },
          },
        ],
      },
    });
    expect(story.image).toBe("https://media.test/sq.png");
  });

  it("uses a placeholder image when there is no feature media", () => {
    const story = mapStory({ ...article, swp_article_feature_media: null });
    expect(story.image).toBe("/images/spotlight/long-format3-2.png");
  });

  it("is null-safe: no verdict, excerpt, date or readTime when data is missing", () => {
    const story = mapStory({
      id: 1,
      title: "Bare article",
      slug: "bare",
      lead: null,
      body: null,
      published_at: null,
      metadata: null,
      swp_route: null,
      swp_article_feature_media: null,
    });
    expect(story.verdict).toBeUndefined();
    expect(story.excerpt).toBeUndefined();
    expect(story.date).toBeUndefined();
    expect(story.readTime).toBeUndefined();
    expect(story.href).toBe("/fact-checks/bare");
  });
});
