import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/services/**/*.ts", "src/controllers/**/*.ts"],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: "forks",
    isolate: false,
    fileParallelism: false,
  },
});
