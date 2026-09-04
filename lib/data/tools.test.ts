import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTools } from "@/lib/data/tools";

const getContentListArticles = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/stories", () => ({
  getContentListArticles,
  ANY_ROUTE: [],
}));

/** An article shaped the way a tool is authored. */
function tool(name: string, url?: string, withImage = true) {
  return {
    id: name,
    title: name,
    slug: name.toLowerCase(),
    lead: "<p>Explore. Visualise.</p>",
    body: "<p>What it does.</p>",
    swp_article_extra: url
      ? [{ field_name: "cta_url", value: `<p>${url}</p>` }]
      : [],
    swp_article_feature_media: withImage
      ? {
          description: "",
          renditions: [
            {
              name: "viewImage",
              image: { asset_id: "abc", file_extension: "png", variants: [] },
            },
          ],
        }
      : null,
  };
}

describe("getTools", () => {
  beforeEach(() => getContentListArticles.mockReset());

  it("maps an article to a tool card", async () => {
    getContentListArticles.mockResolvedValue([
      tool("PesaYetu", "https://pesayetu.example"),
    ]);

    expect((await getTools())[0]).toMatchObject({
      name: "PesaYetu",
      tagline: "Explore. Visualise.",
      body: "What it does.",
      href: "https://pesayetu.example",
      image: "https://media.test/abc.png",
    });
  });

  it("drops a tool with no link", async () => {
    // The whole card is a link, so one without a destination is not a card.
    getContentListArticles.mockResolvedValue([tool("Nowhere")]);
    expect(await getTools()).toEqual([]);
  });

  it("drops a tool with no screenshot", async () => {
    // The card is a full-bleed image; there is nothing to render without one.
    getContentListArticles.mockResolvedValue([
      tool("Imageless", "https://x.example", false),
    ]);
    expect(await getTools()).toEqual([]);
  });

  it("defaults the button label", async () => {
    getContentListArticles.mockResolvedValue([tool("X", "https://x.example")]);
    expect((await getTools())[0].cta).toBe("Visit website");
  });
});
