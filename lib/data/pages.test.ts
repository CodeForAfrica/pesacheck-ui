import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPage, pageListName } from "@/lib/data/pages";

const gql = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/client", () => ({ gql, TENANT_CODE: "123abc" }));

type Article = {
  id: number | string;
  title: string;
  slug: string;
  lead?: string | null;
  body?: string | null;
  metadata?: string | null;
};

/** Tag an article as its page's hero, the way Superdesk stores it. */
function asHero<T extends Article>(article: T): T {
  return {
    ...article,
    metadata: JSON.stringify({
      subject: [{ scheme: "page_section_role", code: "hero", name: "Hero" }],
    }),
  };
}

/**
 * `getPage` makes two calls: routes first, then the section list. The list
 * name it asks for is captured so the naming convention can be asserted.
 */
function respond(routes: unknown[], articles: Article[]) {
  const asked: string[] = [];
  gql.mockImplementation((_query: string, vars: { name?: string }) => {
    if (vars?.name === undefined) return Promise.resolve({ routes });
    asked.push(vars.name);
    return Promise.resolve({
      list: [{ name: vars.name, items: articles.map((a) => ({ article: a })) }],
    });
  });
  return asked;
}

const route = {
  id: 1,
  name: "Knowledge",
  slug: "knowledge",
  type: "content",
  staticprefix: "/knowledge",
};

describe("getPage", () => {
  beforeEach(() => gql.mockReset());

  it("takes the hero from the first section and the body from the rest", async () => {
    respond(
      [route],
      [
        {
          id: 1,
          title: "Knowledge",
          slug: "hero",
          lead: "<p>How we teach.</p>",
        },
        {
          id: 2,
          title: "Training",
          slug: "training",
          body: "<p>Courses.</p><ul><li>Funding</li></ul>",
        },
        {
          id: 3,
          title: "Mentorships",
          slug: "mentorships",
          body: "<p>Pairs.</p>",
        },
      ],
    );

    const page = await getPage("knowledge");
    expect(page?.hero).toMatchObject({
      title: "Knowledge",
      subtitle: "How we teach.",
    });
    expect(page?.sections.map((s) => s.id)).toEqual([
      "training",
      "mentorships",
    ]);
    // Lists survive: the design's funding bullets are authored, not modelled.
    expect(page?.sections[0].bodyHtml).toContain("<li>Funding</li>");
  });

  it("uses the article slug as the anchor, not the heading text", async () => {
    // Anchors are public links; deriving them from a heading would break them
    // whenever the heading is reworded.
    respond(
      [route],
      [
        { id: 1, title: "Knowledge", slug: "hero" },
        { id: 2, title: "A heading someone will reword", slug: "training" },
      ],
    );

    expect((await getPage("knowledge"))?.sections[0].id).toBe("training");
  });

  it("asks for the list named after the route", async () => {
    const asked = respond([route], [{ id: 1, title: "Knowledge", slug: "h" }]);
    await getPage("knowledge");
    expect(asked).toEqual(["Page — Knowledge"]);
    expect(pageListName("Knowledge")).toBe("Page — Knowledge");
  });

  it("falls back to the lead when a section has no body", async () => {
    respond(
      [route],
      [
        { id: 1, title: "Knowledge", slug: "hero" },
        { id: 2, title: "Training", slug: "training", lead: "<p>Short.</p>" },
      ],
    );

    expect((await getPage("knowledge"))?.sections[0].bodyHtml).toContain(
      "Short.",
    );
  });

  it("returns null when the route does not exist", async () => {
    respond([{ id: 2, name: "Other", slug: "other" }], []);
    expect(await getPage("knowledge")).toBeNull();
  });

  it("returns null when the list is empty, so the page keeps its fallback", async () => {
    respond([route], []);
    expect(await getPage("knowledge")).toBeNull();
  });

  it("renders a hero-only page with no sections", async () => {
    respond([route], [{ id: 1, title: "Knowledge", slug: "hero" }]);

    const page = await getPage("knowledge");
    expect(page?.hero.title).toBe("Knowledge");
    expect(page?.sections).toEqual([]);
  });
});

