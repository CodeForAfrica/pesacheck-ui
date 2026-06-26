import { describe, expect, it } from "vitest";
import { renderArticleBody, renderBody } from "@/lib/data/body";
import {
  computeReadTime,
  findRendition,
  findSubject,
  formatStoryDate,
  getVerdict,
  mapArticle,
  mapStory,
  parseMetadata,
  type RawArticle,
  type RawFullArticle,
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

  it("populates region/topic/language display labels from the jsonb", () => {
    const story = mapStory({
      ...article,
      metadata: JSON.stringify({
        language: "en",
        subject: [
          { scheme: "Debunk", code: "false", name: "False" },
          { scheme: "countries", code: "UGA", name: "Uganda" },
          { scheme: "01harm", code: "polit_harm", name: "Political" },
        ],
      }),
    });
    expect(story.region).toBe("Uganda");
    expect(story.topic).toBe("Political");
    expect(story.language).toBe("English");
  });

  it("leaves taxonomy undefined when the jsonb carries none", () => {
    const story = mapStory(article);
    expect(story.region).toBeUndefined();
    expect(story.topic).toBeUndefined();
    expect(story.language).toBeUndefined();
  });

  it("falls back to the raw language code when not a known label", () => {
    const story = mapStory({
      ...article,
      metadata: JSON.stringify({ language: "zz", subject: [] }),
    });
    expect(story.language).toBe("zz");
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

describe("renderBody", () => {
  it("rewrites publisher <img> src to MEDIA_URL + filename", () => {
    const html =
      '<p><img src="https://cdn.example.com/path/to/photo.jpg"/></p>';
    expect(renderBody(html)).toContain('src="https://media.test/photo.jpg"');
  });

  it("preserves evidence links (the point of a fact-check)", () => {
    const html = '<p>see <a href="https://archive.ph/PJG67">here</a></p>';
    const out = renderBody(html);
    expect(out).toContain('href="https://archive.ph/PJG67"');
    expect(out).toContain("here");
  });

  it("strips disallowed tags like <script>", () => {
    const out = renderBody("<p>ok</p><script>alert(1)</script>");
    expect(out).toContain("<p>ok</p>");
    expect(out).not.toContain("<script>");
    expect(out).not.toContain("alert(1)");
  });

  it("returns undefined for empty/null input", () => {
    expect(renderBody(null)).toBeUndefined();
    expect(renderBody(undefined)).toBeUndefined();
    expect(renderBody("")).toBeUndefined();
  });
});

describe("renderArticleBody", () => {
  // Mirrors staging: the footer boilerplate is appended into the body (there is
  // no body_footer field), always starting with the standard PesaCheck sentence.
  const withFooter = [
    "<p>The claim is <b>FALSE</b>.</p>",
    "<p>PesaCheck examined the post and found it to be FALSE.</p>",
    "<p>This post is part of an ongoing series of PesaCheck fact-checks examining misinformation.</p>",
    "<p>PesaCheck is East Africa’s first public finance fact-checking initiative.</p>",
  ].join("\n");

  it("splits the boilerplate out of the body into footnotes", () => {
    const { bodyHtml, footnotes } = renderArticleBody(withFooter);
    expect(bodyHtml).toContain("found it to be FALSE");
    expect(bodyHtml).not.toContain("This post is part");
    expect(bodyHtml).not.toContain("public finance fact-checking");
    expect(footnotes).toEqual([
      "This post is part of an ongoing series of PesaCheck fact-checks examining misinformation.",
      "PesaCheck is East Africa’s first public finance fact-checking initiative.",
    ]);
  });

  it("keeps the whole body when the marker is absent", () => {
    const { bodyHtml, footnotes } = renderArticleBody("<p>No boilerplate.</p>");
    expect(bodyHtml).toContain("No boilerplate.");
    expect(footnotes).toEqual([]);
  });

  it("preserves links inside footnotes (not just plain text)", () => {
    const html = [
      "<p>The claim is false.</p>",
      '<p>This post is part of an ongoing series of PesaCheck fact-checks. Here’s how you can <a href="https://pesacheck.org/report">report</a>.</p>',
    ].join("\n");
    const { footnotes } = renderArticleBody(html);
    expect(footnotes).toHaveLength(1);
    expect(footnotes[0]).toContain('<a href="https://pesacheck.org/report">');
    expect(footnotes[0]).toContain("report</a>");
  });

  it("is empty for null/empty input", () => {
    expect(renderArticleBody(null)).toEqual({ footnotes: [] });
    expect(renderArticleBody("")).toEqual({ footnotes: [] });
  });
});

describe("mapArticle", () => {
  // Mirrors a fully-populated single-article row from GET_ARTICLE_BY_SLUG.
  const full: RawFullArticle = {
    id: 8,
    title: "Equating Somalia and Al-Shabaab is untrue",
    slug: "false-equating-somalia-and-al-shabab-is-untrue",
    lead: "<p>The claim...</p>",
    body: `<p><a href="https://archive.ph/x">${"word ".repeat(200)}</a></p>`,
    published_at: "2024-04-02T14:40:08",
    metadata: JSON.stringify({
      subject: [{ scheme: "Debunk", code: "false", name: "False" }],
    }),
    swp_route: { slug: "english", staticprefix: "/english" },
    swp_article_metadata: { byline: "Desk byline" },
    swp_article_feature_media: {
      description: "A caption",
      renditions: [
        {
          name: "viewImage",
          image: { asset_id: "abc", file_extension: "jpg", variants: ["webp"] },
        },
      ],
    },
    swp_article_authors: [
      { swp_author: { name: "Jane Doe" } },
      { swp_author: { name: "John Roe" } },
    ],
    swp_article_keywords: [
      { swp_keyword: { name: "Somalia" } },
      { swp_keyword: { name: "Security" } },
    ],
    swp_article_related: [
      {
        swp_article: {
          id: 9,
          title: "Related one",
          slug: "related-one",
          swp_route: { slug: "english" },
        },
      },
    ],
  };

  it("maps a fully-populated article", () => {
    const article = mapArticle(full);
    expect(article.slug).toBe("false-equating-somalia-and-al-shabab-is-untrue");
    expect(article.format).toBe("short");
    expect(article.verdict).toBe("False");
    expect(article.tags).toEqual(["Somalia", "Security"]);
    expect(article.author).toBe("Jane Doe, John Roe");
    expect(article.date).toBe("Apr 2");
    expect(article.readTime).toBe("1 min");
    expect(article.image).toBe("https://media.test/abc.webp");
    expect(article.alt).toBe("A caption");
    expect(article.desk).toBe("english");
    // Body is rendered HTML, not structured paragraphs.
    expect(article.leadParagraphs).toEqual([]);
    expect(article.bodyParagraphs).toEqual([]);
    expect(article.bodyHtml).toContain('href="https://archive.ph/x"');
    expect(article.relatedStories).toHaveLength(1);
    expect(article.relatedStories[0].href).toBe(
      "/fact-checks/english/related-one",
    );
  });

  it("is null-safe for sparse staging data (no media, authors, keywords, related)", () => {
    // Mirrors real staging fact-check id 8: rich body, everything else empty.
    const article = mapArticle({
      id: 8,
      title: "FALSE: Equating Somalia and Al Shabab is untrue",
      slug: "false-equating-somalia-and-al-shabab-is-untrue",
      lead: null,
      body: "<p>Some <b>claim</b>.</p>",
      published_at: "2024-04-02T14:40:08",
      metadata: JSON.stringify({
        subject: [{ scheme: "Debunk", code: "false", name: "False" }],
      }),
      swp_route: { slug: "english", staticprefix: "/english" },
      swp_article_metadata: { byline: null },
      swp_article_feature_media: null,
      swp_article_authors: [],
      swp_article_keywords: [],
      swp_article_related: [],
    });
    expect(article.tags).toEqual([]);
    expect(article.relatedStories).toEqual([]);
    expect(article.author).toBe("PesaCheck");
    expect(article.verdict).toBe("False");
    expect(article.image).toBe("/images/spotlight/long-format3-2.png");
    expect(article.bodyHtml).toContain("<b>claim</b>");
  });

  it("moves the appended footer boilerplate into footnotes", () => {
    const article = mapArticle({
      ...full,
      body: [
        "<p>The claim is false.</p>",
        "<p>This post is part of an ongoing series of PesaCheck fact-checks examining misinformation.</p>",
      ].join("\n"),
    });
    expect(article.bodyHtml).toContain("The claim is false.");
    expect(article.bodyHtml).not.toContain("This post is part");
    expect(article.footnotes).toEqual([
      "This post is part of an ongoing series of PesaCheck fact-checks examining misinformation.",
    ]);
  });

  it("falls back to the jsonb byline when there are no authors", () => {
    const article = mapArticle({
      ...full,
      swp_article_authors: [],
      metadata: JSON.stringify({ byline: "Metadata Byline", subject: [] }),
      swp_article_metadata: { byline: "Relation Byline" },
    });
    expect(article.author).toBe("Metadata Byline");
  });
});
