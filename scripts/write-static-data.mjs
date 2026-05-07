import { mkdirSync, writeFileSync } from "node:fs";
import { buildCatalog } from "./group-catalog.mjs";

const catalog = buildCatalog();
const serialized = `${JSON.stringify(catalog, null, 2)}\n`;

mkdirSync("src/data", { recursive: true });
mkdirSync("docs/data/v1", { recursive: true });

writeFileSync("src/data/group-catalog.json", serialized);
writeFileSync("docs/data/v1/groups.json", serialized);
writeFileSync(
  "docs/data/v1/groups.meta.json",
  `${JSON.stringify(
    {
      schemaVersion: "group-catalog/v1",
      generatedAt: new Date().toISOString(),
      sourceCommit: process.env.GIT_COMMIT ?? "local",
      artifact: "groups.json"
    },
    null,
    2
  )}\n`
);
