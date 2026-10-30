import { describe, expect, it } from "vitest";
import { CONTENT_DESKS, deskBySlug, RETIRED_DESKS } from "@/lib/content-desks";

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

  it("retires every slug it no longer serves, rather than 404ing it", () => {
    // A retired slug must not also be a live desk, or the redirect would
    // shadow a page that exists.
    for (const slug of Object.keys(RETIRED_DESKS)) {
      expect(deskBySlug(slug)).toBeUndefined();
    }
    expect(RETIRED_DESKS.covid).toBe("/fact-checks/health");
    expect(RETIRED_DESKS["climate-change"]).toBe("/fact-checks/climate");
    expect(RETIRED_DESKS.employment).toBe("/fact-checks");
  });
});