describe("hero selection", () => {
  beforeEach(() => gql.mockReset());

  it("takes the tagged section as the hero wherever it sits", async () => {
    respond(
      [route],
      [
        { id: 1, title: "Training", slug: "training", body: "<p>Courses.</p>" },
        asHero({
          id: 2,
          title: "Knowledge",
          slug: "banner",
          lead: "<p>Lead.</p>",
        }),
        { id: 3, title: "Incubator", slug: "incubator", body: "<p>Desks.</p>" },
      ],
    );

    const page = await getPage("knowledge");
    expect(page?.hero.title).toBe("Knowledge");
    // The hero is removed from the body wherever it was, and the rest keep
    // their curated order.
    expect(page?.sections.map((s) => s.id)).toEqual(["training", "incubator"]);
  });

  it("falls back to the first item when nothing is tagged", async () => {
    respond(
      [route],
      [
        { id: 1, title: "Knowledge", slug: "hero", lead: "<p>Lead.</p>" },
        { id: 2, title: "Training", slug: "training" },
      ],
    );

    const page = await getPage("knowledge");
    expect(page?.hero.title).toBe("Knowledge");
    expect(page?.sections.map((s) => s.id)).toEqual(["training"]);
  });

  it("uses the first tagged section when more than one is marked", async () => {
    respond(
      [route],
      [
        asHero({ id: 1, title: "First", slug: "a" }),
        asHero({ id: 2, title: "Second", slug: "b" }),
      ],
    );

    const page = await getPage("knowledge");
    expect(page?.hero.title).toBe("First");
    expect(page?.sections.map((s) => s.id)).toEqual(["b"]);
  });
});

describe("path matching", () => {
  beforeEach(() => gql.mockReset());

  it("resolves a nested page by its static prefix", async () => {
    // The URL is whatever Publisher serves the route at, not the bare slug.
    respond(
      [
        {
          id: 2,
          name: "Principles",
          slug: "principles",
          staticprefix: "/about/principles",
        },
      ],
      [{ id: 1, title: "Principles", slug: "hero" }],
    );

    expect((await getPage("about/principles"))?.title).toBe("Principles");
    // The bare slug is not the URL, so it must not resolve.
    expect(await getPage("principles")).toBeNull();
  });

  it("tolerates surrounding slashes in the path", async () => {
    respond([route], [{ id: 1, title: "Knowledge", slug: "hero" }]);
    expect((await getPage("/knowledge/"))?.title).toBe("Knowledge");
  });
});

describe("section anchors", () => {
  beforeEach(() => gql.mockReset());

  it("strips the page prefix so namespaced sluglines keep clean anchors", async () => {
    // Slugs are unique tenant-wide, so a second page needing "who-we-are"
    // must namespace it; the anchor should not inherit that.
    respond(
      [
        {
          id: 2,
          name: "Methodology",
          slug: "methodology",
          staticprefix: "/about/methodology",
        },
      ],
      [
        { id: 1, title: "How PesaCheck Works", slug: "methodology-hero" },
        { id: 2, title: "Who We Are", slug: "methodology-who-we-are" },
        { id: 3, title: "Our Sources", slug: "our-sources" },
      ],
    );

    const page = await getPage("about/methodology");
    expect(page?.sections.map((s) => s.id)).toEqual([
      "who-we-are",
      "our-sources",
    ]);
  });

  it("leaves a slug that merely starts with the page name alone", async () => {
    respond(
      [
        {
          id: 2,
          name: "Knowledge",
          slug: "knowledge",
          staticprefix: "/knowledge",
        },
      ],
      [
        { id: 1, title: "Knowledge", slug: "hero" },
        // No hyphen boundary, so nothing is stripped.
        { id: 2, title: "Knowledgebase", slug: "knowledgebase" },
      ],
    );

    expect((await getPage("knowledge"))?.sections[0].id).toBe("knowledgebase");
  });
});

