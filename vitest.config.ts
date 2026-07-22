import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    fileParallelism: false,
    include: [
      "server/__tests__/**/*.test.ts",
      "src/__tests__/**/*.test.{ts,tsx}",
    ],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["server/**/*.ts", "src/**/*.{ts,tsx}"],
      exclude: [
        "server/__tests__/**",
        "src/__tests__/**",
        "server/index.ts",
        "**/*.d.ts",
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 60,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
