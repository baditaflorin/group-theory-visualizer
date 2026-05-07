import { z } from "zod";

export const generatorSchema = z.object({
  label: z.string(),
  element: z.number().int().nonnegative(),
  color: z.string()
});

export const finiteGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  family: z.string(),
  order: z.number().int().positive(),
  description: z.string(),
  presentation: z.string(),
  symmetryKind: z.string(),
  elements: z.array(z.string()),
  operationTable: z.array(z.array(z.number().int().nonnegative())),
  generators: z.array(generatorSchema).min(1)
});

export const groupCatalogSchema = z.object({
  schemaVersion: z.literal("group-catalog/v1"),
  generatedAt: z.string(),
  source: z.string(),
  groups: z.array(finiteGroupSchema)
});

export type GroupGenerator = z.infer<typeof generatorSchema>;
export type FiniteGroup = z.infer<typeof finiteGroupSchema>;
export type GroupCatalog = z.infer<typeof groupCatalogSchema>;

export type GroupInvariantSummary = {
  isAbelian: boolean;
  identity: number;
  center: number[];
  elementOrders: number[];
  exponent: number;
  conjugacyClasses: number[][];
  derivedSetSize: number;
};
