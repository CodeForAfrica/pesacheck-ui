import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFaqGroups } from "@/lib/data/faqs";
import type { RawArticle } from "@/lib/data/map";

const getContentListArticles = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/stories", () => ({
  getContentListArticles,
  ANY_ROUTE: [],
}));

/** A curated question, optionally tagged with the group it belongs to. */
function question(title: string, group?: string, lead = "Yes."): RawArticle {
  return {
    id: title,
    title,
    slug: title.toLowerCase().replace(/\W+/g, "-"),
    lead: `<p>${lead}</p>`,
    metadata: JSON.stringify({
      subject: group
        ? [{ scheme: "faq_group", code: group.toLowerCase(), name: group }]
        : [],
    }),
  };
}

describe("getFaqGroups", () => {
  beforeEach(() => getContentListArticles.mockReset());

  it("groups questions by their vocabulary tag, keeping curated order", async () => {
    getContentListArticles.mockResolvedValue([
      question("Is there a free trial?", "Policy"),
      question("How does billing work?", "Articles"),
      question("Can I change my plan?", "Policy"),
    ]);

    expect(await getFaqGroups()).toEqual([
      // "Policy" leads because its first question does, not alphabetically.
      {
        title: "Policy",
        items: [
          { question: "Is there a free trial?", answer: "Yes." },
          { question: "Can I change my plan?", answer: "Yes." },
        ],
      },
      {
        title: "Articles",
        items: [{ question: "How does billing work?", answer: "Yes." }],
      },
    ]);
  });

  it("collects untagged questions in one untitled group", async () => {
    getContentListArticles.mockResolvedValue([
      question("Untagged one"),
      question("Tagged", "Policy"),
      question("Untagged two"),
    ]);

    const groups = await getFaqGroups();
    expect(groups.map((g) => g.title)).toEqual(["", "Policy"]);
    expect(groups[0].items).toHaveLength(2);
  });

  it("falls back to the body when a question has no lead", async () => {
    const noLead = question("Answered in the body");
    noLead.lead = null;
    noLead.body = "<p>The answer, in the main field.</p>";
    getContentListArticles.mockResolvedValue([noLead]);

    expect((await getFaqGroups())[0].items[0].answer).toBe(
      "The answer, in the main field.",
    );
  });

  it("returns nothing when the list is missing or empty", async () => {
    getContentListArticles.mockResolvedValue([]);
    expect(await getFaqGroups()).toEqual([]);
  });
});
