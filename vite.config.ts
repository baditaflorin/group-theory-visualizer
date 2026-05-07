import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

export default defineConfig({
  base: "/group-theory-visualizer/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_COMMIT__: JSON.stringify(process.env.VITE_GIT_COMMIT ?? "static"),
    __GIT_BRANCH__: JSON.stringify(process.env.VITE_GIT_BRANCH ?? "main"),
    __BUILD_DATE__: JSON.stringify(process.env.VITE_BUILD_DATE ?? "2026-05-08T00:00:00.000Z")
  },
  build: {
    outDir: "docs",
    emptyOutDir: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**", "docs/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"]
    }
  }
});
