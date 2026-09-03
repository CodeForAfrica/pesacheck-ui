import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The data client's env checks. These matter more than they look: a missing
 * value used to mean the whole site quietly served its static fallback, which
 * reads as unfinished content migration rather than a broken deploy.
 */

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadClient() {
  vi.resetModules();
  return import("@/lib/data/client");
}

describe("data client configuration", () => {
  it("loads when both required variables are set", async () => {
    await expect(loadClient()).resolves.toHaveProperty("gql");
  });

  it("throws when the API URL is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    await expect(loadClient()).rejects.toThrow("NEXT_PUBLIC_API_URL");
  });

  it("throws when the tenant code is missing", async () => {
    // An empty tenant is not an error to Hasura — it matches no rows — so
    // without this the site renders fallback content everywhere, silently.
    vi.stubEnv("NEXT_PUBLIC_TENANT_CODE", "");
    await expect(loadClient()).rejects.toThrow("NEXT_PUBLIC_TENANT_CODE");
  });

  it("names the variable and the fix in the message", async () => {
    vi.stubEnv("NEXT_PUBLIC_TENANT_CODE", "");
    await expect(loadClient()).rejects.toThrow(/Copy \.env\.example/);
  });
});
