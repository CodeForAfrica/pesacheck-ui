import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNavigation } from "@/lib/data/navigation";

const gql = vi.hoisted(() => vi.fn());
vi.mock("@/lib/data/client", () => ({ gql, TENANT_CODE: "123abc" }));

type Row = {
  id: number;
  name?: string | null;
  label?: string | null;
  uri?: string | null;
  parent_id?: number | null;
  extras?: string | null;
};

/** The shape Publisher stores: a root row, then its descendants in lft order. */
function tree(...rows: Row[]) {
  gql.mockResolvedValue({ menus: rows });
}

const root: Row = { id: 1, name: "Main Navigation", parent_id: null };

describe("getNavigation", () => {
  beforeEach(() => gql.mockReset());

  it("builds top-level links and their mega-menu items", async () => {
    tree(
      root,
      {
        id: 2,
        label: "About Us",
        uri: "/about",
        parent_id: 1,
      },
      {
        id: 3,
        label: "FAQs",
        uri: "/about/faqs",
        parent_id: 2,
      },
      { id: 4, label: "Tools", uri: "/tools", parent_id: 1 },
    );

    const links = await getNavigation();
    expect(links).toHaveLength(2);

    expect(links[0].label).toBe("About Us");
    expect(links[0].href).toBe("/about");
    // The blurb comes from NAV_MENU_META, keyed on the destination.
    expect(links[0].menu?.description).toContain("PesaCheck");
    expect(links[0].menu?.items.map((i) => i.label)).toEqual(["FAQs"]);

    // No children means a plain link, with no menu key at all.
    expect(links[1]).toEqual({ label: "Tools", href: "/tools" });
  });

  it("carries a filter dimension so an item opens the filter panel", async () => {
    tree(
      root,
      { id: 2, label: "Fact-Checks", uri: "/fact-checks", parent_id: 1 },
      {
        id: 3,
        label: "By Language",
        uri: "/fact-checks?filter=language",
        parent_id: 2,
      },
    );

    const item = (await getNavigation())[0].menu?.items[0];
    expect(item?.filterDimension).toBe("language");
    // The instruction is consumed; the href is the plain destination.
    expect(item?.href).toBe("/fact-checks");
  });

  it("ignores an unknown filter dimension rather than passing it through", async () => {
    tree(
      root,
      { id: 2, label: "Fact-Checks", uri: "/fact-checks", parent_id: 1 },
      {
        id: 3,
        label: "By Vibe",
        uri: "/fact-checks?filter=vibe",
        parent_id: 2,
      },
    );

    const item = (await getNavigation())[0].menu?.items[0];
    expect(item).not.toHaveProperty("filterDimension");
    // An unrecognised query is left alone rather than silently stripped.
    expect(item?.href).toBe("/fact-checks?filter=vibe");
  });

  it("takes the icon from the destination, defaulting when unlisted", async () => {
    tree(
      root,
      { id: 2, label: "About", uri: "/about", parent_id: 1 },
      { id: 3, label: "FAQs", uri: "/about/faqs", parent_id: 2 },
      { id: 4, label: "Somewhere new", uri: "/whatever", parent_id: 2 },
    );

    const items = (await getNavigation())[0].menu?.items ?? [];
    expect(items.map((i) => i.icon)).toEqual(["question", "grid"]);
  });

  it("drops items with no destination instead of rendering dead links", async () => {
    tree(
      root,
      { id: 2, label: "About", uri: "/about", parent_id: 1 },
      { id: 3, label: "Real", uri: "/real", parent_id: 2 },
      { id: 4, label: "Broken", uri: null, parent_id: 2 },
      { id: 5, label: null, uri: "/unnamed", parent_id: 2 },
    );

    expect((await getNavigation())[0].menu?.items.map((i) => i.label)).toEqual([
      "Real",
    ]);
  });

  it("gives a menu with no uri of its own the first item's destination", async () => {
    tree(
      root,
      { id: 2, label: "About Us", uri: null, parent_id: 1 },
      { id: 3, label: "Overview", uri: "/about", parent_id: 2 },
    );

    expect((await getNavigation())[0].href).toBe("/about");
  });

  it("falls back to the row name when a label is unset", async () => {
    // Publisher requires `name`; `label` is what an editor types, and the
    // dashboard leaves it empty on a freshly created root.
    tree(root, {
      id: 2,
      name: "Tools",
      label: "",
      uri: "/tools",
      parent_id: 1,
    });

    expect((await getNavigation())[0].label).toBe("Tools");
  });

  it("returns nothing when the menu is absent, so the static nav stands", async () => {
    tree({ id: 9, name: "Footer", parent_id: null });
    expect(await getNavigation()).toEqual([]);

    tree();
    expect(await getNavigation()).toEqual([]);
  });

  it("ignores other menus in the same tenant", async () => {
    tree(
      root,
      { id: 2, label: "About", uri: "/about", parent_id: 1 },
      { id: 9, name: "Footer Navigation", parent_id: null },
      { id: 10, label: "Imprint", uri: "/imprint", parent_id: 9 },
    );

    expect((await getNavigation()).map((l) => l.label)).toEqual(["About"]);
  });
});
