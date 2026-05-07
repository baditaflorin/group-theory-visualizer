import { describe, expect, it } from "vitest";
import { groups } from "./catalog";
import {
  elementOrder,
  findIdentity,
  generatedSubgroup,
  inverseOf,
  isAbelian,
  product,
  summarizeGroup
} from "./algebra";

describe("finite group catalog", () => {
  it("contains the required v1 breadth", () => {
    expect(groups.length).toBeGreaterThanOrEqual(10);
    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["v4", "q8", "s3", "s4", "d4"])
    );
  });

  it("satisfies identity and inverse laws for every catalog group", () => {
    for (const group of groups) {
      const identity = findIdentity(group);
      for (let element = 0; element < group.order; element += 1) {
        const inverse = inverseOf(group, element, identity);
        expect(product(group, identity, element)).toBe(element);
        expect(product(group, element, identity)).toBe(element);
        expect(product(group, element, inverse)).toBe(identity);
        expect(product(group, inverse, element)).toBe(identity);
      }
    }
  });

  it("classifies familiar groups", () => {
    const cyclic = groups.find((group) => group.id === "c6");
    const square = groups.find((group) => group.id === "d4");
    const quaternion = groups.find((group) => group.id === "q8");

    expect(cyclic).toBeDefined();
    expect(square).toBeDefined();
    expect(quaternion).toBeDefined();

    expect(isAbelian(cyclic!)).toBe(true);
    expect(isAbelian(square!)).toBe(false);
    expect(isAbelian(quaternion!)).toBe(false);
    expect(elementOrder(quaternion!, 2)).toBe(4);
  });

  it("selected generators span their intended groups", () => {
    for (const group of groups) {
      const generated = generatedSubgroup(
        group,
        group.generators.map((generator) => generator.element)
      );
      expect(generated.length, group.id).toBe(group.order);
    }
  });

  it("computes useful invariants for Q8", () => {
    const q8 = groups.find((group) => group.id === "q8");
    expect(q8).toBeDefined();
    const summary = summarizeGroup(q8!);
    expect(summary.center.map((element) => q8!.elements[element])).toEqual(["1", "-1"]);
    expect(summary.exponent).toBe(4);
    expect(summary.conjugacyClasses).toHaveLength(5);
  });
});
