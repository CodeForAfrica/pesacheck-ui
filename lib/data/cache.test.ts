import { describe, expect, it } from "vitest";
import {
  TAGS,
  tagsForArticle,
  tagsForDelivery,
  tagsForEvent,
} from "@/lib/data/cache";

describe("tagsForEvent", () => {
  it("busts the article's own page and everything that lists it", () => {
    expect(
      tagsForEvent("article[published]", { slug: "a-fact-check" }),
    ).toEqual(["article:a-fact-check", TAGS.articles, TAGS.contentLists]);
  });

  it("treats every article event that changes what a reader sees alike", () => {
    const published = tagsForEvent("article[published]", { slug: "x" });

    for (const event of [
      "article[created]",
      "article[updated]",
      "article[unpublished]",
      "article[canceled]",
    ]) {
      expect(tagsForEvent(event, { slug: "x" })).toEqual(published);
    }
  });

  it("ignores a preview — it renders a draft that must not reach the cache", () => {
    expect(tagsForEvent("article[preview]", { slug: "a-draft" })).toEqual([]);
  });

  it("still busts the listings when the payload carries no slug", () => {
    expect(tagsForEvent("article[updated]", {})).toEqual([
      TAGS.articles,
      TAGS.contentLists,
    ]);
    expect(tagsForEvent("article[updated]", { slug: 42 })).toEqual([
      TAGS.articles,
      TAGS.contentLists,
    ]);
  });

  it("treats a route change as both the desk set and the listings", () => {
    expect(tagsForEvent("route[updated]", { slug: "climate-change" })).toEqual([
      TAGS.routes,
      TAGS.articles,
    ]);
  });

  it("maps menus to navigation alone", () => {
    expect(tagsForEvent("menu[deleted]", {})).toEqual([TAGS.navigation]);
  });

  it("returns nothing for an event no page depends on", () => {
    // The endpoint reports these rather than answering "revalidated".
    expect(tagsForEvent("package[processed]", {})).toEqual([]);
    expect(tagsForEvent("", {})).toEqual([]);
    expect(tagsForEvent("article", {})).not.toEqual([]);
  });

  it("never tags filter options — they sit in the root layout", () => {
    // They render in the root layout, so that would put every page in the
    // site behind every article edit.
    const everyEvent = [
      "article[published]",
      "article[updated]",
      "route[updated]",
      "menu[updated]",
    ].flatMap((event) => tagsForEvent(event, { slug: "x" }));

    expect(everyEvent).not.toContain(TAGS.filterOptions);
  });
});

describe("tagsForArticle", () => {
  it("matches what an article event produces", () => {
    expect(tagsForArticle("a-fact-check")).toEqual(
      tagsForEvent("article[published]", { slug: "a-fact-check" }),
    );
  });
});

describe("tagsForDelivery", () => {
  it("takes the event's answer, not the body's slug", () => {
    // Every Publisher entity carries a slug, so reading the body as a direct
    // request would undo the event map.
    expect(
      tagsForDelivery({
        event: "article[preview]",
        body: { slug: "a-draft" },
      }),
    ).toEqual([]);

    expect(
      tagsForDelivery({
        event: "route[updated]",
        body: { slug: "climate-change" },
      }),
    ).toEqual([TAGS.routes, TAGS.articles]);
  });

  it("reads the body only when no event names the change", () => {
    expect(tagsForDelivery({ body: { slug: "a-fact-check" } })).toEqual(
      tagsForArticle("a-fact-check"),
    );
    expect(tagsForDelivery({ body: { tags: ["content-lists"] } })).toEqual([
      TAGS.contentLists,
    ]);
  });

  it("answers with nothing for an empty or missing body", () => {
    expect(tagsForDelivery({})).toEqual([]);
    expect(tagsForDelivery({ body: null })).toEqual([]);
    expect(tagsForDelivery({ body: { tags: "not-an-array" } })).toEqual([]);
  });

  it("de-duplicates so a tag is never revalidated twice", () => {
    const tags = tagsForDelivery({
      body: { slug: "x", tags: ["articles", "articles"] },
    });

    expect(tags).toEqual([...new Set(tags)]);
  });
});
