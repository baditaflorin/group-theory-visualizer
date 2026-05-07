import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { groupCatalogSchema } from "../../src/features/groups/schema";

describe("static catalog artifact", () => {
  it("is generated with the documented schema", () => {
    const artifact = JSON.parse(readFileSync("docs/data/v1/groups.json", "utf8")) as unknown;
    const catalog = groupCatalogSchema.parse(artifact);
    expect(catalog.schemaVersion).toBe("group-catalog/v1");
    expect(catalog.groups.length).toBeGreaterThanOrEqual(10);
  });
});
