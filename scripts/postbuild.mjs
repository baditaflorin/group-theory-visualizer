import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";

copyFileSync("docs/index.html", "docs/404.html");

mkdirSync("docs", { recursive: true });
writeFileSync("docs/.nojekyll", "");
