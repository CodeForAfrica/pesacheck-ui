import { describe, expect, it } from "vitest";
import { CONTENT_DESKS, deskBySlug } from "@/lib/content-desks";

describe("CONTENT_DESKS", () => {
  it("is the five desks PesaCheck runs, in order", () => {
    expect(CONTENT_DESKS.map((desk) => desk.name)).toEqual([
      "Climate",
      "Elections",
      "Gender",
      "Health",
      "Public Finances",
    ]);
  });

  it("files Covid-19 under Health rather than as a desk of its own", () => {
    expect(deskBySlug("health")?.topics).toEqual(["health", "covid"]);
    expect(deskBySlug("covid")).toBeUndefined();
  });

  it("lists Public Finances under its Claim Topic code", () => {
    expect(deskBySlug("public-finances")?.topics).toEqual(["finance"]);
  });
});