describe("call to action", () => {
  beforeEach(() => gql.mockReset());

  /** A section tagged `cta`, with the button fields Superdesk stores. */
  function ctaSection(url?: string, label?: string) {
    const extra = [
      url ? { field_name: "cta_url", value: url } : null,
      label ? { field_name: "cta_label", value: label } : null,
    ].filter(Boolean);
    return {
      id: 9,
      title: "Still have questions?",
      slug: "faqs-cta",
      lead: "<p>Chat to our team.</p>",
      metadata: JSON.stringify({
        subject: [{ scheme: "page_section_role", code: "cta", name: "CTA" }],
      }),
      swp_article_extra: extra,
    };
  }

  it("lifts a tagged section out of the body into the CTA", async () => {
    respond(
      [route],
      [
        { id: 1, title: "FAQs", slug: "hero" },
        { id: 2, title: "A section", slug: "a-section" },
        ctaSection("/about/contact-us", "Get in touch"),
      ],
    );

    const page = await getPage("knowledge");
    expect(page?.cta).toEqual({
      heading: "Still have questions?",
      body: "Chat to our team.",
      label: "Get in touch",
      href: "/about/contact-us",
    });
    // It is a call-out bar, not something the rail scrolls to.
    expect(page?.sections.map((s) => s.id)).toEqual(["a-section"]);
  });

  it("defaults the button label when only a URL is given", async () => {
    respond(
      [route],
      [{ id: 1, title: "FAQs", slug: "hero" }, ctaSection("/x")],
    );
    expect((await getPage("knowledge"))?.cta?.label).toBe("Get in touch");
  });

  it("drops a CTA with no URL rather than rendering a dead button", async () => {
    respond([route], [{ id: 1, title: "FAQs", slug: "hero" }, ctaSection()]);

    const page = await getPage("knowledge");
    expect(page?.cta).toBeUndefined();
    // Without a destination it stays an ordinary section rather than vanishing.
    expect(page?.sections.map((s) => s.id)).toEqual(["faqs-cta"]);
  });
});

describe("list sections", () => {
  beforeEach(() => gql.mockReset());

  /** A section naming a built-in template, optionally overriding its list. */
  function templated(code: string, list?: string) {
    return {
      id: 5,
      title: "Frequently asked questions",
      slug: "questions",
      metadata: JSON.stringify({
        subject: [{ scheme: "page_section_template", code, name: code }],
      }),
      swp_article_extra: list
        ? [{ field_name: "content_list", value: list }]
        : [],
    };
  }

  it("carries the template and list override onto the section", async () => {
    respond(
      [route],
      [
        { id: 1, title: "FAQs", slug: "hero" },
        templated("faq-questions", "Page — FAQs — Questions"),
      ],
    );

    const section = (await getPage("knowledge"))?.sections[0];
    expect(section?.template).toBe("faq-questions");
    expect(section?.listName).toBe("Page — FAQs — Questions");
  });

  it("leaves the list undefined so the template uses its own default", async () => {
    respond(
      [route],
      [{ id: 1, title: "FAQs", slug: "hero" }, templated("faq-questions")],
    );

    const section = (await getPage("knowledge"))?.sections[0];
    expect(section?.template).toBe("faq-questions");
    expect(section?.listName).toBeUndefined();
  });

  it("leaves an ordinary section with no template", async () => {
    respond(
      [route],
      [
        { id: 1, title: "Knowledge", slug: "hero" },
        { id: 2, title: "Training", slug: "training", body: "<p>Copy.</p>" },
      ],
    );

    expect((await getPage("knowledge"))?.sections[0].template).toBeUndefined();
  });
});
