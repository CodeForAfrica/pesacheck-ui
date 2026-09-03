import { describe, expect, it } from "vitest";
import { offeredSecret } from "@/lib/revalidate-auth";

const none = new Headers();
const url = (query: string) => `https://site.test/api/revalidate${query}`;

describe("offeredSecret", () => {
  it("reads the query parameter Publisher has to use", () => {
    expect(offeredSecret(url("?secret=abc123"), none)).toBe("abc123");
  });

  it("keeps a '+' rather than form-decoding it to a space", () => {
    // The bug this guards: `URLSearchParams` treats `+` as a space, so a
    // base64 secret authenticated by header and 401'd by webhook — with no
    // Publisher delivery log to show why.
    expect(offeredSecret(url("?secret=ab+cd/ef=="), none)).toBe("ab+cd/ef==");
  });

  it("still decodes percent escapes, so either paste works", () => {
    expect(offeredSecret(url("?secret=ab%2Bcd"), none)).toBe("ab+cd");
  });

  it("decodes %20 — though Next turns it into '+' before we see it", () => {
    // Unit-level behaviour only: a route handler's `request.url` has already
    // been re-serialized, so `%20` reaches us as `+`. Asserted so nobody
    // "fixes" the decoding on the strength of a case the runtime never sends.
    expect(offeredSecret(url("?secret=a%20b"), none)).toBe("a b");
  });

  it("treats a malformed escape as literal instead of throwing", () => {
    expect(offeredSecret(url("?secret=ab%zz"), none)).toBe("ab%zz");
  });

  it("picks `secret` out of other parameters, and not a lookalike", () => {
    expect(offeredSecret(url("?a=1&secret=abc&b=2"), none)).toBe("abc");
    expect(offeredSecret(url("?not-secret=abc"), none)).toBe("");
    expect(offeredSecret(url("?secretariat=abc"), none)).toBe("");
  });

  it("falls back to either header form", () => {
    expect(
      offeredSecret(url(""), new Headers({ "x-revalidate-secret": "abc" })),
    ).toBe("abc");
    expect(
      offeredSecret(url(""), new Headers({ authorization: "Bearer abc" })),
    ).toBe("abc");
  });

  it("prefers the query string when both are present", () => {
    expect(
      offeredSecret(
        url("?secret=from-url"),
        new Headers({ "x-revalidate-secret": "from-header" }),
      ),
    ).toBe("from-url");
  });

  it("returns nothing when the request offers nothing", () => {
    expect(offeredSecret(url(""), none)).toBe("");
    expect(offeredSecret(url("?secret="), none)).toBe("");
    expect(offeredSecret(url("?secret"), none)).toBe("");
  });
});
