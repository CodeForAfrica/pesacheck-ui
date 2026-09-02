import { beforeEach, describe, expect, it, vi } from "vitest";
import { getEcosystemGroups, getEcosystemRoles } from "@/lib/data/ecosystem";
import type { RawArticle } from "@/lib/data/map";

const getContentListArticles = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/stories", () => ({ getContentListArticles }));

function partner(name: string, group?: string): RawArticle {
  return {
    id: name,
    title: name,
    slug: name.toLowerCase(),
    lead: `<p>About ${name}.</p>`,
    metadata: JSON.stringify({
      subject: group
        ? [
            {
              scheme: "ecosystem_group",
              code: group.toLowerCase(),
              name: group,
            },
          ]
        : [],
    }),
  };
}

describe("getEcosystemGroups", () => {
  beforeEach(() => getContentListArticles.mockReset());

  it("groups partners by vocabulary, in first-appearance order", async () => {
    getContentListArticles.mockResolvedValue([
      partner("IFCN", "Networks"),
      partner("ANCIR", "Research"),
      partner("AFCA", "Networks"),
    ]);

    const groups = await getEcosystemGroups();
    expect(groups.map((g) => g.title)).toEqual(["Networks", "Research"]);
    expect(groups[0].items.map((i) => i.name)).toEqual(["IFCN", "AFCA"]);
  });

  it("runs the accent cycle across the list, not per group", async () => {
    // Otherwise every group would open on blue, and uneven groups would put
    // the same colour side by side across a group boundary.
    getContentListArticles.mockResolvedValue([
      partner("One", "A"),
      partner("Two", "B"),
      partner("Three", "B"),
    ]);

    const groups = await getEcosystemGroups();
    expect(groups[0].items[0].tone).toBe("blue");
    expect(groups[1].items.map((i) => i.tone)).toEqual(["green", "ink"]);
  });

  it("collects untagged partners in one untitled group", async () => {
    getContentListArticles.mockResolvedValue([
      partner("Loose"),
      partner("Tagged", "Networks"),
    ]);

    const groups = await getEcosystemGroups();
    expect(groups.map((g) => g.title)).toEqual(["", "Networks"]);
  });

  it("returns nothing when the list is missing or empty", async () => {
    getContentListArticles.mockResolvedValue([]);
    expect(await getEcosystemGroups()).toEqual([]);
  });
});

describe("getEcosystemRoles", () => {
  beforeEach(() => getContentListArticles.mockReset());

  function role(title: string, icon?: string): RawArticle {
    return {
      id: title,
      title,
      slug: title.toLowerCase().replace(/\W+/g, "-"),
      lead: `<p>What ${title} means.</p>`,
      metadata: JSON.stringify({
        subject: icon
          ? [{ scheme: "ecosystem_role_icon", code: icon, name: icon }]
          : [],
      }),
    };
  }

  it("maps roles, taking the icon from its vocabulary code", async () => {
    getContentListArticles.mockResolvedValue([
      role("We convene", "announce"),
      role("We build tools", "server"),
    ]);

    expect(await getEcosystemRoles()).toEqual([
      {
        icon: "announce",
        title: "We convene",
        description: "What We convene means.",
      },
      {
        icon: "server",
        title: "We build tools",
        description: "What We build tools means.",
      },
    ]);
  });

  it("falls back to the default icon when untagged or unknown", async () => {
    // A build only has the icons in ECOSYSTEM_ROLE_ICONS; an editor picking
    // one this build lacks gets the default rather than an empty badge.
    getContentListArticles.mockResolvedValue([
      role("Untagged"),
      role("Unknown icon", "telescope"),
    ]);

    const roles = await getEcosystemRoles();
    expect(roles.map((r) => r.icon)).toEqual(["announce", "announce"]);
  });

  it("does not cap the list — a fourth role wraps onto a second row", async () => {
    getContentListArticles.mockResolvedValue([
      role("One", "announce"),
      role("Two", "hand"),
      role("Three", "server"),
      role("Four", "hand"),
    ]);
    expect(await getEcosystemRoles()).toHaveLength(4);
  });
});
