import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_DESK_IMAGE } from "@/lib/content-desks";
import { getContentDesks, getDesk } from "@/lib/data/desks";

const gql = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/client", () => ({ gql, TENANT_CODE: "t" }));

/**
 * One `swp_article` row tagged with `topics`, as the Claim Topic query returns
 * it — the display name lives in the `metadata` jsonb string.
 */
function article(...topics: ({ code: string; name?: string } | string)[]) {
  return {
    metadata: JSON.stringify({
      subject: topics.map((t) =>
        typeof t === "string"
          ? { scheme: "Harm_type", code: t }
          : { scheme: "Harm_type", ...t },
      ),
    }),
  };
}

/** Answer the Claim Topic query with these rows. */
function rows(...items: { metadata: string }[]) {
  gql.mockResolvedValue({ items });
}

describe("getContentDesks", () => {
  beforeEach(() => {
    gql.mockReset();
  });

  it("makes a desk of every live Claim Topic", async () => {
    rows(
      article({ code: "climate", name: "Climate" }),
      article({ code: "gender", name: "Gender" }),
    );

    expect(await getContentDesks()).toEqual([
      {
        name: "Climate",
        slug: "climate",
        image: "/images/content-desks/content2.png",
        topic: "climate",
      },
      {
        name: "Gender",
        slug: "gender",
        image: "/images/content-desks/gender.png",
        topic: "gender",
      },
    ]);
  });

  it("keeps the Superdesk label and qcode apart: name is live, slug is URL-safe", async () => {
    rows(article({ code: "Public Finance", name: "Public Finances" }));

    const [desk] = await getContentDesks();
    expect(desk.name).toBe("Public Finances");
    expect(desk.slug).toBe("public-finance");
    expect(desk.topic).toBe("Public Finance");
  });

  it("shows a topic with no curated artwork rather than dropping it", async () => {
    rows(article({ code: "disinfo_ops", name: "Disinformation Ops" }));

    const [desk] = await getContentDesks();
    expect(desk.image).toBe(DEFAULT_DESK_IMAGE);
    expect(desk.slug).toBe("disinfo-ops");
  });

  it("drops a code with no URL-safe characters (it has no page to link to)", async () => {
    rows(
      article({ code: "---", name: "Nonsense" }),
      article({ code: "health", name: "Health" }),
    );

    expect((await getContentDesks()).map((d) => d.slug)).toEqual(["health"]);
  });

  it("keeps the first of two codes that normalise to the same slug", async () => {
    rows(
      article({ code: "climate", name: "Climate" }),
      article({ code: "Climate", name: "Climate (legacy)" }),
    );

    expect(await getContentDesks()).toHaveLength(1);
    expect((await getContentDesks())[0].name).toBe("Climate");
  });

  it("reads only fact-checks that carry a Claim Topic, so no desk is empty", async () => {
    rows(article("climate"));
    await getContentDesks();

    const [, variables] = gql.mock.calls[0];
    expect(JSON.stringify(variables.where)).toContain('"Harm_type"');
    // A scheme clause with no `code` — "tagged with something under it".
    expect(JSON.stringify(variables.where)).not.toContain('"_in":[]');
  });

  it("sorts alphabetically so publishing doesn't reshuffle the row", async () => {
    rows(
      article({ code: "health", name: "Health" }),
      article({ code: "climate", name: "Climate" }),
      article({ code: "gender", name: "Gender" }),
    );
    expect((await getContentDesks()).map((d) => d.name)).toEqual([
      "Climate",
      "Gender",
      "Health",
    ]);
  });

  it("takes the display name from whichever row spells it out", async () => {
    // Superdesk omits `name` on some subject entries; a later row supplies it.
    rows(article("climate"), article({ code: "climate", name: "Climate" }));
    expect((await getContentDesks())[0].name).toBe("Climate");
  });

  it("names a desk after its code when no row carries a label", async () => {
    rows(article("climate"));
    expect((await getContentDesks())[0].name).toBe("climate");
  });

  it("ignores subjects from other schemes", async () => {
    gql.mockResolvedValue({
      items: [
        {
          metadata: JSON.stringify({
            subject: [
              { scheme: "countrymention1", code: "KEN", name: "Kenya" },
              { scheme: "Harm_type", code: "climate", name: "Climate" },
            ],
          }),
        },
      ],
    });
    expect((await getContentDesks()).map((d) => d.slug)).toEqual(["climate"]);
  });

  it("skips a row whose metadata isn't parseable", async () => {
    gql.mockResolvedValue({
      items: [
        { metadata: "not json" },
        article({ code: "gender", name: "Gender" }),
      ],
    });
    expect((await getContentDesks()).map((d) => d.slug)).toEqual(["gender"]);
  });

  it("propagates a failed taxonomy read so the page can fall back", async () => {
    gql.mockImplementation(async () => {
      throw new Error("hasura down");
    });
    await expect(getContentDesks()).rejects.toThrow("hasura down");
  });
});

describe("getDesk", () => {
  beforeEach(() => {
    gql.mockReset();
  });

  it("resolves a live desk by its slug", async () => {
    rows(article({ code: "climate", name: "Climate" }));
    expect(await getDesk("climate")).toMatchObject({
      name: "Climate",
      topic: "climate",
    });
  });

  it("keeps the design-era slug working, mapped to its Claim Topic", async () => {
    rows(article({ code: "climate", name: "Climate" }));
    expect(await getDesk("climate-change")).toMatchObject({
      name: "Climate Change",
      topic: "climate",
    });
  });

  it("falls back to the static catalog when the taxonomy read fails", async () => {
    gql.mockImplementation(async () => {
      throw new Error("hasura down");
    });
    expect(await getDesk("scams")).toMatchObject({ topic: "scams" });
  });

  it("is undefined for a slug that names no desk", async () => {
    rows();
    expect(await getDesk("some-article-slug")).toBeUndefined();
  });
});
