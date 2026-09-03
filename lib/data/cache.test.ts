import { describe, expect, it } from "vitest";
import { TAGS, tagsForArticle, tagsForTable } from "@/lib/data/cache";

describe("tagsForTable", () => {
  it("busts the article's own page and everything that lists it", () => {
    expect(tagsForTable("swp_article", { slug: "a-fact-check" })).toEqual([
      "article:a-fact-check",
      TAGS.articles,
      TAGS.contentLists,
    ]);
  });

  it("still busts the listings when the row carries no slug", () => {
    // The article child tables key on `article_id`; a listing refresh is all
    // they can ask for.
    expect(tagsForTable("swp_article_extra", { slug: undefined })).toEqual([
      TAGS.articles,
      TAGS.contentLists,
    ]);
  });

  it("names the list when the changed row is the list itself", () => {
    expect(
      tagsForTable("swp_content_list", { name: "Homepage — Hero" }),
    ).toEqual(["content-list:Homepage — Hero", TAGS.contentLists]);
  });

  it("falls back to every list when a reordered item can't name one", () => {
    expect(tagsForTable("swp_content_list_item", {})).toEqual([
      TAGS.contentLists,
    ]);
  });

  it("treats a route change as both the desk set and the listings", () => {
    expect(tagsForTable("swp_route", { slug: "climate-change" })).toEqual([
      TAGS.routes,
      TAGS.articles,
    ]);
  });

  it("maps menus to navigation alone", () => {
    expect(tagsForTable("swp_menu", { name: "Main Navigation" })).toEqual([
      TAGS.navigation,
    ]);
  });

  it("returns nothing for a table no page reads", () => {
    // The endpoint reports this rather than answering "revalidated", so a
    // trigger on the wrong table can't look like it is working.
    expect(tagsForTable("swp_article_statistics", {})).toEqual([]);
    expect(tagsForTable("", {})).toEqual([]);
  });

  it("ignores a non-string slug rather than tagging `article:undefined`", () => {
    expect(tagsForTable("swp_article", { slug: 42 })).toEqual([
      TAGS.articles,
      TAGS.contentLists,
    ]);
  });

  it("never tags filter options — they sit in the root layout", () => {
    // `filter-options` on an article event would put every page in the site
    // behind every edit. See the tag's own comment.
    const everyTable = [
      "swp_article",
      "swp_article_extra",
      "swp_content_list",
      "swp_content_list_item",
      "swp_route",
      "swp_menu",
    ].flatMap((table) => tagsForTable(table, { slug: "x", name: "y" }));

    expect(everyTable).not.toContain(TAGS.filterOptions);
  });
});

describe("tagsForArticle", () => {
  it("matches what a `swp_article` event produces", () => {
    expect(tagsForArticle("a-fact-check")).toEqual(
      tagsForTable("swp_article", { slug: "a-fact-check" }),
    );
  });
});
