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
    // map.ts reads NEXT_PUBLIC_MEDIA_URL at module load — set it before import.
    env: {
      NEXT_PUBLIC_MEDIA_URL: "https://media.test/",
    },
  },
});
