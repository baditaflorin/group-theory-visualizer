import type { FiniteGroup, GroupInvariantSummary } from "./schema";

export function product(group: FiniteGroup, left: number, right: number): number {
  return group.operationTable[left][right];
}

export function findIdentity(group: FiniteGroup): number {
  for (let candidate = 0; candidate < group.order; candidate += 1) {
    const works = group.elements.every((_, element) => {
      return (
        product(group, candidate, element) === element &&
        product(group, element, candidate) === element
      );
    });
    if (works) return candidate;
  }
  throw new Error(`${group.id} has no identity element`);
}

export function inverseOf(
  group: FiniteGroup,
  element: number,
  identity = findIdentity(group)
): number {
  for (let candidate = 0; candidate < group.order; candidate += 1) {
    if (
      product(group, element, candidate) === identity &&
      product(group, candidate, element) === identity
    ) {
      return candidate;
    }
  }
  throw new Error(`${group.id}: ${group.elements[element]} has no inverse`);
}

export function elementOrder(
  group: FiniteGroup,
  element: number,
  identity = findIdentity(group)
): number {
  let current = identity;
  for (let count = 1; count <= group.order; count += 1) {
    current = product(group, current, element);
    if (current === identity) return count;
  }
  throw new Error(`${group.id}: ${group.elements[element]} has no finite order`);
}

export function isAbelian(group: FiniteGroup): boolean {
  for (let a = 0; a < group.order; a += 1) {
    for (let b = 0; b < group.order; b += 1) {
      if (product(group, a, b) !== product(group, b, a)) return false;
    }
  }
  return true;
}

export function center(group: FiniteGroup): number[] {
  const central: number[] = [];
  for (let a = 0; a < group.order; a += 1) {
    let commutes = true;
    for (let b = 0; b < group.order; b += 1) {
      if (product(group, a, b) !== product(group, b, a)) {
        commutes = false;
        break;
      }
    }
    if (commutes) central.push(a);
  }
  return central;
}

export function generatedSubgroup(group: FiniteGroup, seeds: number[]): number[] {
  const identity = findIdentity(group);
  const seen = new Set<number>([identity, ...seeds]);
  const queue = [...seen];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) break;
    for (const known of [...seen]) {
      for (const candidate of [product(group, current, known), product(group, known, current)]) {
        if (!seen.has(candidate)) {
          seen.add(candidate);
          queue.push(candidate);
        }
      }
    }
  }

  return [...seen].sort((a, b) => a - b);
}

export function conjugacyClasses(group: FiniteGroup): number[][] {
  const identity = findIdentity(group);
  const inverses = Array.from({ length: group.order }, (_, element) =>
    inverseOf(group, element, identity)
  );
  const remaining = new Set(Array.from({ length: group.order }, (_, i) => i));
  const classes: number[][] = [];

  while (remaining.size > 0) {
    const seed = remaining.values().next().value as number;
    const orbit = new Set<number>();
    for (let g = 0; g < group.order; g += 1) {
      orbit.add(product(group, product(group, g, seed), inverses[g]));
    }
    const sorted = [...orbit].sort((a, b) => a - b);
    for (const element of sorted) remaining.delete(element);
    classes.push(sorted);
  }

  return classes.sort((a, b) => a.length - b.length || a[0] - b[0]);
}

export function commutator(group: FiniteGroup, a: number, b: number): number {
  const identity = findIdentity(group);
  const ai = inverseOf(group, a, identity);
  const bi = inverseOf(group, b, identity);
  return product(group, product(group, product(group, ai, bi), a), b);
}

export function lcm(values: number[]): number {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  return values.reduce((acc, value) => (acc * value) / gcd(acc, value), 1);
}

export function summarizeGroup(group: FiniteGroup): GroupInvariantSummary {
  const identity = findIdentity(group);
  const elementOrders = group.elements.map((_, element) => elementOrder(group, element, identity));
  const commutators = new Set<number>();

  for (let a = 0; a < group.order; a += 1) {
    for (let b = 0; b < group.order; b += 1) {
      commutators.add(commutator(group, a, b));
    }
  }

  return {
    isAbelian: isAbelian(group),
    identity,
    center: center(group),
    elementOrders,
    exponent: lcm(elementOrders),
    conjugacyClasses: conjugacyClasses(group),
    derivedSetSize: generatedSubgroup(group, [...commutators]).length
  };
}

export function powers(group: FiniteGroup, element: number): number[] {
  const identity = findIdentity(group);
  const sequence = [identity];
  let current = identity;
  for (let count = 1; count <= group.order; count += 1) {
    current = product(group, current, element);
    sequence.push(current);
    if (current === identity) break;
  }
  return sequence;
}

export function formatElements(group: FiniteGroup, elements: number[], limit = 12): string {
  const labels = elements.slice(0, limit).map((element) => group.elements[element]);
  return elements.length > limit ? `${labels.join(", ")}, ...` : labels.join(", ");
}
