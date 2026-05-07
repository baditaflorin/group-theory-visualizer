import { rmSync } from "node:fs";

const generatedPaths = [
  "docs/assets",
  "docs/wasm",
  "docs/data",
  "docs/index.html",
  "docs/404.html",
  "docs/manifest.webmanifest",
  "docs/sw.js",
  "docs/registerSW.js"
];

for (const path of generatedPaths) {
  rmSync(path, { recursive: true, force: true });
}
