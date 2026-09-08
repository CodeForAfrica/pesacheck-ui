import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLogos } from "@/lib/data/logos";

const getContentListArticles = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/stories", () => ({
  getContentListArticles,
  ANY_ROUTE: [],
}));

function logo(name: string, opts: { url?: string; sized?: boolean } = {}) {
  const { url = "https://example.org", sized = true } = opts;
  return {
    id: name,
    title: name,
    slug: name.toLowerCase(),
    swp_article_extra: url
      ? [{ field_name: "cta_url", value: `<p>${url}</p>` }]
      : [],
    swp_article_feature_media: {
      description: "",
      renditions: [
        {
          name: "original",
          width: sized ? 240 : undefined,
          height: sized ? 80 : undefined,
          image: { asset_id: "abc", file_extension: "png", variants: [] },
        },
      ],
    },
  };
}

describe("getLogos", () => {
  beforeEach(() => getContentListArticles.mockReset());

  it("maps an article to a logo with its intrinsic size", async () => {
    getContentListArticles.mockResolvedValue([logo("Meta")]);

    expect((await getLogos("any"))[0]).toEqual({
      src: "https://media.test/abc.png",
      alt: "Meta",
      width: 240,
      height: 80,
      href: "https://example.org",
    });
  });

  it("drops a logo with no link", async () => {
    getContentListArticles.mockResolvedValue([logo("Nowhere", { url: "" })]);
    expect(await getLogos("any")).toEqual([]);
  });

  it("drops a logo whose rendition has no dimensions", async () => {
    // next/image needs both, and a wall at the wrong aspect ratio is worse
    // than one logo missing.
    getContentListArticles.mockResolvedValue([
      logo("Unsized", { sized: false }),
    ]);
    expect(await getLogos("any")).toEqual([]);
  });
});
