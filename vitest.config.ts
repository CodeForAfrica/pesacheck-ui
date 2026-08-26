import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirror the `@/*` path alias from tsconfig so tests import like app code.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // The data layer reads these at module load — set them before import.
    // `map.ts` needs the media base; `client.ts` throws without an API URL.
    env: {
      NEXT_PUBLIC_MEDIA_URL: "https://media.test/",
      NEXT_PUBLIC_API_URL: "https://graphql.test/v1/graphql",
      NEXT_PUBLIC_TENANT_CODE: "test",
    },
  },
});
