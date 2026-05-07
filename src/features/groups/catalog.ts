import rawCatalog from "@/data/group-catalog.json";
import { groupCatalogSchema, type FiniteGroup, type GroupCatalog } from "./schema";

export const catalog: GroupCatalog = groupCatalogSchema.parse(rawCatalog);

export const groups: FiniteGroup[] = catalog.groups;

export function findGroup(groupId: string): FiniteGroup {
  return groups.find((group) => group.id === groupId) ?? groups[0];
}
